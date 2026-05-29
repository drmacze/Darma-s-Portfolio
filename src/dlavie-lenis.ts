import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const installDlavieLenis = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const lenis = new Lenis({
    duration: 1.12,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.86,
    touchMultiplier: 1.12,
  });

  lenis.on("scroll", () => ScrollTrigger.update());

  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);
};

if (typeof window !== "undefined") {
  requestAnimationFrame(installDlavieLenis);
}
