type AudioConstructor = typeof Audio;

export function installAudioPolicy() {
  if (typeof window === "undefined") return;

  const win = window as Window & { __dlavieAudioPolicyInstalled?: boolean };
  if (win.__dlavieAudioPolicyInstalled) return;

  win.__dlavieAudioPolicyInstalled = true;

  const NativeAudio: AudioConstructor = window.Audio;

  window.Audio = function AudioPolicy(src?: string) {
    const audio = new NativeAudio();

    if (typeof src === "string" && src.includes("/audio/welcome.mp3")) {
      audio.muted = true;
      audio.volume = 0;
      audio.preload = "none";

      Object.defineProperty(audio, "src", {
        configurable: true,
        get() {
          return "";
        },
        set() {
          // Welcome audio is intentionally disabled. Homepage music remains opt-in.
        },
      });

      audio.play = () => Promise.reject(new DOMException("Welcome autoplay disabled", "NotAllowedError"));
      return audio;
    }

    if (src) audio.src = src;
    return audio;
  } as AudioConstructor;
}
