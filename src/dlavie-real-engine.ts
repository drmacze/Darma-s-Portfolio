import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Splitting from "splitting";
import "splitting/dist/splitting.css";

gsap.registerPlugin(ScrollTrigger);

const safeRun = () => {
  const media = Array.from(document.querySelectorAll<HTMLImageElement | HTMLVideoElement>("img,video"));
  media.forEach((el) => {
    el.setAttribute("referrerpolicy", "no-referrer");
    if (el instanceof HTMLImageElement) {
      el.loading = "eager";
      el.decoding = "async";
      if (el.src.includes("image-link.edgeone.app") && !el.dataset.dlavieReloaded) {
        el.dataset.dlavieReloaded = "true";
        el.src = el.src.split("?")[0] + "?dlavie-cache=off";
      }
    }
  });

  const splitTargets = ".dt-lead,.ds-editorial p,.ds-project-detail h3,.ds-orbit-grid h3,.ds-proof-grid h3,.ds-timeline h3,.ds-contact p";
  document.querySelectorAll<HTMLElement>(splitTargets).forEach((el) => {
    if (!el.dataset.splitting) el.dataset.splitting = "words";
  });

  Splitting({ target: "[data-splitting]" });

  gsap.fromTo(
    ".char",
    { yPercent: 115, opacity: 0, rotateX: -75, filter: "blur(16px)" },
    { yPercent: 0, opacity: 1, rotateX: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.009, ease: "power4.out" },
  );

  gsap.utils.toArray<HTMLElement>(".word").forEach((word) => {
    gsap.fromTo(word, { yPercent: 80, opacity: 0, filter: "blur(10px)" }, {
      yPercent: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.72,
      ease: "power4.out",
      scrollTrigger: { trigger: word, start: "top 92%" },
    });
  });

  gsap.utils.toArray<HTMLElement>(".dc-skill-meter b, .ds-skill-grid i").forEach((bar) => {
    const width = bar instanceof HTMLElement ? bar.style.width || "100%" : "100%";
    gsap.fromTo(bar, { width: "0%", scaleX: 0, transformOrigin: "left center" }, {
      width,
      scaleX: 1,
      duration: 1.25,
      ease: "power3.out",
      scrollTrigger: { trigger: bar, start: "top 86%" },
    });
  });
};

requestAnimationFrame(safeRun);
