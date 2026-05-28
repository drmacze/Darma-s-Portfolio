import { useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";
import {
  capabilities,
  experience,
  profile,
  projects,
  stats,
  techStack,
  type Project,
} from "./data/portfolio";

gsap.registerPlugin(ScrollTrigger);

function useReducedMotionPreference() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
}

function ShaderBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2, 64, 64);
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;

        void main() {
          vUv = uv;
          vec3 transformed = position;
          transformed.z += sin((position.x + uTime * 0.2) * 4.0) * 0.015;
          gl_Position = vec4(transformed, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uResolution;

        float circle(vec2 uv, vec2 pos, float radius) {
          return smoothstep(radius, radius - 0.34, distance(uv, pos));
        }

        void main() {
          vec2 uv = vUv;
          vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
          vec2 centered = (uv - 0.5) * aspect;
          float orbit = sin(uTime * 0.16) * 0.18;

          float auraA = circle(centered, vec2(-0.42 + orbit, 0.18), 0.62);
          float auraB = circle(centered, vec2(0.34, -0.24 + orbit), 0.58);
          float cursor = circle(uv, uMouse, 0.34);

          vec3 ink = vec3(0.015, 0.012, 0.05);
          vec3 violet = vec3(0.45, 0.16, 1.0);
          vec3 cyan = vec3(0.0, 0.72, 1.0);
          vec3 amber = vec3(1.0, 0.62, 0.22);

          float grain = fract(sin(dot(uv * uTime, vec2(12.9898, 78.233))) * 43758.5453) * 0.055;
          vec3 color = ink + violet * auraA * 0.34 + cyan * auraB * 0.25 + amber * cursor * 0.12 + grain;
          gl_FragColor = vec4(color, 0.92);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };

    const pointer = (event: PointerEvent) => {
      uniforms.uMouse.value.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
    };

    let frame = 0;
    const render = () => {
      if (!reducedMotion) uniforms.uTime.value += 0.016;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", pointer);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointer);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="shader-backdrop" aria-hidden="true" />;
}

function ParticlesLayer() {
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (reducedMotion) return;

    let destroyed = false;
    let container: { destroy: () => void } | undefined;

    async function bootParticles() {
      const [{ tsParticles }, { loadSlim }] = await Promise.all([
        import("@tsparticles/engine"),
        import("@tsparticles/slim"),
      ]);

      await loadSlim(tsParticles);
      if (destroyed) return;

      const engine = tsParticles as unknown as {
        load: (config: { id: string; options: unknown }) => Promise<{ destroy: () => void } | undefined>;
      };

      container = await engine.load({
        id: "particle-canvas",
        options: {
          fullScreen: { enable: false },
          detectRetina: true,
          fpsLimit: 60,
          particles: {
            number: { value: 42, density: { enable: true, area: 900 } },
            color: { value: ["#8b5cf6", "#22d3ee", "#f59e0b"] },
            links: {
              enable: true,
              color: "#8b5cf6",
              opacity: 0.16,
              distance: 145,
            },
            move: {
              enable: true,
              speed: 0.35,
              outModes: { default: "bounce" },
            },
            opacity: { value: { min: 0.18, max: 0.55 } },
            size: { value: { min: 1, max: 3 } },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "grab" }, resize: { enable: true } },
            modes: { grab: { distance: 165, links: { opacity: 0.25 } } },
          },
        },
      });
    }

    bootParticles().catch(() => undefined);

    return () => {
      destroyed = true;
      container?.destroy();
    };
  }, [reducedMotion]);

  return <div id="particle-canvas" className="particles-layer" aria-hidden="true" />;
}

function useMotionSystem() {
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({ lerp: 0.075, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 54, filter: "blur(14px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
              end: "bottom 18%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".parallax-card").forEach((element) => {
        gsap.to(element, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        });
      });
    });

    return () => {
      context.revert();
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [reducedMotion]);
}

