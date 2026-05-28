import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type TouchEvent } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./dlavie-emerald.css";

type PageId = "home" | "profile" | "skills" | "projects" | "journey" | "proof" | "contact";

type Page = {
  id: PageId;
  index: string;
  tag: string;
  title: string;
  lead: string;
};

const pages: Page[] = [
  { id: "home", index: "01", tag: "Dlavie / Developer", title: "Black interface. Emerald signal. Developer portfolio.", lead: "A sharper portfolio for Darma Dlavie: programming identity, motion system, project evidence, career journey, skill stack, and contact flow in a full-screen experience." },
  { id: "profile", index: "02", tag: "About", title: "I build web interfaces with product logic and visual discipline.", lead: "Dlavie is positioned as a developer identity: clean engineering, strong UI/UX, responsive systems, motion details, and premium visual execution without noisy colors." },
  { id: "skills", index: "03", tag: "Skills", title: "Frontend architecture, UI motion, WebGL atmosphere, and responsive UX.", lead: "The skill section is designed like a control room: real technology marks, compact capability modules, and animated green signal rails." },
  { id: "projects", index: "04", tag: "Projects", title: "Selected works displayed as product modules, not boring lists.", lead: "Each project has role, stack, status, and direction. Replace placeholders later with real case studies, screenshots, and links." },
  { id: "journey", index: "05", tag: "Career Journey", title: "From learning fundamentals to building Dlavie as a serious system.", lead: "Career history should prove growth: what you learned, what you shipped, what changed, and where the technical direction is going." },
  { id: "proof", index: "06", tag: "Awards / Certifications", title: "Evidence, certificates, achievements, and milestones stay visible.", lead: "This page is prepared for course certificates, competition results, launch milestones, and public recognition." },
  { id: "contact", index: "07", tag: "Contact", title: "Ready to refine Dlavie into a stronger developer brand.", lead: "Add your final email, social links, project URLs, certificates, and personal photo later. The interface is already structured for a premium portfolio." },
];

const tech = [
  ["React", "https://cdn.simpleicons.org/react/00ff88"],
  ["TypeScript", "https://cdn.simpleicons.org/typescript/00e676"],
  ["Vite", "https://cdn.simpleicons.org/vite/56ff9c"],
  ["GSAP", "https://cdn.simpleicons.org/greensock/88ff00"],
  ["Three.js", "https://cdn.simpleicons.org/threedotjs/eafff4"],
  ["Framer", "https://cdn.simpleicons.org/framer/00ff88"],
  ["Vercel", "https://cdn.simpleicons.org/vercel/eafff4"],
  ["GitHub", "https://cdn.simpleicons.org/github/eafff4"],
  ["Figma", "https://cdn.simpleicons.org/figma/00ff88"],
  ["CSS3", "https://cdn.simpleicons.org/css3/18f5a9"],
  ["GLSL", "https://cdn.simpleicons.org/opengl/64ffbd"],
  ["Lottie", "https://cdn.simpleicons.org/lottie/4dff91"],
];

const skills = [
  { icon: "⌘", title: "Frontend System", text: "React components, TypeScript structure, reusable UI, clean state, and maintainable code." },
  { icon: "▣", title: "Interface Design", text: "Hierarchy, spacing, typography, section rhythm, responsive composition, and usability." },
  { icon: "✦", title: "Motion Direction", text: "Page transition, text reveal, magnetic controls, ambient animation, and micro feedback." },
  { icon: "◌", title: "Visual Effects", text: "Particle bloom, neon gradients, WebGL-style atmosphere, shader-inspired depth, and glow." },
];

const projects = [
  { no: "01", title: "Lumina", kind: "Web Product", stack: "React / TypeScript / Motion", text: "Dlavie product interface concept for clean web experience, responsive layout, and product-led UI." },
  { no: "02", title: "Dlavie Portfolio", kind: "Personal Brand", stack: "Vite / WebGL / Neon UI", text: "Full-screen developer portfolio with emerald bloom, page navigation, particle logo, and tech stack wall." },
  { no: "03", title: "Case Study Slot", kind: "Future Proof", stack: "UX / Build / Result", text: "Prepared for a real project case study with problem, process, role, result, and performance evidence." },
];

const journey = [
  { time: "2026 — Now", title: "Creative Developer / Dlavie", text: "Building the Dlavie project identity, portfolio system, UI direction, and frontend experiments." },
  { time: "2025 — 2026", title: "Web Development Learner", text: "Strengthening HTML, CSS, JavaScript, React, deployment, component design, and interface thinking." },
  { time: "Next", title: "Product Engineering Path", text: "Document real products, certificates, project metrics, and professional proof to support Dlavie growth." },
];

const proof = [
  { mark: "01", title: "Certifications", text: "Add programming, UI/UX, cloud, AI, or web development certificates here." },
  { mark: "02", title: "Awards", text: "Add competition, school, community, or public achievement history here." },
  { mark: "03", title: "Milestones", text: "Add product launches, portfolio versions, deploy records, and Dlavie progress here." },
];

