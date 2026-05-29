import { useEffect, type CSSProperties, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DlavieShaderCanvas from "./DlavieShaderCanvas";
import "./dlavie-stable.css";
import "./dlavie-command.css";
import "./dlavie-premium-motion.css";
import "./dlavie-hard-rebuild.css";

gsap.registerPlugin(ScrollTrigger);

const assets = {
  portrait: "https://image-link.edgeone.app/1780006998994-xbhs1m.jpg",
  logo: "https://image-link.edgeone.app/1780007019071-tujwp8.jpg",
};

const links = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Ecosystem", "#ecosystem"],
  ["Projects", "#projects"],
  ["Skills", "#skills"],
  ["Journey", "#journey"],
  ["Proof", "#proof"],
  ["Contact", "#contact"],
] as const;

const projects = [
  ["01", "Dlavie Commerce", "E-Commerce Web Platform", "Ongoing", "https://dlaviecomerce.vercel.app", "A modern e-commerce platform built for Dlavie Inc. to display products, support catalog browsing, and become the foundation of Dlavie’s digital business system."],
  ["02", "Dlavie WhatsApp Bot", "WhatsApp Automation System", "Demo / Ongoing", "https://wa.me/message/DBDX22XYJ6RAJ1", "A WhatsApp automation system for command handling, auto-reply, customer interaction, and future integration with Dlavie Commerce and Dlavie AI."],
  ["03", "Dlavie AI", "Private AI Assistant", "Concept", "#contact", "A private AI assistant concept for workflow, product thinking, automation, content, and intelligent interaction inside the Dlavie ecosystem."],
] as const;

const skills = [
  ["HTML", 100], ["CSS", 98], ["JavaScript", 99], ["TypeScript", 95], ["React", 91], ["Node.js", 90],
  ["UI/UX Design", 97], ["Animation/Motion", 94], ["Three.js/WebGL", 90], ["Backend/API", 88], ["Database", 89], ["Vercel", 91],
] as const;

const journey = [
  ["2022", "First Step", "Started entering programming and learning the web foundation."],
  ["2023", "Web Foundation", "Focused on HTML, CSS, and JavaScript."],
  ["2024", "FGZ XD Bot", "Built the first WhatsApp bot experiment."],
  ["2025", "Dlavie Transition", "FGZ XD evolved into Dlavie Inc."],
  ["2026", "Dlavie Ecosystem", "Building Commerce, Bot, AI, and a professional portfolio identity."],
] as const;

const proof = [
  ["Microsoft", "Foundations of User Experience (UX) Design", "28 May 2025"],
  ["Language Center UMK", "Integrated English Language Proficiency Test", "19 February 2026"],
  ["Digiflazz", "Digital Marketing", "2026"],
  ["APTISI 7 Jawa Tengah", "Finalist — National LO-KREATIF Competition", "2026"],
] as const;

function Mark() {
  return <span className="ds-mark" aria-hidden="true" />;
}

function CommandMenu() {
  return (
    <details className="dc-command dh-command">
      <summary aria-label="Open portfolio navigation">
        <Mark />
        <span>Dlavie</span>
        <i />
      </summary>
      <nav>
        {links.map(([label, href], index) => (
          <a href={href} key={label} style={{ "--delay": `${index * 34}ms` } as CSSProperties}>
            <small>{String(index + 1).padStart(2, "0")}</small>
            <strong>{label}</strong>
          </a>
        ))}
      </nav>
    </details>
  );
}

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: ReactNode }) {
  return <section id={id} className="ds-section pm-section"><div className="ds-heading pm-heading"><span>{kicker}</span><h2>{title}</h2></div>{children}</section>;
}

function HeroVisual() {
  return (
    <div className="dh-hero-visual">
      <div className="dh-logo-panel">
        <img src={assets.logo} alt="Dlavie Inc. logo" />
        <span>Dlavie Inc.</span>
      </div>
      <figure className="dh-founder-card">
        <img src={assets.portrait} alt="Musthafa Darma Priyanda" />
        <figcaption>
          <strong>Musthafa Darma Priyanda</strong>
          <span>Founder · Frontend Developer</span>
        </figcaption>
      </figure>
      <div className="dh-status-card">
        <span>BUILDING</span>
        <strong>Commerce · Bot · AI</strong>
      </div>
    </div>
  );
}

function useDlavieMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".ds-hero-copy > *", { y: 34, autoAlpha: 0, filter: "blur(18px)" }, { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.05, ease: "power4.out", stagger: 0.08 });
      gsap.fromTo(".dh-hero-visual > *", { y: 46, scale: 0.96, autoAlpha: 0, filter: "blur(20px)" }, { y: 0, scale: 1, autoAlpha: 1, filter: "blur(0px)", duration: 1.05, ease: "power4.out", stagger: 0.1, delay: 0.18 });

      gsap.utils.toArray<HTMLElement>(".pm-section").forEach((section) => {
        const heading = section.querySelector(".pm-heading");
        const items = section.querySelectorAll("article, .ds-editorial p, .ds-project-lock, .dc-skill-card, .dh-about-media");
        if (heading) {
          gsap.fromTo(heading, { y: 42, autoAlpha: 0, filter: "blur(18px)" }, { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.9, ease: "power4.out", scrollTrigger: { trigger: section, start: "top 78%" } });
        }
        gsap.fromTo(items, { y: 34, autoAlpha: 0, filter: "blur(14px)" }, { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.82, ease: "power4.out", stagger: 0.07, scrollTrigger: { trigger: section, start: "top 70%" } });
      });

      gsap.utils.toArray<HTMLElement>(".dc-skill-card").forEach((card) => {
        const meter = card.querySelector(".dc-skill-meter b");
        const level = Number(card.style.getPropertyValue("--level") || 0);
        gsap.fromTo(meter, { width: "0%" }, { width: `${level}%`, duration: 1.15, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 82%" } });
      });

      gsap.utils.toArray<HTMLElement>(".ds-project-detail article").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
          const rect = card.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
          const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
          gsap.to(card, { rotateY: x, rotateX: y, y: -6, duration: 0.35, ease: "power2.out" });
        });
        card.addEventListener("pointerleave", () => gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.55)" }));
      });
    });

    return () => ctx.revert();
  }, []);
}

