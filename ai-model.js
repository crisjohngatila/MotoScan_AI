/* AI MODEL - runs motopartscls.onnx in the browser with ONNX Runtime Web.
   Contract used by app.js (unchanged):
     AiModel.isConfigured          -> true
     AiModel.load()                -> Promise<{ready}>  (throws Error with a readable message on failure)
     AiModel.classify(canvas)      -> Promise<[{label, probability}, ...]>  (throws Error on failure)
   Nothing here ever returns made-up predictions: any problem throws an Error that the app shows. */
const AiModel = (() => {
  const MODEL_URL = "./motopartscls.onnx";     // must sit next to index.html
  const LABELS_URL = "./labels.json";          // optional, see resolveLabels()
  const EXPECTED_CLASSES = 30;                 // from the inspected model report: output0 = [1, 30]
  const ORT_VERSION = "1.20.1";                // pinned; supports opset 18 / IR 8
  const ORT_BASE = "https://cdn.jsdelivr.net/npm/onnxruntime-web@" + ORT_VERSION + "/dist/";

  /* Preprocessing. The model report gives only the SHAPE (NCHW 1x3x224x224). The values below follow the
     usual Ultralytics classification export (RGB, 0..1, no mean/std, resize short side + center crop).
     That is an inference from the layer names and must be confirmed against your Python prediction. */
  const PRE = { size: 224, scale: 1 / 255, mean: [0, 0, 0], std: [1, 1, 1] };

  let ort = null, session = null, labels = null, inName = "", outName = "", loading = null, onStatus = null;
  const status = t => { try { if (onStatus) onStatus(t); } catch (e) { /* ignore */ } };
  const timeout = (promise, ms, msg) => new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error(msg)), ms);
    promise.then(v => { clearTimeout(t); res(v); }, e => { clearTimeout(t); rej(e); });
  });

  /* ---------- ONNX Runtime Web (loaded on demand so a failure shows a clear message) ---------- */
  function loadOrt() {
    if (window.ort) return Promise.resolve(window.ort);
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = ORT_BASE + "ort.min.js";
      s.onload = () => window.ort ? resolve(window.ort) : reject(new Error("ONNX Runtime Web loaded but is not usable."));
      s.onerror = () => { s.remove(); reject(new Error("Could not download ONNX Runtime Web. Check the internet connection and tap Retry.")); };
      document.head.appendChild(s);
    }).then(v => v, e => { throw e; });
  }

  /* ---------- Class names (never invented) ---------- */
  function toLabelArray(x) {
    if (Array.isArray(x)) return x.map(String);
    if (x && typeof x === "object") {            // {"0":"name","1":"name",...}
      const keys = Object.keys(x);
      if (!keys.every(k => /^\d+$/.test(k))) throw new Error("expected an array of names or an object keyed 0, 1, 2...");
      const arr = [];
      keys.forEach(k => { arr[Number(k)] = String(x[k]); });
      return arr;
    }
    throw new Error("expected an array of 30 class names.");
  }
  function validateLabels(arr, source) {
    if (arr.length !== EXPECTED_CLASSES) throw new Error(source + " has " + arr.length + " names but the model has " + EXPECTED_CLASSES + " outputs.");
    for (let i = 0; i < arr.length; i++) if (typeof arr[i] !== "string" || !arr[i].trim()) throw new Error(source + " has an empty name at index " + i + ".");
    if (new Set(arr.map(s => s.trim().toLowerCase())).size !== arr.length) throw new Error(source + " contains duplicate names.");
    return arr.map(s => s.trim());
  }

  /* Reads ModelProto.metadata_props (field 14) straight from the .onnx bytes. Ultralytics stores "names" there. */
  function readVarint(b, i) {
    let r = 0, mul = 1, x;
    do { x = b[i++]; if (x === undefined) throw new Error("truncated ONNX file"); r += (x & 0x7f) * mul; mul *= 128; } while (x & 0x80);
    return [r, i];
  }
  function readOnnxMetadata(bytes) {
    const out = {}, dec = new TextDecoder("utf-8");
    let i = 0;
    while (i < bytes.length) {
      let tag, len;
      [tag, i] = readVarint(bytes, i);
      const field = Math.floor(tag / 8), wt = tag % 8;
      if (wt === 0) { [, i] = readVarint(bytes, i); }
      else if (wt === 1) i += 8;
      else if (wt === 5) i += 4;
      else if (wt === 2) {
        [len, i] = readVarint(bytes, i);
        if (field === 14) {
          const e = bytes.subarray(i, i + len); let j = 0, key = "", val = "";
          while (j < e.length) {
            let t, l; [t, j] = readVarint(e, j); [l, j] = readVarint(e, j);
            const s = dec.decode(e.subarray(j, j + l)); j += l;
            if (Math.floor(t / 8) === 1) key = s; else if (Math.floor(t / 8) === 2) val = s;
          }
          if (key) out[key] = val;
        }
        i += len;
      } else throw new Error("unsupported ONNX encoding");
    }
    return out;
  }
  function parseNamesString(str) {
    try { const j = JSON.parse(str); return toLabelArray(j); } catch (e) { /* not JSON: Python dict text, e.g. {0: 'a', 1: 'b'} */ }
    const re = /(\d+)\s*:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/g, arr = []; let m;
    while ((m = re.exec(str))) arr[Number(m[1])] = (m[2] !== undefined ? m[2] : m[3]).replace(/\\(['"\\])/g, "$1");
    if (!arr.length) throw new Error("the 'names' metadata could not be read.");
    return arr;
  }

  async function resolveLabels(bytes) {
    /* 1) labels.json next to index.html (array of 30 names in output-index order) wins if present. */
    let res = null;
    try { res = await fetch(LABELS_URL, { cache: "no-cache" }); } catch (e) { res = null; }
    if (res && res.ok) {
      let data;
      try { data = await res.json(); } catch (e) { throw new Error("labels.json is not valid JSON."); }
      try { return validateLabels(toLabelArray(data), "labels.json"); } catch (e) { throw new Error("labels.json problem: " + e.message); }
    }
    /* 2) names stored inside the ONNX file. */
    let meta = {};
    try { meta = readOnnxMetadata(bytes); } catch (e) { meta = {}; }
    if (meta.names) {
      try { return validateLabels(parseNamesString(meta.names), "The names stored in the model"); }
      catch (e) { throw new Error("Class names in the model file are unusable: " + e.message); }
    }
    throw new Error("The 30 class names are not available. The model file has no embedded 'names' and labels.json was not found. " +
      "Add labels.json (a JSON array of the 30 class names in output-index order) next to index.html.");
  }

  /* ---------- Preprocessing: center-square crop of the short side, resize to 224x224, RGB, CHW float ---------- */
  function preprocess(src) {
    const S = PRE.size, w = src.width || src.naturalWidth, h = src.height || src.naturalHeight;
    if (!w || !h) throw new Error("The image has no pixels.");
    const side = Math.min(w, h), sx = (w - side) / 2, sy = (h - side) / 2;
    const c = document.createElement("canvas"); c.width = S; c.height = S;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(src, sx, sy, side, side, 0, 0, S, S);
    const px = ctx.getImageData(0, 0, S, S).data, n = S * S, f = new Float32Array(3 * n);
    for (let i = 0; i < n; i++) {
      const o = i * 4;
      f[i]         = (px[o]     * PRE.scale - PRE.mean[0]) / PRE.std[0];   // R plane
      f[n + i]     = (px[o + 1] * PRE.scale - PRE.mean[1]) / PRE.std[1];   // G plane
      f[2 * n + i] = (px[o + 2] * PRE.scale - PRE.mean[2]) / PRE.std[2];   // B plane
    }
    return f;
  }

  async function doLoad() {
    status("Step 1/4: downloading ONNX Runtime...");
    ort = await timeout(loadOrt(), 30000, "Downloading ONNX Runtime Web took more than 30 seconds. Check the internet connection (this browser must be able to reach cdn.jsdelivr.net) and tap Retry.");
    ort.env.wasm.wasmPaths = ORT_BASE;
    ort.env.wasm.numThreads = 1;      // no SharedArrayBuffer / cross-origin isolation needed (SPCK, Android WebView)
    ort.env.wasm.proxy = false;

    status("Step 2/4: reading motopartscls.onnx...");
    let res;
    try { res = await timeout(fetch(MODEL_URL, { cache: "no-cache" }), 30000, "timeout"); }
    catch (e) { throw new Error("Could not read motopartscls.onnx (" + (e && e.message) + "). Open the app through a web server (http://localhost or https), not as a plain file, and keep the model next to index.html."); }
    if (!res.ok) throw new Error("motopartscls.onnx was not found (HTTP " + res.status + "). Put it in the same folder as index.html.");
    const bytes = new Uint8Array(await timeout(res.arrayBuffer(), 60000, "Reading motopartscls.onnx took more than 60 seconds."));
    if (bytes.length < 1024 || bytes[0] !== 0x08) throw new Error("motopartscls.onnx is not a valid ONNX file (" + bytes.length + " bytes, first byte " + bytes[0] + "). It may be a placeholder, an error page or a damaged copy.");

    status("Step 3/4: starting the model (" + Math.round(bytes.length / 1024) + " KB)...");
    let s;
    try { s = await timeout(ort.InferenceSession.create(bytes, { executionProviders: ["wasm"], graphOptimizationLevel: "all" }), 90000, "Starting the model took more than 90 seconds. This browser may not support WebAssembly modules from the CDN."); }
    catch (e) { throw new Error("ONNX Runtime could not open the model: " + (e && e.message ? e.message : e)); }
    if (s.inputNames.length !== 1 || s.outputNames.length !== 1) throw new Error("Unexpected model: it has " + s.inputNames.length + " inputs and " + s.outputNames.length + " outputs (expected 1 and 1).");

    status("Step 4/4: reading class names...");
    const lbl = await resolveLabels(bytes);       // throws if the names cannot be established
    session = s; labels = lbl; inName = s.inputNames[0]; outName = s.outputNames[0];
    console.info("[MotoScan] model ready. input:", inName, "output:", outName, "classes:", labels.length);
    return { ready: true };
  }

  return {
    isConfigured: true,
    set onStatus(fn) { onStatus = fn; },
    load() {
      if (session) return Promise.resolve({ ready: true });
      if (!loading) loading = doLoad().finally(() => { loading = null; });
      return loading;
    },
    async classify(imgElement) {
      if (!session) throw new Error("The AI model is not loaded.");
      const data = preprocess(imgElement);
      let out;
      try {
        const r = await session.run({ [inName]: new ort.Tensor("float32", data, [1, 3, PRE.size, PRE.size]) });
        out = r[outName];
      } catch (e) { throw new Error("The model failed to run: " + (e && e.message ? e.message : e)); }
      if (!out || !out.data) throw new Error("The model returned no output.");
      const p = Array.from(out.data);
      if (p.length !== labels.length) throw new Error("The model returned " + p.length + " scores but " + labels.length + " class names are loaded.");
      const sum = p.reduce((a, b) => a + b, 0);
      if (p.some(v => !isFinite(v) || v < 0 || v > 1.0001) || Math.abs(sum - 1) > 0.05)
        throw new Error("The model output is not a probability list (sum " + sum.toFixed(3) + "). This is not the model that was inspected.");
      const list = p.map((v, i) => ({ label: labels[i], probability: v }));
      console.info("[MotoScan] top 5:", list.slice().sort((a, b) => b.probability - a.probability).slice(0, 5).map(x => x.label + " " + x.probability.toFixed(3)).join(" | "));
      return list;
    }
  };
})();
