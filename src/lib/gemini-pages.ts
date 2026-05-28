type PageConfig = {
  selector: string;
  label: string;
  kicker: string;
  icon: string;
};

const PAGES: PageConfig[] = [
  { selector: "#top", label: "Home", kicker: "Developer Stage", icon: "✦" },
  { selector: ".metrics-grid", label: "Signal", kicker: "Live Identity", icon: "◎" },
  { selector: ".signal-rail", label: "Language", kicker: "Motion System", icon: "◌" },
  { selector: "#workbench", label: "Projects", kicker: "Selected Work", icon: "⌘" },
  { selector: "#stack", label: "Skills", kicker: "Technology Wall", icon: "⬡" },
  { selector: "#about", label: "About", kicker: "Developer Profile", icon: "◈" },
  { selector: ".experience-section", label: "Journey", kicker: "Career Timeline", icon: "⌁" },
  { selector: "#contact", label: "Contact", kicker: "Build Together", icon: "↗" },
];

let installed = false;
let pageIndex = 0;
let wheelLocked = false;
let touchStartY: number | null = null;
let pages: HTMLElement[] = [];

function svgIcon(label: string, icon: string) {
  return `
    <div class="gemini-page-mark" aria-hidden="true">
      <span>${icon}</span>
      <small>${label}</small>
    </div>
  `;
}

function decoratePage(element: HTMLElement, config: PageConfig, index: number) {
  if (element.dataset.geminiDecorated === "true") return;

  element.classList.add("dlavie-page");
  element.dataset.geminiDecorated = "true";
  element.style.setProperty("--page-index", String(index));

  const chrome = document.createElement("div");
  chrome.className = "gemini-page-chrome";
  chrome.innerHTML = `
    ${svgIcon(config.label, config.icon)}
    <div class="gemini-page-meta">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <strong>${config.kicker}</strong>
    </div>
  `;

  const glow = document.createElement("div");
  glow.className = "gemini-page-glow";
  glow.setAttribute("aria-hidden", "true");

  const dust = document.createElement("div");
  dust.className = "gemini-page-dust";
  dust.setAttribute("aria-hidden", "true");

  element.prepend(chrome, glow, dust);
}

function collectPages() {
  pages = [];

  PAGES.forEach((config, index) => {
    const element = document.querySelector<HTMLElement>(config.selector);
    if (!element) return;

    decoratePage(element, config, index);
    pages.push(element);
  });

  document.documentElement.style.setProperty("--page-count", String(pages.length));
}

function setActivePage(index: number) {
  pageIndex = Math.max(0, Math.min(index, pages.length - 1));
  document.documentElement.style.setProperty("--active-page", String(pageIndex));

  pages.forEach((page, nextIndex) => {
    page.classList.toggle("is-active", nextIndex === pageIndex);
    page.classList.toggle("is-before", nextIndex < pageIndex);
    page.classList.toggle("is-after", nextIndex > pageIndex);
  });

  const dots = document.querySelectorAll<HTMLElement>(".gemini-page-dot");
  dots.forEach((dot, nextIndex) => {
    dot.classList.toggle("is-active", nextIndex === pageIndex);
  });
}

function nearestPageIndex() {
  if (!pages.length) return 0;

  let best = 0;
  let smallestDistance = Number.POSITIVE_INFINITY;

  pages.forEach((page, index) => {
    const distance = Math.abs(page.getBoundingClientRect().top);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      best = index;
    }
  });

  return best;
}

