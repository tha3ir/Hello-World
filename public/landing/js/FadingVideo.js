// Background video with a custom rAF-driven crossfade at the loop point.
// No CSS transitions and no native `loop` — looping is implemented manually
// via `ended` so we can fade out before the cut and fade back in after reset.

const FADE_MS = 500;
const FADE_OUT_LEAD = 0.55; // seconds before the end to start fading out

function FadingVideo({ src, className, style }) {
  const videoRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const fadingOutRef = React.useRef(false);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Resumes from wherever the previous fade left off: current opacity is
    // read back from video.style.opacity, and any in-flight rAF is cancelled.
    const fadeTo = (target, duration = FADE_MS) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const from = parseFloat(video.style.opacity);
      const start = isNaN(from) ? 0 : from;
      const t0 = performance.now();
      const step = (now) => {
        const t = Math.min((now - t0) / duration, 1);
        video.style.opacity = String(start + (target - start) * t);
        if (t < 1) rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    };

    const onLoadedData = () => {
      video.style.opacity = "0";
      video.play().catch(() => {});
      fadeTo(1);
    };

    const onTimeUpdate = () => {
      const remaining = video.duration - video.currentTime;
      if (!fadingOutRef.current && remaining <= FADE_OUT_LEAD && remaining > 0) {
        fadingOutRef.current = true;
        fadeTo(0);
      }
    };

    const onEnded = () => {
      video.style.opacity = "0";
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
        fadingOutRef.current = false;
        fadeTo(1);
      }, 100);
    };

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      style={{ opacity: 0, ...style }}
      autoPlay
      muted
      playsInline
      preload="auto"
    />
  );
}

window.FadingVideo = FadingVideo;