function Navbar() {
  const links = [
    ["About", "#about"],
    ["Works", "#works"],
    ["Stack", "#stack"],
    ["Contact", "#contact"],
  ];

  return (
    <header className="site-header">
      <a className="brand-mark" href="#top" aria-label="Back to top">
        <span>D</span>
        <strong>{profile.brand}</strong>
      </a>

      <nav className="nav-links" aria-label="Main navigation">
        {links.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Hero() {
  const emailHref = profile.email.includes("example") ? "#contact" : `mailto:${profile.email}`;

  return (
    <section id="top" className="hero section-grid">
      <div className="hero-copy">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {profile.location} / {profile.availability}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        >
          {profile.headline}
        </motion.h1>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.22, ease: "easeOut" }}
        >
          {profile.shortBio}
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.34, ease: "easeOut" }}
        >
          <a className="button primary" href="#works">
            Explore works
          </a>
          <a className="button ghost" href={emailHref}>
            Start a project
          </a>
        </motion.div>
      </div>

      <motion.aside
        className="hero-panel parallax-card"
        initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, delay: 0.22, ease: "easeOut" }}
      >
        <div className="portrait-orb">
          {profile.avatar ? <img src={profile.avatar} alt={profile.name} /> : <span>{profile.name.charAt(0)}</span>}
        </div>
        <div>
          <p className="panel-label">Developer Identity</p>
          <h2>
            {profile.name} <span>— {profile.brand}</span>
          </h2>
          <p>{profile.role}</p>
        </div>
        <div className="signal-row">
          <span />
          <span />
          <span />
          <small>Shader / Motion / UI</small>
        </div>
      </motion.aside>
    </section>
  );
}

function SectionIntro({ kicker, title, description }: { kicker: string; title: string; description: string }) {
  return (
    <div className="section-intro reveal">
      <p className="eyebrow">{kicker}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="content-section about-section">
      <SectionIntro
        kicker="About"
        title="A portfolio system designed around story, motion, and technical clarity."
        description={profile.longBio}
      />

      <div className="stats-grid reveal">
        {stats.map((item) => (
          <article key={item.label} className="stat-card">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="project-card reveal">
      <div className="project-index">0{index + 1}</div>
      <div className="project-body">
        <div className="project-meta">
          <span>{project.year}</span>
          <span>{project.category}</span>
          <span>{project.status}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tag-row">
          {project.stack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>
      <a className="project-link" href={project.href ?? "#"} aria-label={`Open ${project.title}`}>
        ↗
      </a>
    </article>
  );
}

function Works() {
  return (
    <section id="works" className="content-section works-section">
      <SectionIntro
        kicker="Selected works"
        title="Case studies with cinematic interaction and precise component structure."
        description="Ganti daftar project ini dengan karya asli kamu. Setiap card sudah siap untuk link live demo, GitHub, atau case study."
      />

      <div className="project-list">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

function Stack() {
  return (
    <section id="stack" className="content-section stack-section">
      <SectionIntro
        kicker="Capabilities"
        title="Built for modern interfaces: responsive, animated, and performance-aware."
        description="Bagian ini menonjolkan skill kamu sebagai developer. Kamu bisa ubah skill sesuai stack yang benar-benar kamu kuasai."
      />

      <div className="capability-grid reveal">
        {capabilities.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className="marquee reveal" aria-label="Technology stack">
        <div className="marquee-track">
          {[...techStack, ...techStack].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="content-section experience-section">
      <SectionIntro
        kicker="Timeline"
        title="Experience that should be edited with your real journey."
        description="Aku siapkan format timeline seperti portfolio modern. Nanti kita isi berdasarkan pengalaman, project, organisasi, atau pencapaian kamu."
      />

      <div className="timeline reveal">
        {experience.map((item) => (
          <article key={`${item.period}-${item.role}`}>
            <span>{item.period}</span>
            <div>
              <h3>{item.role}</h3>
              <p className="company">{item.company}</p>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const emailHref = profile.email.includes("example") ? "#" : `mailto:${profile.email}`;

  return (
    <section id="contact" className="contact-section reveal">
      <p className="eyebrow">Contact</p>
      <h2>Ready to turn Dlavie into a sharper digital presence?</h2>
      <p>
        Kirim detail kontak, sosial media, dan tone personal kamu. Setelah itu copywriting portfolio ini bisa dibuat lebih tajam dan natural.
      </p>
      <div className="contact-actions">
        <a className="button primary" href={emailHref}>
          {profile.email}
        </a>
        <a className="button ghost" href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </section>
  );
}

function App() {
  useMotionSystem();

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
  };

  return (
    <main onPointerMove={handlePointerMove}>
      <ShaderBackdrop />
      <ParticlesLayer />
      <div className="noise" aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" />
      <Navbar />
      <Hero />
      <About />
      <Works />
      <Stack />
      <Experience />
      <Contact />
      <footer className="footer">
        <span>© 2026 {profile.name}</span>
        <span>Designed for {profile.brand}</span>
      </footer>
    </main>
  );
}

export default App;
