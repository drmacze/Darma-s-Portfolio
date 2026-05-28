import { type PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
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
  toolLogos,
  visualPrinciples,
  type Project,
  type VisualPrinciple,
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
          transformed.z += sin((position.x + uTime * 0.14) * 3.4) * 0.012;
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
          return smoothstep(radius, radius - 0.36, distance(uv, pos));
        }

        void main() {
          vec2 uv = vUv;
          vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
          vec2 centered = (uv - 0.5) * aspect;
          float drift = sin(uTime * 0.12) * 0.12;

          float warm = circle(centered, vec2(-0.38 + drift, 0.16), 0.74);
          float cool = circle(centered, vec2(0.44, -0.28 - drift), 0.68);
          float cursor = circle(uv, uMouse, 0.28);

          vec3 ink = vec3(0.027, 0.029, 0.032);
          vec3 champagne = vec3(0.72, 0.57, 0.36);
          vec3 slate = vec3(0.34, 0.39, 0.43);
          vec3 ivory = vec3(0.92, 0.87, 0.77);

          float grain = fract(sin(dot(uv * (uTime + 1.0), vec2(12.9898, 78.233))) * 43758.5453) * 0.028;
          vec3 color = ink + champagne * warm * 0.14 + slate * cool * 0.12 + ivory * cursor * 0.045 + grain;
          gl_FragColor = vec4(color, 0.96);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
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

type AmbientParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
};

