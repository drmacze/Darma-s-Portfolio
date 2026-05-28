import { useEffect, useRef, useState, type CSSProperties, type TouchEvent } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./dlavie-experience.css";

type PageId = "home" | "about" | "skills" | "projects" | "journey" | "certs" | "contact";

type Page = {
  id: PageId;
  eyebrow: string;
  title: string;
  lead: string;
};

const pages: Page[] = [
  {
    id: "home",
    eyebrow: "Dlavie Developer Portfolio",
    title: "Creative developer system for Darma Dlavie.",
    lead: "A full-screen portfolio built like a product reveal: kinetic text, particle logo, programming identity, projects, career path, skills, and contact flow.",
  },
  {
    id: "about",
    eyebrow: "About",
    title: "I design interfaces like systems, then engineer them into motion.",
    lead: "Dlavie is the identity for building serious digital products: modern frontend, interaction design, visual effects, responsive detail, and production-oriented implementation.",
  },
  {
    id: "skills",
    eyebrow: "Skills",
    title: "Programming, animation, visual systems, and product UI.",
    lead: "A developer portfolio should prove capability quickly. This section compresses stack, design mindset, engineering discipline, and interaction ability into one visual stage.",
  },
  {
    id: "projects",
    eyebrow: "Projects",
    title: "Selected work that feels interactive, not listed.",
    lead: "Project cards are presented like product modules: each has purpose, stack, status, and interaction cues instead of a boring vertical list.",
  },
  {
    id: "journey",
    eyebrow: "Career Journey",
    title: "From learning web fundamentals into Dlavie product engineering.",
    lead: "This timeline is reserved for growth history, roles, milestones, and the way Darma thinks as a developer building toward Dlavie Project.",
  },
  {
    id: "certs",
    eyebrow: "Awards & Certifications",
    title: "Proof, recognition, and milestones stay visible.",
    lead: "Certification and achievement history gives recruiters or collaborators a faster reason to trust the technical direction.",
  },
  {
    id: "contact",
    eyebrow: "Contact",
    title: "Let’s turn Dlavie into a stronger digital presence.",
    lead: "Send project details, career assets, certificates, screenshots, and real copywriting. The system is ready to become a polished developer portfolio.",
  },
];

const tech = [
  ["React", "https://cdn.simpleicons.org/react/61DAFB"],
  ["TypeScript", "https://cdn.simpleicons.org/typescript/3178C6"],
  ["Vite", "https://cdn.simpleicons.org/vite/646CFF"],
  ["GSAP", "https://cdn.simpleicons.org/greensock/88CE02"],
  ["Three.js", "https://cdn.simpleicons.org/threedotjs/FFFFFF"],
  ["Framer", "https://cdn.simpleicons.org/framer/0055FF"],
  ["GLSL", "https://cdn.simpleicons.org/opengl/5586A4"],
  ["Vercel", "https://cdn.simpleicons.org/vercel/FFFFFF"],
  ["GitHub", "https://cdn.simpleicons.org/github/FFFFFF"],
  ["Figma", "https://cdn.simpleicons.org/figma/F24E1E"],
  ["Lottie", "https://cdn.simpleicons.org/lottie/00DDB3"],
  ["CSS3", "https://cdn.simpleicons.org/css3/1572B6"],
];

const skillGroups = [
  { icon: "⌘", title: "Frontend Architecture", text: "React components, TypeScript structure, state, performance, and clean UI composition." },
  { icon: "✦", title: "Motion UI", text: "Scroll transitions, text animation, micro-interactions, hover states, touch feedback, and page choreography." },
  { icon: "⬡", title: "Visual Effects", text: "Shader atmosphere, particle systems, gradient fields, blur layers, and product-reveal inspired visual direction." },
  { icon: "◈", title: "Responsive UX", text: "Mobile-first layout, compact full-page sections, readable hierarchy, and touch-friendly controls." },
];

