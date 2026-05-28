let installed = false;
let hasPlayed = false;
let lastTouchY: number | null = null;

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  return new AudioContextClass();
}

function playTone(context: AudioContext, frequency: number, startTime: number, duration: number, gainValue: number) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.018, startTime + duration * 0.42);

  filter.type = "highpass";
  filter.frequency.setValueAtTime(820, startTime);
  filter.Q.setValueAtTime(0.7, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(gainValue, startTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.03);
}

function playKlink() {
  if (hasPlayed) return;
  if (typeof window === "undefined") return;

  const welcome = document.querySelector(".welcome-gateway");
  if (!welcome) return;

  hasPlayed = true;

  try {
    const context = getAudioContext();
    const now = context.currentTime;

    if (context.state === "suspended") {
      void context.resume();
    }

    // Immediate glass tick as user starts entering.
    playTone(context, 1260, now + 0.012, 0.34, 0.07);
    playTone(context, 1840, now + 0.035, 0.28, 0.034);

    // Second soft chime timed near homepage reveal.
    playTone(context, 960, now + 0.54, 0.42, 0.05);
    playTone(context, 1520, now + 0.585, 0.36, 0.03);

    window.setTimeout(() => {
      void context.close().catch(() => undefined);
    }, 1300);
  } catch {
    // Audio is enhancement-only. If the browser blocks it, visual transition still works.
  }
}

export function installWelcomeKlinkSound() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  const onWheel = (event: WheelEvent) => {
    if (Math.abs(event.deltaY) < 6) return;
    playKlink();
  };

  const onTouchStart = (event: TouchEvent) => {
    lastTouchY = event.touches[0]?.clientY ?? null;
  };

  const onTouchEnd = (event: TouchEvent) => {
    const endY = event.changedTouches[0]?.clientY ?? null;
    if (lastTouchY === null || endY === null) return;

    const delta = lastTouchY - endY;
    lastTouchY = null;

    if (Math.abs(delta) > 18) playKlink();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === " " || event.key === "Enter") {
      playKlink();
    }
  };

  window.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("keydown", onKeyDown);
}