export default function DlavieStablePortfolio() {
  useDlavieMotion();

  return (
    <main className="ds-root pm-root dh-root">
      <DlavieShaderCanvas />
      <div className="ds-ambient" aria-hidden="true" />
      <CommandMenu />

      <section id="home" className="ds-hero pm-hero dh-hero">
        <div className="ds-hero-copy dh-hero-copy">
          <p className="ds-kicker">Founder · Frontend Developer · Creative Web Developer</p>
          <h1>Designing Dlavie Inc. as a digital ecosystem.</h1>
          <p>Frontend interfaces, e-commerce systems, WhatsApp automation, and private AI — built with clean design, motion, performance, and product vision.</p>
          <div className="ds-tags"><span>Founder</span><span>Frontend Developer</span><span>AI & Automation Builder</span><span>Dlavie Inc.</span></div>
          <div className="ds-actions"><a href="#projects">Explore Projects</a><a href="mailto:dlaviecom@gmail.com">Contact Founder</a></div>
        </div>
        <HeroVisual />
      </section>

      <Section id="about" kicker="Founder Identity" title="A one-person digital brand built with ambition, consistency, and product vision.">
        <div className="dh-about-grid">
          <div className="ds-editorial"><p>I am Musthafa Darma Priyanda, Founder and Developer of Dlavie Inc. My programming journey began under the name FGZ XD before evolving into Dlavie Inc., a personal digital brand built by one person with a long-term vision.</p><p>I focus on frontend interfaces, e-commerce systems, WhatsApp automation, and private AI products. My work is driven by consistency, timing, ambition, and long working hours.</p></div>
          <figure className="dh-about-media"><img src={assets.portrait} alt="Musthafa Darma Priyanda" /><figcaption>Daerah Istimewa Yogyakarta · Dlavie Inc.</figcaption></figure>
        </div>
      </Section>

      <Section id="ecosystem" kicker="Dlavie Ecosystem" title="Commerce, automation, AI, portfolio, and dashboard in one connected direction.">
        <div className="ds-orbit-grid pm-card-grid">{["Commerce", "WhatsApp Bot", "Private AI", "Portfolio", "Admin Dashboard", "Product System"].map((item, index) => <article key={item}><span>0{index + 1}</span><h3>{item}</h3><p>Part of the Dlavie Inc. digital ecosystem.</p></article>)}</div>
      </Section>

      <Section id="projects" kicker="Selected Projects" title="Three core pillars: commerce, automation, and intelligence.">
        <div className="ds-project-lock pm-project-lock dh-project-lock">
          <div className="ds-project-rail">{[...projects, ...projects].map(([no, title, kind, status], index) => <article key={`${title}-${index}`}><span>{no}</span><h3>{title}</h3><p>{kind}</p><small>{status}</small></article>)}</div>
          <div className="ds-project-detail">{projects.map(([no, title, kind, status, link, text]) => <article key={title}><span>{no} · {status}</span><h3>{title}</h3><small>{kind}</small><p>{text}</p><a href={link}>Open Project</a></article>)}</div>
        </div>
      </Section>

      <Section id="skills" kicker="Skill Matrix" title="Programming, interface design, motion, and system thinking.">
        <div className="dc-skill-grid pm-skill-grid dh-skill-grid">
          {skills.map(([name, value], index) => (
            <article className="dc-skill-card" key={name} style={{ "--level": value, "--delay": `${index * 65}ms` } as CSSProperties}>
              <div className="dc-skill-value"><strong>{value}</strong><span>%</span></div>
              <h3>{name}</h3>
              <div className="dc-skill-meter"><b /></div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="journey" kicker="Career Journey" title="From FGZ XD experiments to building Dlavie Inc. seriously.">
        <div className="ds-timeline">{journey.map(([year, title, text]) => <article key={year}><span>{year}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </Section>

      <Section id="proof" kicker="Proof" title="Certifications, achievements, and future collaboration readiness.">
        <div className="ds-proof-grid">{proof.map(([org, title, date]) => <article key={title}><span>{org}</span><h3>{title}</h3><p>{date}</p></article>)}</div>
      </Section>

      <section id="contact" className="ds-contact pm-section dh-contact">
        <span>Contact</span><h2>Let’s build something new, fast, and intelligent.</h2><p>Email or WhatsApp for serious discussion. Instagram for quick connection.</p>
        <div className="ds-actions"><a href="mailto:dlaviecom@gmail.com">Email</a><a href="https://wa.me/message/DBDX22XYJ6RAJ1">WhatsApp</a><a href="https://github.com/drmacze">GitHub</a><a href="https://www.linkedin.com/in/dlavie-inc-0721bb411">LinkedIn</a></div>
      </section>
      <Analytics /><SpeedInsights />
    </main>
  );
}
