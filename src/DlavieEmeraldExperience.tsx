import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type TouchEvent } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./dlavie-emerald.css";

type PageId = "home" | "profile" | "ecosystem" | "projects" | "skills" | "journey" | "proof" | "contact";
type Page = { id: PageId; index: string; tag: string; title: string; lead: string };

const profile = {
  name: "Musthafa Darma Priyanda",
  brand: "Dlavie Inc.",
  role: "Founder · Frontend Developer · Creative Web Developer",
  location: "Daerah Istimewa Yogyakarta, Indonesia",
  education: "18 years old · High school graduate",
  email: "dlaviecom@gmail.com",
  github: "https://github.com/drmacze",
  instagram: "https://www.instagram.com/drmacze?igsh=enA2YTFoNWNnMmR5&utm_source=qr",
  linkedin: "https://www.linkedin.com/in/dlavie-inc-0721bb411",
  whatsapp: "https://wa.me/message/DBDX22XYJ6RAJ1",
  portrait: "https://image-link.edgeone.app/1780006998994-xbhs1m.jpg",
  logo: "https://image-link.edgeone.app/1780007019071-tujwp8.jpg",
};

const pages: Page[] = [
  { id: "home", index: "01", tag: "Dlavie Inc.", title: "Designing Dlavie Inc. as a digital ecosystem.", lead: "Frontend interfaces, e-commerce systems, WhatsApp automation, and private AI — built with clean design, motion, performance, and product vision." },
  { id: "profile", index: "02", tag: "Founder Identity", title: "A one-person digital brand built with ambition and consistency.", lead: "I am Musthafa Darma Priyanda, Founder and Developer of Dlavie Inc. My journey began under FGZ XD before evolving into a more serious digital ecosystem." },
  { id: "ecosystem", index: "03", tag: "Dlavie Ecosystem", title: "Commerce, automation, AI, portfolio, and dashboard in one direction.", lead: "Dlavie Inc. is a personal digital brand for web products, e-commerce systems, WhatsApp bots, and private AI experiences." },
  { id: "projects", index: "04", tag: "Selected Projects", title: "Three pillars: commerce, WhatsApp automation, and intelligence.", lead: "Dlavie projects are built as connected product modules, not isolated portfolio cards." },
  { id: "skills", index: "05", tag: "Skill Matrix", title: "Programming, interface design, motion, and system thinking.", lead: "The skill stack combines frontend engineering, backend/API logic, UI/UX, animation, deployment, and WebGL visual direction." },
  { id: "journey", index: "06", tag: "Career Journey", title: "From FGZ XD experiments to building Dlavie Inc. seriously.", lead: "A journey from HTML, CSS, JavaScript, and the first WhatsApp bot into Dlavie Commerce, Dlavie Bot, Dlavie AI, and a professional identity." },
  { id: "proof", index: "07", tag: "Proof", title: "Certifications, achievements, and future collaboration.", lead: "Proof across UX, English proficiency, digital marketing, product innovation, and selected collaboration readiness." },
  { id: "contact", index: "08", tag: "Contact", title: "Let’s build something new, fast, and intelligent.", lead: "Email or WhatsApp for serious discussion. Instagram for quick connection." },
];

const projects = [
  { no: "01", title: "Dlavie Commerce", kind: "E-Commerce Web Platform", status: "Ongoing", link: "https://dlaviecomerce.vercel.app", stack: "Next.js · React · TypeScript · Tailwind · Node.js · Database · Vercel", text: "A modern e-commerce platform for Dlavie Inc., built to display products, support catalog browsing, and become the foundation of Dlavie’s digital business system." },
  { no: "02", title: "Dlavie WhatsApp Bot", kind: "WhatsApp Automation System", status: "Demo / Ongoing", link: "https://wa.me/message/DBDX22XYJ6RAJ1", stack: "Node.js · JavaScript · TypeScript · WhatsApp Automation · Backend/API", text: "A WhatsApp automation system for command handling, auto-reply, customer interaction, and future integration with Dlavie Commerce and Dlavie AI." },
  { no: "03", title: "Dlavie AI", kind: "Private AI Assistant", status: "Concept", link: "#contact", stack: "React · Next.js · TypeScript · Node.js · AI Integration", text: "A private AI assistant concept for workflow, product thinking, automation, content, and intelligent interaction inside the Dlavie ecosystem." },
];