const projects = [
  { no: "01", title: "Lumina", kind: "Web Product", stack: "React / TypeScript / Motion UI", text: "A product interface direction for Dlavie: clean UI, fast flow, and responsive component foundation." },
  { no: "02", title: "Dlavie Portfolio", kind: "Personal Brand", stack: "Vite / WebGL / GSAP", text: "This portfolio system with full-page navigation, particle logo, tech wall, and developer identity sections." },
  { no: "03", title: "Creative Case Study", kind: "Case Study Slot", stack: "UI/UX / Animation / Performance", text: "Reserved for the next strongest project with problem, process, build, and result documentation." },
];

const journey = [
  { time: "2026 — Now", title: "Creative Developer / Dlavie", text: "Building the Dlavie visual identity, frontend experiments, and product-style portfolio system." },
  { time: "2025 — 2026", title: "Web Development Learner", text: "Strengthening frontend foundations, deployment workflow, UI craft, and modern web tooling." },
  { time: "Next", title: "Product Engineering Direction", text: "Documenting projects, certificates, impact, and real shipped work for professional credibility." },
];

const certs = [
  { icon: "🏆", title: "Awards", text: "Add competition wins, school awards, or public recognition here." },
  { icon: "📜", title: "Certifications", text: "Add web, programming, UI/UX, cloud, or AI certificates here." },
  { icon: "🚀", title: "Milestones", text: "Add launches, deployments, version releases, and Dlavie progress history here." },
];

function DlavieLogo({ className = "" }: { className?: string }) {
  return (
    <svg className={`dlv-logo ${className}`} viewBox="0 0 200 200" aria-label="Dlavie logo" role="img">
      <defs>
        <linearGradient id="dlv-g" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#40c9ff" />
          <stop offset="0.36" stopColor="#7c3aed" />
          <stop offset="0.68" stopColor="#ff4ecd" />
          <stop offset="1" stopColor="#36f6c3" />
        </linearGradient>
        <filter id="dlv-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.25 0 0 0 0 0.78 0 0 0 0 1 0 0 0 0.72 0" />
          <feBlend in="SourceGraphic" />
        </filter>
      </defs>
      <path filter="url(#dlv-glow)" fill="url(#dlv-g)" d="M100 8C118 55 145 82 192 100C145 118 118 145 100 192C82 145 55 118 8 100C55 82 82 55 100 8Z" />
      <path fill="#050509" d="M87 52C104 73 108 92 103 110C98 128 83 143 58 150C74 164 104 166 128 151C153 135 165 107 157 81C150 57 128 42 101 42C96 42 91 47 87 52Z" opacity="0.96" />
      <circle cx="156" cy="52" r="10" fill="#ff4ecd" />
    </svg>
  );
}

function ParticleLogo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    const particles: Array<{ x: number; y: number; tx: number; ty: number; vx: number; vy: number; s: number; c: string }> = [];
    const colors = ["64,201,255", "124,58,237", "255,78,205", "54,246,195", "248,250,252"];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.8);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles.length = 0;

      const centerX = width * 0.5;
      const centerY = height * 0.46;
      const scale = Math.min(width, height) * 0.19;
      const count = Math.min(1100, Math.max(420, Math.floor(width * 1.15)));

      for (let i = 0; i < count; i += 1) {
        const t = (i / count) * Math.PI * 2;
        const diamond = Math.abs(Math.cos(t)) + Math.abs(Math.sin(t));
        const ring = 0.58 + Math.random() * 0.43;
        const r = (scale * ring) / Math.max(diamond, 0.52);
        const notch = 1 + Math.sin(t * 2.2) * 0.12;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          tx: centerX + Math.cos(t) * r * notch,
          ty: centerY + Math.sin(t) * r * (1 - Math.cos(t) * 0.04),
          vx: 0,
          vy: 0,
          s: 0.75 + Math.random() * 1.75,
          c: colors[i % colors.length],
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      const time = performance.now() * 0.001;
      const active = Number(document.documentElement.dataset.page || "0");
      const scatter = active % 2 === 0 ? 1 : 0.86;

      particles.forEach((p, i) => {
        const wave = Math.sin(time * 1.4 + i * 0.018) * 16 * (1 - scatter);
        const targetX = p.tx + Math.cos(i * 0.9) * wave;
        const targetY = p.ty + Math.sin(i * 1.1) * wave;
        p.vx += (targetX - p.x) * 0.012;
        p.vy += (targetY - p.y) * 0.012;
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.shadowBlur = 18;
        ctx.shadowColor = `rgba(${p.c}, .65)`;
        ctx.fillStyle = `rgba(${p.c}, ${0.14 + Math.random() * 0.22})`;
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
      });

      frame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="dlv-particle-canvas" aria-hidden="true" />;
}