function DlavieMark({ small = false }: { small?: boolean }) {
  return (
    <svg className={small ? "em-logo small" : "em-logo"} viewBox="0 0 200 200" aria-label="Dlavie logo" role="img">
      <defs>
        <linearGradient id="em-logo-gradient" x1="18" y1="18" x2="182" y2="182" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d8ffef" />
          <stop offset="0.26" stopColor="#7cffb2" />
          <stop offset="0.54" stopColor="#00ff88" />
          <stop offset="0.78" stopColor="#00d26f" />
          <stop offset="1" stopColor="#0b5f3b" />
        </linearGradient>
        <filter id="em-bloom" x="-55%" y="-55%" width="210%" height="210%">
          <feGaussianBlur stdDeviation="8" result="bloom" />
          <feColorMatrix in="bloom" type="matrix" values="0 0 0 0 0 0 0 0 0 1 0 0 0 0 0.52 0 0 0 .95 0" />
          <feBlend in="SourceGraphic" />
        </filter>
      </defs>
      <path filter="url(#em-bloom)" fill="url(#em-logo-gradient)" d="M100 8C118 55 145 82 192 100C145 118 118 145 100 192C82 145 55 118 8 100C55 82 82 55 100 8Z" />
      <path fill="#030705" d="M86 50C105 73 109 92 103 111C97 130 81 145 56 151C77 168 110 164 133 147C157 129 166 100 154 75C145 55 124 42 101 42C95 42 90 46 86 50Z" opacity="0.98" />
      <circle cx="154" cy="50" r="8" fill="#b7ffd8" />
    </svg>
  );
}

