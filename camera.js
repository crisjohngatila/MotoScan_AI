/* CAMERA - live in-app camera only. No AI code here.
   Needs a secure page (HTTPS or localhost). Other pages block getUserMedia. */
const Camera = (() => {
  let stream = null;
  const api = {
    onEnded: null,
    get isLive() { return !!(stream && stream.active); },
    supported() { return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia); },

    async start(video) {
      if (!this.supported()) { const e = new Error("unsupported"); e.name = "Unsupported"; throw e; }
      this.stop(video);
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      const track = stream.getVideoTracks()[0];
      if (track) track.addEventListener("ended", () => { if (stream) { stream = null; if (api.onEnded) api.onEnded(); } });
      video.srcObject = stream;
      try { await video.play(); } catch (e) { /* autoplay hiccup: stream is still attached */ }
    },

    stop(video) {
      if (stream) stream.getTracks().forEach(t => t.stop());
      stream = null;
      if (video) video.srcObject = null;
    },

    /* Draw any image/video source onto a canvas (max side 1024). This canvas is what the classifier receives. */
    toCanvas(src, w, h, maxSide = 1024) {
      const k = Math.min(1, maxSide / Math.max(w, h));
      const c = document.createElement("canvas");
      c.width = Math.round(w * k); c.height = Math.round(h * k);
      c.getContext("2d").drawImage(src, 0, 0, c.width, c.height);
      return c;
    },

    /* Capture the CURRENT video frame. */
    capture(video) {
      if (!video.videoWidth) throw new Error("The camera has no picture yet.");
      return this.toCanvas(video, video.videoWidth, video.videoHeight);
    },

    describe(e) {
      const n = e && e.name;
      if (n === "Unsupported" || !window.isSecureContext)
        return { title: "Live camera not available here", text: "Live camera needs a secure page (HTTPS or localhost) and a browser that supports it. This preview may block it. Try the page in Chrome, or use a gallery photo." };
      if (n === "NotAllowedError" || n === "SecurityError") return { title: "Camera permission denied", text: "Allow camera access for this app or browser in Android settings, then tap Retry." };
      if (n === "NotFoundError" || n === "OverconstrainedError") return { title: "No camera found", text: "No usable camera was detected on this device." };
      if (n === "NotReadableError" || n === "AbortError") return { title: "Camera is busy", text: "Another app may be using the camera. Close it and tap Retry." };
      return { title: "Camera could not start", text: "Something went wrong starting the camera. Tap Retry." };
    }
  };
  return api;
})();