function PageFrame({ page, index, active, children }: { page: Page; index: number; active: number; children: React.ReactNode }) {
  return (
    <section className={`dlv-page ${active === index ? "is-active" : active > index ? "is-before" : "is-after"}`} data-page-id={page.id}>
      <div className="dlv-page-topline">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <strong>{page.eyebrow}</strong>
      </div>
      <div className="dlv-glow" aria-hidden="true" />
      <div className="dlv-dust" aria-hidden="true" />
      {children}
    </section>
  );
}

function HomePage({ page }: { page: Page }) {
  return (
    <div className="dlv-home-grid">
      <div className="dlv-copy">
        <p className="dlv-eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p>{page.lead}</p>
        <div className="dlv-actions">
          <a href="mailto:your-email@example.com">Contact Darma</a>
          <a href="https://github.com/drmacze" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
      <div className="dlv-logo-stage">
        <DlavieLogo />
        <div className="dlv-orbit-text">REACT • TYPESCRIPT • MOTION • WEBGL • DLAVIE •</div>
      </div>
    </div>
  );
}

function AboutPage({ page }: { page: Page }) {
  return (
    <div className="dlv-split">
      <div className="dlv-copy">
        <p className="dlv-eyebrow">{page.eyebrow}</p>
        <h2>{page.title}</h2>
        <p>{page.lead}</p>
      </div>
      <div className="dlv-panel dlv-profile-card">
        <DlavieLogo className="mini" />
        <h3>Darma / Dlavie</h3>
        <p>Creative developer focused on programming, visual systems, modern UI/UX, responsive web, and interactive product presentation.</p>
        <div className="dlv-chip-row"><span>Frontend</span><span>Motion</span><span>UI/UX</span><span>WebGL</span></div>
      </div>
    </div>
  );
}