const skills = [
  ["HTML", 100], ["CSS", 98], ["JavaScript", 99], ["TypeScript", 95], ["React", 91], ["Node.js", 90], ["UI/UX Design", 97], ["Animation/Motion", 94], ["Three.js/WebGL", 90], ["Backend/API", 88], ["Database", 89], ["Deployment/Vercel", 91],
] as const;

const tech = ["React", "TypeScript", "Next.js", "Vite", "Tailwind CSS", "Node.js", "GSAP", "Framer Motion", "Three.js", "GitHub", "Vercel", "Figma"];
const journey = [["2022", "First Step", "Started entering programming."], ["2023", "Web Foundation", "Focused on HTML, CSS, and JavaScript."], ["2024", "FGZ XD Bot", "Built the first WhatsApp bot experiment."], ["2025", "Dlavie Transition", "FGZ XD evolved into Dlavie Inc."], ["2026", "Dlavie Ecosystem", "Building Commerce, Bot, AI, and portfolio."]];
const proof = [["Microsoft", "Foundations of User Experience (UX) Design", "28 May 2025"], ["Language Center UMK", "Integrated English Language Proficiency Test (IELPT)", "19 February 2026"], ["Digiflazz", "Digital Marketing", "2026"], ["APTISI 7 Jawa Tengah", "Finalist — National LO-KREATIF Competition", "2026"]];
const services = ["Landing Page", "Portfolio Website", "E-Commerce Website", "WhatsApp Bot", "UI/UX Design", "Company Profile", "Frontend React", "Dashboard", "Animation Web", "AI Assistant / Web AI"];

function DlavieMark({ small = false }: { small?: boolean }) {
  return <img className={small ? "em-logo small" : "em-logo"} src={profile.logo} alt="Dlavie Inc. logo" />;
}

function AmbientParticles() {
  return <div className="em-particles" aria-hidden="true" />;
}

function PageShell({ page, active, index, children }: { page: Page; active: number; index: number; children: ReactNode }) {
  return <section className={`em-page ${active === index ? "is-active" : active > index ? "is-before" : "is-after"}`}><div className="em-page-line" /><div className="em-page-meta"><span>{page.index}</span><strong>{page.tag}</strong></div><div className="em-bloom" aria-hidden="true" /><div className="em-scan" aria-hidden="true" />{children}</section>;
}

function Hero({ page }: { page: Page }) {
  return <div className="em-hero"><div className="em-copy"><p>{profile.role}</p><h1>{page.title}</h1><span className="em-subline">Founder · Frontend · E-Commerce · WhatsApp Bot · Private AI</span><p className="lead">{page.lead}</p><div className="em-actions"><a href="#projects">Explore Ecosystem</a><a href={`mailto:${profile.email}`}>Contact Founder</a></div></div><aside className="em-mark-stage"><DlavieMark /><div className="em-orbit">SPATIAL · LUXURY · DLAVIE INC.</div></aside></div>;
}

function Profile({ page }: { page: Page }) {
  return <TwoColumn page={page}><div className="em-terminal"><DlavieMark small /><h3>{profile.name}</h3><p>{page.lead}</p><p>I focus on frontend interfaces, e-commerce systems, WhatsApp automation, and private AI products. My work is driven by consistency, timing, ambition, and long working hours.</p><code>{profile.location}</code><code>{profile.education}</code></div></TwoColumn>;
}

function Ecosystem({ page }: { page: Page }) {
  return <TwoColumn page={page} wide><div className="em-grid">{["Dlavie Commerce", "Dlavie WhatsApp Bot", "Dlavie AI", "Portfolio", "Admin Dashboard", "Product System"].map((item, index) => <article className="em-module" key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3><p>Part of Dlavie Inc. connected digital ecosystem.</p></article>)}</div></TwoColumn>;
}

function Projects({ page }: { page: Page }) {
  const [active, setActive] = useState(0);
  const selected = projects[active];
  return <TwoColumn page={page} wide><div className="em-project-layout"><nav>{projects.map((project, index) => <button type="button" className={active === index ? "is-active" : ""} onClick={() => setActive(index)} key={project.title}><span>{project.no}</span><strong>{project.title}</strong><small>{project.status}</small></button>)}</nav><article className="em-project"><div><DlavieMark small /></div><small>{selected.kind}</small><h3>{selected.title}</h3><p>{selected.text}</p><p>{selected.stack}</p><a href={selected.link} target={selected.link.startsWith("http") ? "_blank" : undefined} rel="noreferrer">Open Project</a></article></div></TwoColumn>;
}

