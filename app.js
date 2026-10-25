/* APP - screen logic. Camera code is in camera.js, AI in ai-model.js, part text in parts-data.js. */
const THRESHOLD_CONFIRMED = 0.85;  // >= : likely match (still verify)
const THRESHOLD_UNCERTAIN = 0.50;  // between: uncertain; below: not recognized
const MAX_BYTES = 10 * 1024 * 1024;
const TIPS = "Try a clearer photo with better lighting, a plain background, and one part centered in the frame.";

const $ = id => document.getElementById(id);
const els = {
  loading: $("loading-screen"), app: $("app"), err: $("loading-error"), errText: $("loading-error-text"), msg: $("loading-msg"),
  video: $("cam-video"), shot: $("shot"), stage: $("stage"), idle: $("cam-idle"), status: $("cam-status"), note: $("photo-note"),
  start: $("cam-start"), stop: $("cam-stop"), gallery: $("gallery-input"), scan: $("scan-btn"), scanning: $("scanning"),
  modal: $("modal"), sheet: $("sheet"), details: $("details"), dbody: $("dbody")
};
let mode = "idle", shotCanvas = null, shotUrl = "", busy = false, noteTimer = null;  // mode: idle | live | shot

/* Helpers: all text uses textContent, never innerHTML. */
function h(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
function btn(label, fn, cls) { const b = h("button", "btn " + (cls || "primary"), label); b.type = "button"; b.addEventListener("click", fn); return b; }
function note(msg) { clearTimeout(noteTimer); els.note.textContent = msg || ""; els.note.hidden = !msg; if (msg) noteTimer = setTimeout(() => { els.note.hidden = true; }, 6000); }

/* Startup */
AiModel.onStatus = t => { els.msg.textContent = t; };
function loadFailed(text) { els.msg.hidden = true; els.err.hidden = false; els.errText.textContent = text; }
window.addEventListener("error", e => { if (!els.loading.classList.contains("done")) loadFailed("Unexpected error: " + (e.message || "unknown") + (e.lineno ? " (line " + e.lineno + ")" : "")); });
window.addEventListener("unhandledrejection", e => { if (!els.loading.classList.contains("done")) loadFailed("Unexpected error: " + ((e.reason && e.reason.message) || e.reason || "unknown")); });
async function startup() {
  els.err.hidden = true; els.msg.hidden = false; els.msg.textContent = "Loading the AI model (starting)...";
  try { await Promise.all([AiModel.load(), new Promise(r => setTimeout(r, 700))]); finishLoading(); }
  catch (e) { els.msg.hidden = true; els.err.hidden = false; els.errText.textContent = "The AI model could not load: " + e.message; }
}
function finishLoading() { els.loading.classList.add("done"); els.app.hidden = false; setTimeout(() => { els.loading.hidden = true; }, 500); }
$("retry-load").addEventListener("click", startup);
$("skip-load").addEventListener("click", finishLoading);

/* Popups (one modal design for every result, warning and error) */
function closeModal() { els.modal.hidden = true; els.sheet.replaceChildren(); }
function backToScanner() {  // closes popup/details; the camera stream is NOT restarted
  closeModal(); els.details.hidden = true; shotCanvas = null; shotUrl = ""; els.shot.removeAttribute("src");
  setMode(Camera.isLive ? "live" : "idle");
}
function popup(kind, icon, title, paras, actions, extra) {
  const d = h("div", "pop " + kind), ic = h("div", "pic", icon), t = h("h2", "", title);
  ic.setAttribute("aria-hidden", "true"); t.id = "pop-title"; d.append(ic, t);
  (extra || []).forEach(n => d.appendChild(n));
  paras.forEach(p => d.appendChild(h("p", "", p)));
  const row = h("div", "acts"); actions.forEach(a => row.appendChild(a)); d.appendChild(row);
  els.sheet.replaceChildren(d); els.sheet.scrollTop = 0; els.modal.hidden = false;
  const first = els.sheet.querySelector("button"); if (first) first.focus();
}
els.modal.addEventListener("click", e => { if (e.target === els.modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { if (!els.details.hidden) backToScanner(); else if (!els.modal.hidden) closeModal(); } });
const thumb = () => { const i = h("img", "thumb"); i.src = shotUrl; i.alt = "Captured photo of the part"; return i; };
/* The model has 30 classes; PARTS_DATA only has guides for some. Match names loosely (case, spaces, underscores). */
const normKey = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
const findInfo = label => { const k = normKey(PART_ALIASES[label] || label); const name = Object.keys(PARTS_DATA).find(n => normKey(n) === k); return name ? PARTS_DATA[name] : null; };
const nice = label => String(label).replace(/_+/g, " ").trim().replace(/\b[a-z]/g, c => c.toUpperCase());

function camError(e) {
  popup("error", "\uD83D\uDCF7", e.title, [e.text], [
    btn("Retry", () => { closeModal(); startCamera(); }),
    btn("Use Gallery Photo", () => { closeModal(); openGallery(); }, "ghost"),
    btn("Return to Scanner", closeModal, "ghost")]);
}
function showImageError(title, fix) {
  popup("error", "\u26D4", title, [fix], [btn("Return to Scanner", closeModal), btn("Use Gallery Photo", () => { closeModal(); openGallery(); }, "ghost")]);
}
function showFailure(detail) {
  popup("error", "\u26D4", "Scan Failed", ["The scan could not be completed. " + detail, "No result is shown because nothing reliable was produced."], [btn("Try Again", backToScanner)]);
}

/* Camera UI */
function setMode(m) {
  mode = m;
  els.video.hidden = m !== "live"; els.shot.hidden = m !== "shot"; els.idle.hidden = m !== "idle";
  els.stage.classList.toggle("on", m !== "idle");
  els.start.hidden = Camera.isLive; els.stop.hidden = !Camera.isLive;
  const t = m === "live" ? ["Live camera", "live"] : m === "shot" ? ["Captured frame", "shot"] : ["Camera off", "off"];
  els.status.textContent = t[0]; els.status.dataset.k = t[1];
}
async function startCamera() {  // only called from a tap
  note(""); els.start.disabled = true; els.status.textContent = "Starting camera...";
  try { await Camera.start(els.video); setMode("live"); }
  catch (e) { Camera.stop(els.video); setMode(shotCanvas ? "shot" : "idle"); camError(Camera.describe(e)); }
  finally { els.start.disabled = false; }
}
function stopCamera() { Camera.stop(els.video); setMode(mode === "shot" && shotCanvas ? "shot" : "idle"); }
Camera.onEnded = () => { setMode(mode === "shot" && shotCanvas ? "shot" : "idle"); camError({ title: "Camera stopped", text: "The camera was disconnected or taken by another app. Tap Retry." }); };
els.start.addEventListener("click", startCamera);
els.stop.addEventListener("click", stopCamera);
window.addEventListener("pagehide", () => Camera.stop(els.video));
document.addEventListener("visibilitychange", () => {
  if (document.hidden && Camera.isLive) { stopCamera(); note("Camera paused while the app was in the background. Tap Start Camera."); }
});
function setShot() { shotUrl = shotCanvas.toDataURL("image/jpeg", 0.85); els.shot.src = shotUrl; setMode("shot"); }

/* Gallery alternative: image is drawn to the same canvas the classifier uses */
function openGallery() { note(""); els.gallery.value = ""; els.gallery.click(); }
$("gallery-btn").addEventListener("click", openGallery);
els.gallery.addEventListener("change", () => handleFile(els.gallery.files && els.gallery.files[0]));
els.gallery.addEventListener("cancel", () => note("No photo was selected."));
function handleFile(f) {
  if (!f) return note("No photo was received. Try again.");
  if (!f.type.startsWith("image/")) return showImageError("That file is not an image.", "Choose a JPG, PNG or WebP photo.");
  if (f.size > MAX_BYTES) return showImageError("That image is too large.", "Choose an image under 10 MB.");
  const url = URL.createObjectURL(f), im = new Image();
  im.onload = () => { shotCanvas = Camera.toCanvas(im, im.naturalWidth, im.naturalHeight); URL.revokeObjectURL(url); setShot(); };
  im.onerror = () => { URL.revokeObjectURL(url); showImageError("This image could not be opened.", "It may be damaged or unsupported. Choose another photo."); };
  im.src = url;
}

/* Classification: runs the real ONNX model on the exact captured frame. Any problem throws and is shown to the user. */
async function runClassification() {
  if (!AiModel.isConfigured) throw new Error("No AI model is connected.");
  const list = await AiModel.classify(shotCanvas);
  list.sort((a, b) => b.probability - a.probability);
  return { top: list[0] };
}

/* Scan Part: capture the CURRENT frame, then classify exactly that frame */
els.scan.addEventListener("click", async () => {
  if (busy) return;
  if (mode === "live") {
    try { shotCanvas = Camera.capture(els.video); setShot(); }
    catch (e) { return camError({ title: "Could not capture the frame", text: "The camera has no picture yet. Wait a moment and tap Scan Part again." }); }
  } else if (mode !== "shot" || !shotCanvas) {
    return showImageError("No camera image yet.", "Tap Start Camera, point at one part, then press Scan Part. You can also use a gallery photo.");
  }
  busy = true; els.scan.disabled = true; els.scanning.hidden = false; els.stage.classList.add("busy");
  try { showResult(await runClassification()); }
  catch (e) { showFailure(e.message); }
  finally { busy = false; els.scan.disabled = false; els.scanning.hidden = true; els.stage.classList.remove("busy"); }
});

/* Result popup */
function showResult(res) {
  const { top } = res, p = top.probability, info = findInfo(top.label), pct = Math.round(p * 100), name = nice(top.label);
  if (p < THRESHOLD_UNCERTAIN) {
    return popup("warn", "\u26A0\uFE0F", "Part Not Recognized", ["The photo could not be confidently matched to a part the model knows.", TIPS], [btn("Try Again", backToScanner)], [thumb()]);
  }
  const conf = h("div", "conf"), m = h("div", "meter"), bar = h("span");
  conf.append(h("span", "", "Confidence"), h("span", "", pct + "%"));
  bar.style.width = pct + "%"; m.appendChild(bar);
  const extra = [thumb(), conf, m];
  if (p < THRESHOLD_CONFIRMED) {
    const acts = [btn("Try Again", backToScanner)];
    if (info) acts.push(btn("View Possible Match Details", () => openDetails(res, false), "ghost"));
    return popup("warn", "\u26A0\uFE0F", "Identification Uncertain", ["Best guess: " + name + ". This may be incorrect, so do not treat it as confirmed.", TIPS], acts, extra);
  }
  const acts = info ? [btn("View Part Details", () => openDetails(res, true)), btn("Scan Again", backToScanner, "ghost")] : [btn("Scan Again", backToScanner)];
  popup("ok", "\u2705", name, [info ? info.summary : "No detailed guide for this part is in the app yet.", "AI can misidentify parts. Verify before buying, repairing or making safety decisions."], acts, extra);
}

/* Full details view (its own scroll; the scanner stays fixed behind it) */
function openDetails({ top }, confirmed) {
  const info = findInfo(top.label), b = els.dbody; b.replaceChildren();
  const hero = h("article", "card");
  hero.appendChild(h("p", "kind", confirmed ? "Likely match" : "Possible match (unconfirmed)"));
  hero.appendChild(h("h2", "", nice(top.label))); hero.appendChild(thumb());
  hero.appendChild(h("p", "", Math.round(top.probability * 100) + "% confidence. A score is not proof the match is right."));
  b.appendChild(hero);
  const sec = (icon, t, c, cls) => {
    const card = h("section", "card info " + (cls || "")), hd = h("h3"), ic = h("span", "ic", icon);
    ic.setAttribute("aria-hidden", "true"); hd.append(ic, document.createTextNode(t)); card.appendChild(hd);
    if (Array.isArray(c)) { const ul = h("ul"); c.forEach(x => ul.appendChild(h("li", "", x))); card.appendChild(ul); } else card.appendChild(h("p", "", c));
    b.appendChild(card); return card;
  };
  if (!confirmed) sec("\u26A0\uFE0F", "Not confirmed", "The identification was uncertain. Check the part before relying on anything below.", "warnbox");
  sec("\u2139\uFE0F", "What it is", info.description); sec("\u2699\uFE0F", "Main function", info.function); sec("\u2757", "Why it matters", info.importance);
  sec("\uD83D\uDC41\uFE0F", "Common signs of wear", info.wear).appendChild(h("p", "disc", "A photo and symptom list are not a diagnosis. A qualified mechanic should confirm any fault."));
  sec("\uD83D\uDD27", "Inspection and maintenance", info.maintenance); sec("\uD83D\uDED2", "Buying considerations", info.buying);
  sec("\u2705", "Compatibility", info.compatibility); sec("\u26A0\uFE0F", "Safety", info.safety, "safety");
  b.appendChild(h("p", "disc", "AI can misidentify parts. Verify before buying, repairing or making safety decisions."));
  closeModal(); els.details.hidden = false; b.scrollTop = 0; $("back-btn").focus();
}
$("back-btn").addEventListener("click", backToScanner);

setMode("idle");
startup();