function goToPage(index: number) {
  if (!pages.length) return;

  const targetIndex = Math.max(0, Math.min(index, pages.length - 1));
  const target = pages[targetIndex];

  setActivePage(targetIndex);
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildPageNavigation() {
  if (document.querySelector(".gemini-page-nav")) return;

  const nav = document.createElement("nav");
  nav.className = "gemini-page-nav";
  nav.setAttribute("aria-label", "Portfolio pages");

  pages.forEach((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gemini-page-dot";
    button.setAttribute("aria-label", `Go to page ${index + 1}`);
    button.addEventListener("click", () => goToPage(index));
    nav.appendChild(button);
  });

  document.body.appendChild(nav);
}

function installSnapWheel() {
  window.addEventListener(
    "wheel",
    (event) => {
      if (document.querySelector(".welcome-gateway")) return;
      if (Math.abs(event.deltaY) < 18) return;

      event.preventDefault();

      if (wheelLocked) return;
      wheelLocked = true;

      const current = nearestPageIndex();
      goToPage(current + (event.deltaY > 0 ? 1 : -1));

      window.setTimeout(() => {
        wheelLocked = false;
      }, 950);
    },
    { passive: false },
  );

  window.addEventListener(
    "touchstart",
    (event) => {
      if (document.querySelector(".welcome-gateway")) return;
      touchStartY = event.touches[0]?.clientY ?? null;
    },
    { passive: true },
  );

  window.addEventListener(
    "touchend",
    (event) => {
      if (document.querySelector(".welcome-gateway")) return;
      const endY = event.changedTouches[0]?.clientY ?? null;
      if (touchStartY === null || endY === null) return;

      const delta = touchStartY - endY;
      touchStartY = null;

      if (Math.abs(delta) < 42 || wheelLocked) return;
      wheelLocked = true;

      const current = nearestPageIndex();
      goToPage(current + (delta > 0 ? 1 : -1));

      window.setTimeout(() => {
        wheelLocked = false;
      }, 950);
    },
    { passive: true },
  );

  window.addEventListener("keydown", (event) => {
    if (document.querySelector(".welcome-gateway")) return;

    if (event.key === "ArrowDown" || event.key === "PageDown") {
      event.preventDefault();
      goToPage(nearestPageIndex() + 1);
    }

    if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      goToPage(nearestPageIndex() - 1);
    }
  });
}

function installObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const index = pages.indexOf(visible.target as HTMLElement);
      if (index >= 0) setActivePage(index);
    },
    { threshold: [0.35, 0.5, 0.72] },
  );

  pages.forEach((page) => observer.observe(page));
}

function createDlavieLogoCanvas() {
  if (document.querySelector(".dlavie-logo-dust-canvas")) return;

  const canvas = document.createElement("canvas");
  canvas.className = "dlavie-logo-dust-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const particles: Array<{
    x: number;
    y: number;
    tx: number;
    ty: number;
    vx: number;
    vy: number;
    size: number;
    hue: number;
  }> = [];

  let width = 0;
  let height = 0;
  let frame = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.7);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    particles.length = 0;

    const centerX = width * 0.5;
    const centerY = height * 0.48;
    const scale = Math.min(width, height) * 0.16;
    const count = Math.min(850, Math.max(360, Math.floor(width * 0.9)));

    for (let i = 0; i < count; i += 1) {
      const t = (i / count) * Math.PI * 2;
      const ring = 0.54 + Math.random() * 0.46;
      const diamond = Math.abs(Math.cos(t)) + Math.abs(Math.sin(t));
      const radius = (scale * ring) / Math.max(diamond, 0.48);

      const notch = Math.sin(t * 2.0) * 0.14;
      const tx = centerX + Math.cos(t) * radius * (1 + notch);
      const ty = centerY + Math.sin(t) * radius * (1 - notch * 0.5);

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        tx,
        ty,
        vx: 0,
        vy: 0,
        size: 0.75 + Math.random() * 1.65,
        hue: [215, 265, 292, 180][i % 4],
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    const active = Number(getComputedStyle(document.documentElement).getPropertyValue("--active-page") || "0");
    const scatter = active % 2 === 0 ? 0.96 : 0.82;
    const time = performance.now() * 0.001;

    particles.forEach((particle, index) => {
      const orbit = Math.sin(time + index * 0.015) * 12;
      const targetX = particle.tx + Math.cos(index) * orbit * (1 - scatter);
      const targetY = particle.ty + Math.sin(index * 1.3) * orbit * (1 - scatter);

      particle.vx += (targetX - particle.x) * 0.012;
      particle.vy += (targetY - particle.y) * 0.012;
      particle.vx *= 0.86;
      particle.vy *= 0.86;
      particle.x += particle.vx;
      particle.y += particle.vy;

      ctx.beginPath();
      ctx.fillStyle = `hsla(${particle.hue}, 100%, 68%, ${0.17 + Math.random() * 0.18})`;
      ctx.shadowBlur = 14;
      ctx.shadowColor = `hsla(${particle.hue}, 100%, 68%, 0.55)`;
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    frame = window.requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize);

  window.addEventListener("beforeunload", () => {
    window.cancelAnimationFrame(frame);
  });
}

export function installGeminiPageExperience() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  const boot = () => {
    collectPages();

    if (!pages.length) {
      window.setTimeout(boot, 250);
      return;
    }

    buildPageNavigation();
    installObserver();
    installSnapWheel();
    createDlavieLogoCanvas();
    setActivePage(nearestPageIndex());
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    window.setTimeout(boot, 120);
  }
}
