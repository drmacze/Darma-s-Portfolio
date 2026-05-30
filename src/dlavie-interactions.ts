import gsap from "gsap";

const installDlavieInteractions = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const progress = document.createElement("div");
  progress.className = "dlavie-scroll-progress";
  document.body.appendChild(progress);

  const updateProgress = () => {
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const value = window.scrollY / max;
    progress.style.transform = `scaleX(${Math.min(Math.max(value, 0), 1)})`;
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  if (!finePointer || reduceMotion) return;

  const cursor = document.createElement("div");
  const dot = document.createElement("div");
  cursor.className = "dlavie-cursor";
  dot.className = "dlavie-cursor-dot";
  document.body.append(cursor, dot);

  const cursorX = gsap.quickTo(cursor, "x", { duration: 0.34, ease: "power3.out" });
  const cursorY = gsap.quickTo(cursor, "y", { duration: 0.34, ease: "power3.out" });
  const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
  const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });

  window.addEventListener("pointermove", (event) => {
    cursorX(event.clientX);
    cursorY(event.clientY);
    dotX(event.clientX);
    dotY(event.clientY);
  });

  document.querySelectorAll<HTMLElement>("a,button,.ds-project-detail article,.dc-skill-card,.ds-orbit-grid article").forEach((target) => {
    target.addEventListener("pointerenter", () => {
      cursor.classList.add("is-active");
    });

    target.addEventListener("pointerleave", () => {
      cursor.classList.remove("is-active");
      gsap.to(target, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 0.45, ease: "elastic.out(1, .45)" });
    });

    target.addEventListener("pointermove", (event) => {
      const rect = target.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      const isCard = target.matches(".ds-project-detail article,.dc-skill-card,.ds-orbit-grid article");

      gsap.to(target, {
        x: x * (isCard ? 0.018 : 0.08),
        y: y * (isCard ? 0.018 : 0.08),
        rotateY: isCard ? x * 0.018 : 0,
        rotateX: isCard ? y * -0.018 : 0,
        duration: 0.32,
        ease: "power3.out",
      });
    });
  });
};

if (typeof window !== "undefined") {
  requestAnimationFrame(installDlavieInteractions);
}