function SkillsPage({ page }: { page: Page }) {
  return (
    <div className="dlv-split wide">
      <div className="dlv-copy">
        <p className="dlv-eyebrow">{page.eyebrow}</p>
        <h2>{page.title}</h2>
        <p>{page.lead}</p>
      </div>
      <div className="dlv-skill-stage">
        {skillGroups.map((item) => (
          <article key={item.title} className="dlv-panel dlv-skill-card">
            <span className="dlv-icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
      <div className="dlv-tech-rail" aria-label="Technology stack">
        {tech.map(([name, icon]) => (
          <span key={name}><img src={icon} alt="" />{name}</span>
        ))}
      </div>
    </div>
  );
}

function ProjectsPage({ page }: { page: Page }) {
  const [active, setActive] = useState(0);
  const project = projects[active];
  return (
    <div className="dlv-split wide">
      <div className="dlv-copy">
        <p className="dlv-eyebrow">{page.eyebrow}</p>
        <h2>{page.title}</h2>
        <p>{page.lead}</p>
      </div>
      <div className="dlv-project-stage">
        <nav className="dlv-project-tabs">
          {projects.map((item, index) => (
            <button className={active === index ? "is-active" : ""} key={item.title} onClick={() => setActive(index)} type="button">
              <span>{item.no}</span><strong>{item.title}</strong><small>{item.kind}</small>
            </button>
          ))}
        </nav>
        <article className="dlv-panel dlv-project-focus">
          <div className="dlv-project-visual"><DlavieLogo className="mini" /></div>
          <p className="dlv-eyebrow">{project.stack}</p>
          <h3>{project.title}</h3>
          <p>{project.text}</p>
        </article>
      </div>
    </div>
  );
}

function JourneyPage({ page }: { page: Page }) {
  return (
    <div className="dlv-split wide">
      <div className="dlv-copy">
        <p className="dlv-eyebrow">{page.eyebrow}</p>
        <h2>{page.title}</h2>
        <p>{page.lead}</p>
      </div>
      <div className="dlv-timeline">
        {journey.map((item) => (
          <article key={item.time} className="dlv-panel dlv-time-card">
            <span>{item.time}</span><h3>{item.title}</h3><p>{item.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function CertsPage({ page }: { page: Page }) {
  return (
    <div className="dlv-split wide">
      <div className="dlv-copy">
        <p className="dlv-eyebrow">{page.eyebrow}</p>
        <h2>{page.title}</h2>
        <p>{page.lead}</p>
      </div>
      <div className="dlv-cert-grid">
        {certs.map((item) => (
          <article className="dlv-panel dlv-cert-card" key={item.title}>
            <span>{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function ContactPage({ page }: { page: Page }) {
  return (
    <div className="dlv-contact-card dlv-panel">
      <p className="dlv-eyebrow">{page.eyebrow}</p>
      <h2>{page.title}</h2>
      <p>{page.lead}</p>
      <div className="dlv-actions">
        <a href="mailto:your-email@example.com">Email</a>
        <a href="https://github.com/drmacze" target="_blank" rel="noreferrer">GitHub</a>
        <a href="#home">Back to top</a>
      </div>
    </div>
  );
}

function renderPage(page: Page) {
  if (page.id === "home") return <HomePage page={page} />;
  if (page.id === "about") return <AboutPage page={page} />;
  if (page.id === "skills") return <SkillsPage page={page} />;
  if (page.id === "projects") return <ProjectsPage page={page} />;
  if (page.id === "journey") return <JourneyPage page={page} />;
  if (page.id === "certs") return <CertsPage page={page} />;
  return <ContactPage page={page} />;
}

export default function DlavieExperience() {
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);
  const lock = useRef(false);

  const go = (next: number) => {
    const index = Math.max(0, Math.min(next, pages.length - 1));
    setActive(index);
    document.documentElement.dataset.page = String(index);
  };

  useEffect(() => {
    document.documentElement.dataset.page = "0";
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 14 || lock.current) return;
      lock.current = true;
      go(active + (event.deltaY > 0 ? 1 : -1));
      window.setTimeout(() => { lock.current = false; }, 720);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "PageDown") go(active + 1);
      if (event.key === "ArrowUp" || event.key === "PageUp") go(active - 1);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const onTouchStart = (event: TouchEvent<main>) => {
    touchStart.current = event.touches[0]?.clientY ?? null;
  };

  const onTouchEnd = (event: TouchEvent<main>) => {
    const end = event.changedTouches[0]?.clientY ?? null;
    const start = touchStart.current;
    touchStart.current = null;
    if (start === null || end === null) return;
    const delta = start - end;
    if (Math.abs(delta) > 42) go(active + (delta > 0 ? 1 : -1));
  };

  return (
    <main className="dlv-root" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <ParticleLogo />
      <header className="dlv-nav">
        <a href="#home" onClick={(e) => { e.preventDefault(); go(0); }}><DlavieLogo className="nav" /><span>Dlavie</span></a>
        <nav>{pages.map((page, index) => <button className={active === index ? "is-active" : ""} key={page.id} onClick={() => go(index)} type="button">{page.id}</button>)}</nav>
      </header>
      <div className="dlv-page-track" style={{ "--active": active } as CSSProperties}>
        {pages.map((page, index) => (
          <PageFrame key={page.id} page={page} index={index} active={active}>{renderPage(page)}</PageFrame>
        ))}
      </div>
      <div className="dlv-dots" aria-label="Page navigation">
        {pages.map((page, index) => <button type="button" key={page.id} className={active === index ? "is-active" : ""} onClick={() => go(index)} aria-label={`Go to ${page.id}`} />)}
      </div>
      <Analytics />
      <SpeedInsights />
    </main>
  );
}