function ParticleBloom() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    const dots: Array<{ x: number; y: number; tx: number; ty: number; vx: number; vy: number; size: number; color: string }> = [];
    const colors = ["0,255,136", "100,255,189", "184,255,216", "0,210,111", "102,255,122"];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      dots.length = 0;

      const cx = width * 0.54;
      const cy = height * 0.48;
      const scale = Math.min(width, height) * 0.18;
      const count = Math.min(1000, Math.max(420, Math.floor(width * 1.05)));

      for (let i = 0; i < count; i += 1) {
        const t = (i / count) * Math.PI * 2;
        const diamond = Math.abs(Math.cos(t)) + Math.abs(Math.sin(t));
        const ring = 0.55 + Math.random() * 0.45;
        const radius = (scale * ring) / Math.max(diamond, 0.52);
        const dent = 1 + Math.sin(t * 2.4) * 0.12;
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          tx: cx + Math.cos(t) * radius * dent,
          ty: cy + Math.sin(t) * radius,
          vx: 0,
          vy: 0,
          size: 0.65 + Math.random() * 1.7,
          color: colors[i % colors.length],
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      const active = Number(document.documentElement.dataset.page || "0");
      const time = performance.now() * 0.001;
      const loosen = active % 2 === 0 ? 0.8 : 1.0;

      dots.forEach((dot, i) => {
        const wave = Math.sin(time * 1.5 + i * 0.018) * 18 * loosen;
        const tx = dot.tx + Math.cos(i * 0.72) * wave;
        const ty = dot.ty + Math.sin(i * 0.91) * wave;
        dot.vx += (tx - dot.x) * 0.011;
        dot.vy += (ty - dot.y) * 0.011;
        dot.vx *= 0.865;
        dot.vy *= 0.865;
        dot.x += dot.vx;
        dot.y += dot.vy;

        ctx.beginPath();
        ctx.shadowBlur = 22;
        ctx.shadowColor = `rgba(${dot.color}, .85)`;
        ctx.fillStyle = `rgba(${dot.color}, ${0.14 + Math.random() * 0.22})`;
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
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

  return <canvas ref={canvasRef} className="em-particles" aria-hidden="true" />;
}

function PageShell({ page, active, index, children }: { page: Page; active: number; index: number; children: ReactNode }) {
  return (
    <section className={`em-page ${active === index ? "is-active" : active > index ? "is-before" : "is-after"}`}>
      <div className="em-page-line" />
      <div className="em-page-meta"><span>{page.index}</span><strong>{page.tag}</strong></div>
      <div className="em-bloom" aria-hidden="true" />
      <div className="em-scan" aria-hidden="true" />
      {children}
    </section>
  );
}

function Hero({ page }: { page: Page }) {
  return (
    <div className="em-hero">
      <div className="em-copy">
        <p>{page.tag}</p>
        <h1>{page.title}</h1>
        <span className="em-subline">React · TypeScript · UI/UX · Motion · WebGL</span>
        <p className="lead">{page.lead}</p>
        <div className="em-actions"><a href="#contact">Start contact</a><a href="https://github.com/drmacze" target="_blank" rel="noreferrer">GitHub</a></div>
      </div>
      <aside className="em-mark-stage"><DlavieMark /><div className="em-orbit">DLAVIE / EMERALD SYSTEM</div></aside>
    </div>
  );
}

function Profile({ page }: { page: Page }) {
  return <TwoColumn page={page}><div className="em-terminal"><DlavieMark small /><h3>Darma — Dlavie</h3><p>Creative developer focused on building portfolio-grade interfaces, product UI, responsive detail, and motion systems.</p><code>status: building_dlavie_project</code><code>mode: frontend + motion + product</code><code>theme: black_emerald_bloom</code></div></TwoColumn>;
}

function Skills({ page }: { page: Page }) {
  return <TwoColumn page={page} wide><div className="em-grid">{skills.map((item) => <article key={item.title} className="em-module"><span>{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div><div className="em-tech">{tech.map(([name, icon]) => <span key={name}><img src={icon} alt="" />{name}</span>)}</div></TwoColumn>;
}

function Projects({ page }: { page: Page }) {
  const [active, setActive] = useState(0);
  const selected = projects[active];
  return <TwoColumn page={page} wide><div className="em-project-layout"><nav>{projects.map((project, index) => <button type="button" className={active === index ? "is-active" : ""} onClick={() => setActive(index)} key={project.title}><span>{project.no}</span><strong>{project.title}</strong><small>{project.kind}</small></button>)}</nav><article className="em-project"><div><DlavieMark small /></div><small>{selected.stack}</small><h3>{selected.title}</h3><p>{selected.text}</p></article></div></TwoColumn>;
}

function Journey({ page }: { page: Page }) {
  return <TwoColumn page={page} wide><div className="em-timeline">{journey.map((item) => <article key={item.time} className="em-row"><span>{item.time}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></TwoColumn>;
}

function Proof({ page }: { page: Page }) {
  return <TwoColumn page={page} wide><div className="em-proof">{proof.map((item) => <article key={item.title} className="em-module"><span>{item.mark}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></TwoColumn>;
}

function Contact({ page }: { page: Page }) {
  return <div className="em-contact"><p>{page.tag}</p><h2>{page.title}</h2><p>{page.lead}</p><div className="em-actions"><a href="mailto:your-email@example.com">Email Darma</a><a href="https://github.com/drmacze" target="_blank" rel="noreferrer">GitHub</a></div></div>;
}

function TwoColumn({ page, children, wide = false }: { page: Page; children: ReactNode; wide?: boolean }) {
  return <div className={wide ? "em-two wide" : "em-two"}><div className="em-copy"><p>{page.tag}</p><h2>{page.title}</h2><p className="lead">{page.lead}</p></div><div>{children}</div></div>;
}

function render(page: Page) {
  if (page.id === "home") return <Hero page={page} />;
  if (page.id === "profile") return <Profile page={page} />;
  if (page.id === "skills") return <Skills page={page} />;
  if (page.id === "projects") return <Projects page={page} />;
  if (page.id === "journey") return <Journey page={page} />;
  if (page.id === "proof") return <Proof page={page} />;
  return <Contact page={page} />;
}

export default function DlavieEmeraldExperience() {
  const [active, setActive] = useState(0);
  const locked = useRef(false);
  const touchY = useRef<number | null>(null);

  const go = (next: number) => {
    const index = Math.max(0, Math.min(next, pages.length - 1));
    setActive(index);
    document.documentElement.dataset.page = String(index);
  };

  useEffect(() => {
    document.documentElement.dataset.page = String(active);
    const wheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 16 || locked.current) return;
      locked.current = true;
      go(active + (event.deltaY > 0 ? 1 : -1));
      window.setTimeout(() => { locked.current = false; }, 760);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "PageDown") go(active + 1);
      if (event.key === "ArrowUp" || event.key === "PageUp") go(active - 1);
    };
    window.addEventListener("wheel", wheel, { passive: true });
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("wheel", wheel); window.removeEventListener("keydown", key); };
  }, [active]);

  const onTouchStart = (event: TouchEvent<HTMLElement>) => { touchY.current = event.touches[0]?.clientY ?? null; };
  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const end = event.changedTouches[0]?.clientY ?? null;
    const start = touchY.current;
    touchY.current = null;
    if (start === null || end === null) return;
    const delta = start - end;
    if (Math.abs(delta) > 44) go(active + (delta > 0 ? 1 : -1));
  };

  return (
    <main className="em-root" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <ParticleBloom />
      <header className="em-nav"><button type="button" onClick={() => go(0)}><DlavieMark small /><strong>Dlavie</strong></button><nav>{pages.map((page, index) => <button type="button" className={active === index ? "is-active" : ""} onClick={() => go(index)} key={page.id}>{page.id}</button>)}</nav></header>
      <div className="em-track" style={{ "--active": active } as CSSProperties}>{pages.map((page, index) => <PageShell key={page.id} page={page} active={active} index={index}>{render(page)}</PageShell>)}</div>
      <div className="em-dots">{pages.map((page, index) => <button type="button" key={page.id} className={active === index ? "is-active" : ""} onClick={() => go(index)} aria-label={`Go to ${page.id}`} />)}</div>
      <Analytics />
      <SpeedInsights />
    </main>
  );
}