function Skills({ page }: { page: Page }) {
  return <TwoColumn page={page} wide><div className="em-grid">{skills.map(([name, value]) => <article className="em-module" key={name}><span>{value}</span><h3>{name}</h3><p>Capability level for Dlavie Inc. product development.</p></article>)}</div><div className="em-tech">{tech.map((name) => <span key={name}>{name}</span>)}</div></TwoColumn>;
}

function Journey({ page }: { page: Page }) {
  return <TwoColumn page={page} wide><div className="em-timeline">{journey.map(([time, title, text]) => <article key={time} className="em-row"><span>{time}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></TwoColumn>;
}

function Proof({ page }: { page: Page }) {
  return <TwoColumn page={page} wide><div className="em-proof">{proof.map(([org, title, date]) => <article key={title} className="em-module"><span>{org}</span><h3>{title}</h3><p>{date}</p></article>)}</div><div className="em-tech">{services.map((item, index) => <span key={item}>{index < 5 ? "Focus" : "Selective"} · {item}</span>)}</div></TwoColumn>;
}

function Contact({ page }: { page: Page }) {
  return <div className="em-contact"><p>{page.tag}</p><h2>{page.title}</h2><p>{page.lead}</p><div className="em-actions"><a href={`mailto:${profile.email}`}>Email</a><a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a><a href={profile.github} target="_blank" rel="noreferrer">GitHub</a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a href={profile.instagram} target="_blank" rel="noreferrer">Instagram</a></div></div>;
}

function TwoColumn({ page, children, wide = false }: { page: Page; children: ReactNode; wide?: boolean }) {
  return <div className={wide ? "em-two wide" : "em-two"}><div className="em-copy"><p>{page.tag}</p><h2>{page.title}</h2><p className="lead">{page.lead}</p></div><div>{children}</div></div>;
}

function render(page: Page) {
  if (page.id === "home") return <Hero page={page} />;
  if (page.id === "profile") return <Profile page={page} />;
  if (page.id === "ecosystem") return <Ecosystem page={page} />;
  if (page.id === "projects") return <Projects page={page} />;
  if (page.id === "skills") return <Skills page={page} />;
  if (page.id === "journey") return <Journey page={page} />;
  if (page.id === "proof") return <Proof page={page} />;
  return <Contact page={page} />;
}

export default function DlavieEmeraldExperience() {
  const [active, setActive] = useState(0);
  const locked = useRef(false);
  const touchY = useRef<number | null>(null);
  const go = (next: number) => { const index = Math.max(0, Math.min(next, pages.length - 1)); setActive(index); document.documentElement.dataset.page = String(index); };
  useEffect(() => { document.documentElement.dataset.page = String(active); const wheel = (event: WheelEvent) => { if (Math.abs(event.deltaY) < 16 || locked.current) return; locked.current = true; go(active + (event.deltaY > 0 ? 1 : -1)); window.setTimeout(() => { locked.current = false; }, 760); }; const key = (event: KeyboardEvent) => { if (event.key === "ArrowDown" || event.key === "PageDown") go(active + 1); if (event.key === "ArrowUp" || event.key === "PageUp") go(active - 1); }; window.addEventListener("wheel", wheel, { passive: true }); window.addEventListener("keydown", key); return () => { window.removeEventListener("wheel", wheel); window.removeEventListener("keydown", key); }; }, [active]);
  const onTouchStart = (event: TouchEvent<HTMLElement>) => { touchY.current = event.touches[0]?.clientY ?? null; };
  const onTouchEnd = (event: TouchEvent<HTMLElement>) => { const end = event.changedTouches[0]?.clientY ?? null; const start = touchY.current; touchY.current = null; if (start === null || end === null) return; const delta = start - end; if (Math.abs(delta) > 44) go(active + (delta > 0 ? 1 : -1)); };
  return <main className="em-root" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}><AmbientParticles /><header className="em-nav"><button type="button" onClick={() => go(0)}><DlavieMark small /><strong>Dlavie Inc.</strong></button><nav>{pages.map((page, index) => <button type="button" className={active === index ? "is-active" : ""} onClick={() => go(index)} key={page.id}>{page.id}</button>)}</nav></header><div className="em-track" style={{ "--active": active } as CSSProperties}>{pages.map((page, index) => <PageShell key={page.id} page={page} active={active} index={index}>{render(page)}</PageShell>)}</div><div className="em-dots">{pages.map((page, index) => <button type="button" key={page.id} className={active === index ? "is-active" : ""} onClick={() => go(index)} aria-label={`Go to ${page.id}`} />)}</div><Analytics /><SpeedInsights /></main>;
}