function ParticlesLayer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const colors = ["198, 167, 107", "139, 148, 158", "235, 229, 214"];
    const particles: AmbientParticle[] = [];
    const pointer = { x: -9999, y: -9999 };
    let frame = 0;
    let width = 0;
    let height = 0;

    const createParticle = (): AmbientParticle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      size: 0.8 + Math.random() * 1.7,
      alpha: 0.12 + Math.random() * 0.18,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      particles.length = 0;
      const count = Math.min(42, Math.max(18, Math.floor(width / 44)));
      for (let index = 0; index < count; index += 1) particles.push(createParticle());
    };

    const movePointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const leavePointer = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 130) {
          const force = (130 - distance) / 130;
          particle.vx += (dx / Math.max(distance, 1)) * force * 0.007;
          particle.vy += (dy / Math.max(distance, 1)) * force * 0.007;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.993;
        particle.vy *= 0.993;

        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));

        context.beginPath();
        context.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();

        for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
          const next = particles[nextIndex];
          const linkDistance = Math.hypot(particle.x - next.x, particle.y - next.y);
          if (linkDistance > 128) continue;

          context.beginPath();
          context.strokeStyle = `rgba(198, 167, 107, ${(1 - linkDistance / 128) * 0.08})`;
          context.lineWidth = 1;
          context.moveTo(particle.x, particle.y);
          context.lineTo(next.x, next.y);
          context.stroke();
        }
      });

      frame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", movePointer);
    window.addEventListener("pointerleave", leavePointer);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("pointerleave", leavePointer);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="particles-layer" aria-hidden="true" />;
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
          { autoAlpha: 0, y: 38, filter: "blur(10px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 84%",
              end: "bottom 18%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".parallax-card").forEach((element) => {
        gsap.to(element, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
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

function Icon({ type }: { type: VisualPrinciple["icon"] | "arrow" | "spark" | "mail" }) {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  };

  if (type === "layers") {
    return (
      <svg {...commonProps}>
        <path d="M12 3 3.5 7.5 12 12l8.5-4.5L12 3Z" />
        <path d="M5 12.2 12 16l7-3.8" />
        <path d="M5 16.2 12 20l7-3.8" />
      </svg>
    );
  }

  if (type === "motion") {
    return (
      <svg {...commonProps}>
        <path d="M4 17c4.8 0 4.8-10 9.6-10 3 0 4.5 2.7 5.4 5" />
        <path d="M15 12h4.5V7.5" />
      </svg>
    );
  }

  if (type === "code") {
    return (
      <svg {...commonProps}>
        <path d="m9 7-5 5 5 5" />
        <path d="m15 7 5 5-5 5" />
        <path d="m13 5-2 14" />
      </svg>
    );
  }

  if (type === "performance") {
    return (
      <svg {...commonProps}>
        <path d="M12 21a8 8 0 1 0-8-8" />
        <path d="M12 13 17 8" />
        <path d="M5 21h14" />
      </svg>
    );
  }

  if (type === "mail") {
    return (
      <svg {...commonProps}>
        <path d="M4 6h16v12H4V6Z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  if (type === "spark") {
    return (
      <svg {...commonProps}>
        <path d="M12 3v18" />
        <path d="M3 12h18" />
        <path d="m5.6 5.6 12.8 12.8" />
        <path d="m18.4 5.6-12.8 12.8" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
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
        <span>DL</span>
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

function LogoPill({ name, icon }: { name: string; icon: string }) {
  return (
    <span className="logo-pill">
      <img src={icon} alt="" loading="lazy" />
      {name}
    </span>
  );
}

function Hero() {
  const emailHref = profile.email.includes("example") ? "#contact" : `mailto:${profile.email}`;
  const featuredLogos = toolLogos.slice(0, 4);

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
            Explore works <Icon type="arrow" />
          </a>
          <a className="button ghost" href={emailHref}>
            Start a project <Icon type="mail" />
          </a>
        </motion.div>

        <motion.div
          className="hero-logo-strip"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
        >
          {featuredLogos.map((item) => (
            <LogoPill key={item.name} name={item.name} icon={item.icon} />
          ))}
        </motion.div>
      </div>

      <motion.aside
        className="hero-panel parallax-card"
        initial={{ opacity: 0, scale: 0.96, rotate: -1.2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, delay: 0.22, ease: "easeOut" }}
      >
        <div className="panel-topline">
          <span>Selected Identity</span>
          <Icon type="spark" />
        </div>

        <div className="portrait-orb">
          {profile.avatar ? <img src={profile.avatar} alt={profile.name} /> : <span>{profile.name.charAt(0)}</span>}
        </div>

        <div className="identity-card">
          <p className="panel-label">Developer Identity</p>
          <h2>
            {profile.name} <span>— {profile.brand}</span>
          </h2>
          <p>{profile.role}</p>
        </div>

        <div className="mini-dashboard">
          {stats.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
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
        title="A refined system for personal branding, not just a page full of text."
        description={profile.longBio}
      />

      <div className="principles-grid reveal">
        {visualPrinciples.map((item) => (
          <article key={item.title} className="principle-card">
            <div className="card-icon">
              <Icon type={item.icon} />
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectPreview({ project, index }: { project: Project; index: number }) {
  const logo = toolLogos[index % toolLogos.length];

  return (
    <div className="project-preview" aria-hidden="true">
      <div className="preview-toolbar">
        <span />
        <span />
        <span />
      </div>
      <div className="preview-canvas">
        <img src={logo.icon} alt="" loading="lazy" />
        <div>
          <small>{project.category}</small>
          <strong>{project.title}</strong>
        </div>
      </div>
      <div className="preview-lines">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="project-card reveal">
      <ProjectPreview project={project} index={index} />
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
        <Icon type="arrow" />
      </a>
    </article>
  );
}

function Works() {
  return (
    <section id="works" className="content-section works-section">
      <SectionIntro
        kicker="Selected works"
        title="Project cards now carry visual identity, preview surfaces, and real tech context."
        description="Ganti daftar project ini dengan karya asli kamu. Card sudah disiapkan untuk link live demo, GitHub, atau case study tanpa terlihat seperti blok teks biasa."
      />

      <div className="project-list">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

function TechnologyWall() {
  return (
    <section id="stack" className="content-section stack-section">
      <SectionIntro
        kicker="Technology wall"
        title="Real logos, real tooling, and a cleaner visual hierarchy."
        description="Bagian stack dibuat lebih hidup dengan logo library asli, label fungsi, dan deskripsi singkat agar tidak hanya menjadi teks berjejer."
      />

      <div className="tool-grid reveal">
        {toolLogos.map((tool) => (
          <article key={tool.name} className="tool-card">
            <div className="tool-icon">
              <img src={tool.icon} alt={`${tool.name} logo`} loading="lazy" />
            </div>
            <div>
              <span>{tool.label}</span>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
            </div>
          </article>
        ))}
      </div>

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
        title="Experience presented as a structured path, not a plain paragraph."
        description="Timeline ini siap diisi dengan pengalaman, project, organisasi, atau pencapaian kamu. Setiap item dibuat seperti editorial record yang mudah dibaca."
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
      <h2>Let’s shape Dlavie into a more elegant digital presence.</h2>
      <p>
        Kirim detail kontak, sosial media, foto, dan tone personal kamu. Setelah itu copywriting serta visual hierarchy bisa dipoles lagi agar terasa lebih personal dan premium.
      </p>
      <div className="contact-actions">
        <a className="button primary" href={emailHref}>
          {profile.email} <Icon type="mail" />
        </a>
        <a className="button ghost" href={profile.github} target="_blank" rel="noreferrer">
          GitHub <Icon type="arrow" />
        </a>
      </div>
    </section>
  );
}

function App() {
  useMotionSystem();

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
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
      <TechnologyWall />
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
