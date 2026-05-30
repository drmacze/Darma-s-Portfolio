import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const installDlavieMotionUpgrade = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const music = document.querySelector<HTMLElement>(".dlavie-music");
  if (music) {
    gsap.set(music, { y: 0, scale: 1, transformOrigin: "50% 50%" });

    gsap.to(music, {
      y: -14,
      scale: 0.96,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.55,
      },
    });

    ScrollTrigger.create({
      trigger: ".dt-hero",
      start: "bottom top",
      end: "bottom top-=1",
      onEnter: () => music.classList.add("is-compact"),
      onLeaveBack: () => music.classList.remove("is-compact"),
    });
  }

  gsap.utils.toArray<HTMLElement>(".ds-heading h2, .ds-editorial p, .ds-project-detail h3, .ds-contact h2, .ds-contact p").forEach((target) => {
    gsap.fromTo(
      target,
      { y: 34, autoAlpha: 0, filter: "blur(18px)", letterSpacing: "-.09em" },
      {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        letterSpacing: target.matches("h2") ? "-.075em" : "-.02em",
        duration: 0.95,
        ease: "power4.out",
        scrollTrigger: { trigger: target, start: "top 84%" },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>(".dh-about-media").forEach((card) => {
    const image = card.querySelector("img");
    gsap.to(card, {
      y: -24,
      rotateX: 3,
      ease: "none",
      scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
    });
    if (image) {
      gsap.to(image, {
        scale: 1.09,
        ease: "none",
        scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
      });
    }
  });

  gsap.utils.toArray<HTMLElement>(".dc-skill-card").forEach((card, index) => {
    const bar = card.querySelector<HTMLElement>(".dc-skill-meter b");
    if (!bar) return;
    const width = bar.style.width || "100%";
    gsap.fromTo(
      bar,
      { width: "0%", scaleX: 0, filter: "blur(10px)", opacity: 0.45 },
      {
        width,
        scaleX: 1,
        filter: "blur(0px)",
        opacity: 1,
        duration: 1.25,
        delay: index * 0.025,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 84%", once: false },
      },
    );
  });
};

if (typeof window !== "undefined") {
  requestAnimationFrame(installDlavieMotionUpgrade);
}
