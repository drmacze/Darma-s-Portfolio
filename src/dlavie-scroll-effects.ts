import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const runDlavieScrollEffects = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  gsap.fromTo(
    ".dt-logo-panel",
    { y: 28, autoAlpha: 0, filter: "blur(16px)" },
    { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1, ease: "power4.out" },
  );

  gsap.fromTo(
    ".dt-hero-copy > *",
    { y: 36, autoAlpha: 0, filter: "blur(16px)" },
    { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.9, stagger: 0.06, ease: "power4.out", delay: 0.12 },
  );

  gsap.utils.toArray<HTMLElement>(".ds-section, .dh-contact").forEach((section) => {
    gsap.fromTo(
      section.querySelectorAll(".ds-heading, article, .ds-editorial p, .dh-about-media, .dc-skill-card"),
      { y: 42, autoAlpha: 0, filter: "blur(16px)" },
      { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.9, stagger: 0.055, ease: "power4.out", scrollTrigger: { trigger: section, start: "top 76%" } },
    );
  });

  gsap.utils.toArray<HTMLElement>(".dc-skill-meter b").forEach((bar) => {
    const finalWidth = bar.style.width || "100%";
    gsap.fromTo(
      bar,
      { width: "0%", scaleX: 0, transformOrigin: "left center", filter: "blur(7px)" },
      { width: finalWidth, scaleX: 1, filter: "blur(0px)", duration: 1.25, ease: "power3.out", scrollTrigger: { trigger: bar, start: "top 88%" } },
    );
  });

  gsap.to(".dt-banner-video", {
    yPercent: 8,
    scale: 1.08,
    ease: "none",
    scrollTrigger: { trigger: ".dt-hero", start: "top top", end: "bottom top", scrub: true },
  });

  gsap.to(".ds-webgl", {
    opacity: 0.62,
    ease: "none",
    scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: true },
  });
};

requestAnimationFrame(runDlavieScrollEffects);
