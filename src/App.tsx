import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AnimatePresence, motion } from "framer-motion";
import { animated, to, useSpring } from "@react-spring/web";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";
import Typewriter from "typewriter-effect";
import {
  ArrowUpRight,
  Code2,
  Gauge,
  GithubIcon,
  Layers3,
  Mail,
  Music2,
  Orbit,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";

import auroraVertexShader from "./shaders/aurora.vert";
import auroraFragmentShader from "./shaders/aurora.frag";

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

const projectVisualProfiles = [
  {
    label: "Interface System",
    accent: "124,58,237",
    soft: "245,245,245",
    mark: "UI",
    pattern: "modular-grid",
  },
  {
    label: "Motion Direction",
    accent: "37,99,235",
    soft: "124,58,237",
    mark: "MX",
    pattern: "cinematic-ribbon",
  },
  {
    label: "Digital Product",
    accent: "94,234,212",
    soft: "245,245,245",
    mark: "DX",
    pattern: "signal-field",
  },
];

const musicTracks = [
  {
    title: "Summer Nights",
    mood: "Welcome / Dream",
    src: "/audio/music-1.mp3",
    spotify: "https://open.spotify.com/track/0lYBSQXN6rCTvUZvg9S0lU?si=-jBMT-QjTAWzwTDaC23gwg",
  },
  {
    title: "Night Drive",
    mood: "Soft Motion",
    src: "/audio/music-2.mp3",
    spotify: "https://open.spotify.com/track/3GCdLUSnKSMJhs4Tj6CV3s?si=GK-HqwjJQimT8bBQsqFV7Q",
  },
  {
    title: "Signal Bloom",
    mood: "Focus Mode",
    src: "/audio/music-3.mp3",
    spotify: "https://open.spotify.com/track/1rp2VekrJkaJ71HEaQUwAx?si=VUEDXtG9QqW1db-YdUvJoQ",
  },
  {
    title: "Afterglow",
    mood: "Portfolio Flow",
    src: "/audio/music-4.mp3",
    spotify: "https://open.spotify.com/track/4wCiTliB8X4GioUQW0nupW?si=XWn2hM4MS1agqqIlf7gQMQ",
  },
];

function useReducedMotionPreference() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
}

function fadeAudioTo(audio: HTMLAudioElement, targetVolume: number, duration = 650, onDone?: () => void) {
  const startVolume = audio.volume;
  const startedAt = performance.now();

  const tick = (now: number) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    audio.volume = startVolume + (targetVolume - startVolume) * eased;

    if (progress < 1) {
      window.requestAnimationFrame(tick);
      return;
    }

    onDone?.();
  };

  window.requestAnimationFrame(tick);
}

function registerInteraction(element?: HTMLElement) {
  if (!element) return;

  element.animate(
    [
      { transform: "scale(1)", filter: "brightness(1)" },
      { transform: "scale(0.985)", filter: "brightness(1.08)" },
      { transform: "scale(1)", filter: "brightness(1)" },
    ],
    {
      duration: 220,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  );
}

function WelcomeGateway({
  isVisible,
  onComplete,
}: {
  isVisible: boolean;
  onComplete: () => void;
}) {
  const [isLeaving, setIsLeaving] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const hasStarted = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tryStartWelcomeAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/welcome.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0;
    }

    audioRef.current
      .play()
      .then(() => {
        if (audioRef.current) fadeAudioTo(audioRef.current, 0.28, 520);
      })
      .catch(() => {
        // Browser may block audio until a stronger user gesture. Visual flow still continues.
      });
  };

  const enterPortfolio = () => {
    if (hasStarted.current) return;

    hasStarted.current = true;
    setIsLeaving(true);
    tryStartWelcomeAudio();

    window.setTimeout(() => {
      if (audioRef.current) {
        fadeAudioTo(audioRef.current, 0, 820, () => {
          audioRef.current?.pause();
          audioRef.current = null;
        });
      }

      onComplete();
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }, 760);
  };

  useEffect(() => {
    if (!isVisible) return;

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 6) return;
      event.preventDefault();
      enterPortfolio();
    };

    const handlePointerDown = () => {
      tryStartWelcomeAudio();
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY.current = event.touches[0]?.clientY ?? null;
      tryStartWelcomeAudio();
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const start = touchStartY.current;
      const end = event.changedTouches[0]?.clientY ?? null;

      touchStartY.current = null;

      if (start === null || end === null) return;

      const delta = start - end;
      if (Math.abs(delta) > 18) enterPortfolio();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === " " || event.key === "Enter") {
        event.preventDefault();
        enterPortfolio();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.section
          className={`welcome-gateway ${isLeaving ? "is-leaving" : ""}`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] } }}
        >
          <div className="welcome-text-shell">
            <p className="welcome-eyebrow">Dlavie Interactive Portfolio</p>

            <h1>
              <span>Scroll</span>
              <span>to enter</span>
              <span>the system.</span>
            </h1>

            <p className="welcome-description">
              Sebuah ruang digital untuk membaca cara berpikir, desain, motion, dan kualitas teknis Darma sebagai
              developer. Bersih di awal, imersif setelah kamu masuk.
            </p>

            <div className="welcome-scroll-hint">
              <span />
              <strong>Scroll down / swipe up</strong>
            </div>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}

function MusicIsland() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeTrack, setActiveTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notice, setNotice] = useState("Music system ready");

  const track = musicTracks[activeTrack];

  const pauseMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    fadeAudioTo(audio, 0, 480, () => {
      audio.pause();
      setIsPlaying(false);
      setNotice("Music paused");
    });
  };

  const playTrack = (index = activeTrack) => {
    const nextTrack = musicTracks[index];

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;

    if (!audio.src.includes(nextTrack.src)) {
      audio.src = nextTrack.src;
      audio.load();
    }

    audio.volume = 0;

    audio
      .play()
      .then(() => {
        setActiveTrack(index);
        setIsPlaying(true);
        setNotice(`Playing ${nextTrack.title}`);
        fadeAudioTo(audio, 0.36, 620);
      })
      .catch(() => {
        setActiveTrack(index);
        setIsPlaying(false);
        setNotice("Tambahkan file audio lokal atau buka Spotify");
      });
  };

  const nextTrack = () => {
    const nextIndex = (activeTrack + 1) % musicTracks.length;

    if (isPlaying) {
      pauseMusic();
      window.setTimeout(() => playTrack(nextIndex), 520);
      return;
    }

    setActiveTrack(nextIndex);
    setNotice(`Selected ${musicTracks[nextIndex].title}`);
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <aside className={`music-island ${isPlaying ? "is-playing" : ""}`}>
      <div className="music-equalizer" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <button
        type="button"
        className="music-toggle"
        data-cursor={isPlaying ? "Pause" : "Play"}
        onClick={() => {
          if (isPlaying) pauseMusic();
          else playTrack(activeTrack);
        }}
      >
        {isPlaying ? <Pause size={15} /> : <Play size={15} />}
      </button>

      <div className="music-copy">
        <span>{track.title}</span>
        <strong>{notice}</strong>
      </div>

      <button type="button" className="music-next" data-cursor="Next" onClick={nextTrack}>
        Next
      </button>

      <a className="music-spotify" href={track.spotify} target="_blank" rel="noreferrer" data-cursor="Spotify">
        Spotify
      </a>
    </aside>
  );
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
    const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    const mouseTarget = new THREE.Vector2(0.5, 0.5);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: auroraVertexShader,
      fragmentShader: auroraFragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);

      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width * pixelRatio, height * pixelRatio);
    };

    const pointer = (event: PointerEvent) => {
      mouseTarget.set(
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight,
      );
    };

    let frame = 0;

    const render = () => {
      if (!reducedMotion) uniforms.uTime.value += 0.016;
      uniforms.uMouse.value.lerp(mouseTarget, 0.075);
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

      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="shader-backdrop aurora-shader" aria-hidden="true" />;
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
};

function AntigravityParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const colors = ["124,58,237", "37,99,235", "94,234,212", "245,245,245"];
    const particles: Particle[] = [];
    const pointer = { x: -9999, y: -9999 };

    let width = 0;
    let height = 0;
    let frame = 0;

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      size: 1.2 + Math.random() * 2.8,
      alpha: 0.1 + Math.random() * 0.22,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.8);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particles.length = 0;

      const count = Math.min(62, Math.max(26, Math.floor(width / 28)));
      for (let i = 0; i < count; i += 1) particles.push(createParticle());
    };

    const movePointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      particles.forEach((particle, index) => {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 180) {
          const force = (180 - distance) / 180;
          particle.vx += (dx / Math.max(distance, 1)) * force * 0.014;
          particle.vy += (dy / Math.max(distance, 1)) * force * 0.014;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.992;
        particle.vy *= 0.992;

        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));

        ctx.beginPath();
        ctx.shadowBlur = 24;
        ctx.shadowColor = `rgba(${particle.color}, 0.42)`;
        ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
          const next = particles[nextIndex];
          const linkDistance = Math.hypot(particle.x - next.x, particle.y - next.y);
          if (linkDistance > 125) continue;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(124,58,237, ${(1 - linkDistance / 125) * 0.13})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
        }
      });

      ctx.restore();
      frame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", movePointer);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", movePointer);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="particles-layer antigravity-canvas" aria-hidden="true" />;
}

function CustomCursor() {
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 0,
    config: { mass: 1, tension: 420, friction: 28 },
  }));

  useEffect(() => {
    const pointerMove = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-cursor]") : null;

      api.start({
        x: event.clientX,
        y: event.clientY,
        scale: target ? 1 : 0.72,
      });

      if (target) {
        setLabel(target.dataset.cursor || "Open");
        setVisible(true);
      } else {
        setLabel("");
        setVisible(false);
      }
    };

    window.addEventListener("pointermove", pointerMove);
    return () => window.removeEventListener("pointermove", pointerMove);
  }, [api]);

  return (
    <animated.div
      className={`custom-cursor ${visible ? "is-active" : ""}`}
      style={{
        transform: to([x, y, scale], (nextX, nextY, nextScale) => {
          return `translate3d(${nextX}px, ${nextY}px, 0) translate(-50%, -50%) scale(${nextScale})`;
        }),
      }}
      aria-hidden="true"
    >
      <span>{label}</span>
    </animated.div>
  );
}

function useMotionSystem() {
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.065,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 34, filter: "blur(12px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 84%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".split-heading").forEach((element) => {
        const words = element.querySelectorAll<HTMLElement>(".split-word");

        gsap.fromTo(
          words,
          { yPercent: 110, filter: "blur(10px)", opacity: 0 },
          {
            yPercent: 0,
            filter: "blur(0px)",
            opacity: 1,
            duration: 0.85,
            stagger: 0.045,
            ease: "power4.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
            },
          },
        );
      });
    });

    return () => {
      context.revert();
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [reducedMotion]);
}

function ShinyText({ children }: { children: ReactNode }) {
  return <span className="shiny-text">{children}</span>;
}

function SplitHeading({ children }: { children: string }) {
  return (
    <span className="split-heading" aria-label={children}>
      {children.split(" ").map((word, index) => (
        <span className="split-mask" aria-hidden="true" key={`${word}-${index}`}>
          <span className="split-word" style={{ "--i": index } as CSSProperties}>
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

function RotatingText({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (reducedMotion) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, 1650);

    return () => window.clearInterval(timer);
  }, [reducedMotion, words.length]);

  return (
    <span className="rotating-shell" aria-live="polite">
      <span key={words[index]} className="rotating-word">
        {words[index]}
      </span>
    </span>
  );
}

function AiTypewriter() {
  return (
    <span className="ai-typewriter">
      <Typewriter
        options={{
          strings: [
            "shader-driven interfaces",
            "cinematic interaction systems",
            "AI-era visual identity",
            "premium web experiences",
          ],
          autoStart: true,
          loop: true,
          delay: 34,
          deleteSpeed: 18,
          cursor: "▌",
        }}
      />
    </span>
  );
}

function CircularText() {
  return (
    <div className="circular-brand" aria-label="Darma Dlavie Creative Developer">
      <svg viewBox="0 0 140 140" aria-hidden="true">
        <defs>
          <path id="dlavie-circular-text" d="M70,70 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" />
        </defs>
        <text>
          <textPath href="#dlavie-circular-text">Darma Dlavie • Creative Developer • </textPath>
        </text>
      </svg>
      <span>DL</span>
    </div>
  );
}

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplay(Math.round(value * eased));

      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, [reducedMotion, value]);

  return (
    <span className="metric-value">
      {display.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}

function MagneticButton({
  href,
  children,
  variant = "ghost",
  external = false,
  cursor = "Open",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
  cursor?: string;
}) {
  const [{ x, y, s }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    s: 1,
    config: { mass: 1, tension: 280, friction: 18 },
  }));

  const handleMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const relX = event.clientX - rect.left - rect.width / 2;
    const relY = event.clientY - rect.top - rect.height / 2;

    api.start({
      x: relX * 0.16,
      y: relY * 0.16,
      s: 1.035,
    });
  };

  const reset = () => {
    api.start({ x: 0, y: 0, s: 1 });
  };

  return (
    <animated.a
      className={`magnetic-button ${variant}`}
      href={href}
      data-cursor={cursor}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={(event) => registerInteraction(event.currentTarget)}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      style={{
        transform: to([x, y, s], (nextX, nextY, nextScale) => {
          return `translate3d(${nextX}px, ${nextY}px, 0) scale(${nextScale})`;
        }),
      }}
    >
      {children}
    </animated.a>
  );
}

function ProjectVisualStage({
  activeIndex,
  project,
}: {
  activeIndex: number;
  project: Project;
}) {
  const profileIndex = activeIndex % projectVisualProfiles.length;
  const visual = projectVisualProfiles[profileIndex];
  const visibleLogos = toolLogos.slice(0, 5);

  return (
    <div
      className={`project-visual-stage ${visual.pattern}`}
      aria-hidden="true"
      data-project={activeIndex}
      style={
        {
          "--project-accent": visual.accent,
          "--project-soft": visual.soft,
        } as CSSProperties
      }
    >
      <div className="visual-grid" />
      <div className="visual-ribbon visual-ribbon-a" />
      <div className="visual-ribbon visual-ribbon-b" />
      <div className="visual-orb visual-orb-primary" />
      <div className="visual-orb visual-orb-secondary" />
      <div className="visual-scanline" />

      <div className="visual-logo-cluster">
        {visibleLogos.map((tool, index) => (
          <span key={tool.name} className="visual-logo" style={{ "--i": index } as CSSProperties}>
            <img src={tool.icon} alt="" loading="lazy" />
          </span>
        ))}
      </div>

      <div className="visual-identity-mark">
        <span>{visual.mark}</span>
      </div>

      <div className="visual-caption">
        <span>{visual.label}</span>
        <strong>{project.title}</strong>
      </div>
    </div>
  );
}

function SignalRail() {
  return (
    <section className="signal-rail reveal" aria-label="Portfolio signal">
      <div className="signal-rail-copy">
        <p className="eyebrow">System language</p>
        <h2>
          Compact sections. Stronger rhythm. Less box, more editorial motion.
        </h2>
      </div>

      <div className="signal-track" aria-hidden="true">
        {[...techStack, ...capabilities, ...techStack].map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function Navbar() {
  const links = [
    ["Stage", "#top"],
    ["Works", "#workbench"],
    ["Stack", "#stack"],
    ["Contact", "#contact"],
  ];

  return (
    <header className="site-header">
      <a className="brand-mark" href="#top" aria-label="Back to top" data-cursor="Top">
        <span>DL</span>
        <strong>{profile.brand}</strong>
      </a>

      <nav className="nav-links" aria-label="Main navigation">
        {links.map(([label, href]) => (
          <a key={href} href={href} data-cursor="Go">
            {label}
          </a>
        ))}
      </nav>

      <span className="engine-badge">VFX ENGINE 1.0</span>
    </header>
  );
}

function Hero() {
  const emailHref = profile.email.includes("example") ? "#contact" : `mailto:${profile.email}`;

  return (
    <section id="top" className="hero stage-hero">
      <div className="hero-copy">
        <motion.div
          className="hero-kicker-row"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="eyebrow">
            {profile.location} / {profile.availability}
          </p>

          <span className="mini-rotator">
            building <RotatingText words={["interfaces", "motion", "systems", "experiences"]} />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease: "easeOut" }}
        >
          <SplitHeading children="Designing refined web experiences with" />{" "}
          <ShinyText>code, motion, and visual detail.</ShinyText>
        </motion.h1>

        <motion.div
          className="hero-typewriter"
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.18, ease: "easeOut" }}
        >
          <span>Focused on</span>
          <AiTypewriter />
        </motion.div>

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
          <MagneticButton href="#workbench" variant="primary" cursor="View">
            Explore the stage <ArrowUpRight size={18} />
          </MagneticButton>

          <MagneticButton href={emailHref} cursor="Contact">
            Start a project <Mail size={18} />
          </MagneticButton>
        </motion.div>

        <motion.div
          className="hero-logo-strip"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
        >
          {toolLogos.slice(0, 5).map((item) => (
            <span key={item.name} className="logo-pill" data-cursor={item.name}>
              <img src={item.icon} alt="" loading="lazy" />
              {item.name}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.aside
        className="hero-panel interactive-orb-panel"
        initial={{ opacity: 0, scale: 0.96, rotate: -1.2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, delay: 0.22, ease: "easeOut" }}
      >
        <div className="panel-topline">
          <span>Selected Identity</span>
          <CircularText />
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

function LiveStats() {
  const [visits, setVisits] = useState(1);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const key = "dlavie-portfolio-visits";
    const nextVisits = Number(window.localStorage.getItem(key) || "0") + 1;

    window.localStorage.setItem(key, String(nextVisits));
    setVisits(nextVisits);

    const formatter = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const update = () => setClock(formatter.format(new Date()));
    update();

    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const metrics = [
    { label: "Local visits", value: visits, suffix: "x", caption: "Kunjungan di browser kamu." },
    { label: "Projects", value: projects.length, suffix: "", caption: "Project aktif di portfolio." },
    { label: "Tech engines", value: toolLogos.length, suffix: "", caption: "Visual stack yang tampil." },
  ];

  return (
    <section className="metrics-grid reveal" aria-label="Live portfolio stats">
      {metrics.map((metric) => (
        <article key={metric.label} className="metric-card" data-cursor="Metric">
          <small>{metric.label}</small>
          <CountUp value={metric.value} suffix={metric.suffix} />
          <span>{metric.caption}</span>
        </article>
      ))}

      <article className="metric-card" data-cursor="Live">
        <small>Jakarta time</small>
        <span className="metric-value">{clock}</span>
        <span>Realtime clock for living interface.</span>
      </article>
    </section>
  );
}

function PrincipleIcon({ type }: { type: VisualPrinciple["icon"] }) {
  if (type === "layers") return <Layers3 />;
  if (type === "motion") return <Orbit />;
  if (type === "code") return <Code2 />;
  return <Gauge />;
}

function About() {
  return (
    <section id="about" className="content-section about-section">
      <div className="section-intro reveal">
        <p className="eyebrow">About</p>
        <h2>
          <ShinyText>Not a long page.</ShinyText> A compact interactive system.
        </h2>
        <p>{profile.longBio}</p>
      </div>

      <div className="principles-grid reveal compact-grid">
        {visualPrinciples.map((item) => (
          <button
            key={item.title}
            className="principle-card click-card"
            type="button"
            data-cursor="Focus"
            onClick={(event) => registerInteraction(event.currentTarget)}
          >
            <span className="card-icon">
              <PrincipleIcon type={item.icon} />
            </span>

            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function ProjectDeck() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex] ?? projects[0];
  const touchStartX = useRef<number | null>(null);

  const [{ rotateX, rotateY, scale }, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    config: { mass: 1, tension: 260, friction: 18 },
  }));

  const goToProject = (nextIndex: number) => {
    const resolvedIndex = (nextIndex + projects.length) % projects.length;
    setActiveIndex(resolvedIndex);
  };

  const handleMove = (event: ReactPointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const y = event.clientY - rect.top;
    const x = event.clientX - rect.left;

    api.start({
      rotateX: -(y / rect.height - 0.5) * 8,
      rotateY: (x / rect.width - 0.5) * 10,
      scale: 1.014,
    });
  };

  const reset = () => {
    api.start({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  const handleTouchStart = (event: ReactTouchEvent<HTMLElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: ReactTouchEvent<HTMLElement>) => {
    const start = touchStartX.current;
    const end = event.changedTouches[0]?.clientX ?? null;

    touchStartX.current = null;

    if (start === null || end === null) return;

    const delta = end - start;

    if (Math.abs(delta) < 42) {
      registerInteraction(event.currentTarget);
      return;
    }

    goToProject(delta < 0 ? activeIndex + 1 : activeIndex - 1);
    registerInteraction(event.currentTarget);
  };

  return (
    <section id="workbench" className="content-section workbench-section">
      <div className="section-intro reveal">
        <p className="eyebrow">Interactive workbench</p>
        <h2>
          Select a project. Feel the interface <RotatingText words={["respond", "tilt", "glow", "move"]} />.
        </h2>
        <p>
          Project dibuat lebih compact, lebih cinematic, dan tetap terasa aktif di mobile melalui tap, swipe, dan
          animated preview.
        </p>
      </div>

      <div className="project-deck reveal">
        <div className="project-tabs" role="tablist" aria-label="Project selector">
          {projects.map((project, index) => (
            <button
              key={project.title}
              className={`project-tab ${index === activeIndex ? "is-active" : ""}`}
              type="button"
              data-cursor="Select"
              onClick={(event) => {
                setActiveIndex(index);
                registerInteraction(event.currentTarget);
              }}
            >
              <span>0{index + 1}</span>
              <strong>{project.title}</strong>
              <small>{project.category}</small>
            </button>
          ))}
        </div>

        <animated.article
          className="deck-preview"
          data-cursor="Tilt"
          onMouseMove={handleMove}
          onMouseLeave={reset}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: to([rotateX, rotateY, scale], (nextX, nextY, nextScale) => {
              return `perspective(1000px) rotateX(${nextX}deg) rotateY(${nextY}deg) scale(${nextScale})`;
            }),
          }}
        >
          <ProjectVisualStage activeIndex={activeIndex} project={activeProject} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.title}
              className="deck-preview-inner"
              initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(12px)" }}
              transition={{ duration: 0.32, ease: "easeOut" }}
            >
              <div className="deck-toolbar">
                <span />
                <span />
                <span />
                <small>{activeProject.status}</small>
              </div>

              <div className="deck-main">
                <div>
                  <p className="eyebrow">
                    {activeProject.year} / {activeProject.category}
                  </p>

                  <h3>{activeProject.title}</h3>
                  <p>{activeProject.description}</p>
                </div>

                <div className="deck-orbit">
                  <Sparkles />
                </div>
              </div>

              <div className="tag-row">
                {activeProject.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>

              <div className="deck-actions">
                <MagneticButton href={activeProject.href ?? "#"} variant="primary" cursor="Open">
                  Open project <ArrowUpRight size={18} />
                </MagneticButton>

                <div className="project-swipe-controls" aria-label="Project controls">
                  <button type="button" data-cursor="Prev" onClick={() => goToProject(activeIndex - 1)}>
                    Prev
                  </button>

                  <button type="button" data-cursor="Next" onClick={() => goToProject(activeIndex + 1)}>
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </animated.article>
      </div>
    </section>
  );
}

function TechInspector() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTool = toolLogos[activeIndex] ?? toolLogos[0];

  return (
    <section id="stack" className="content-section stack-section">
      <div className="section-intro reveal">
        <p className="eyebrow">Technology inspector</p>
        <h2>
          A stack wall that reacts. <ShinyText>Click the engines.</ShinyText>
        </h2>
        <p>
          Logo bukan pajangan. Setiap engine bisa dipilih untuk memperlihatkan fungsi dan posisi teknisnya dalam
          portfolio.
        </p>
      </div>

      <div className="tech-inspector reveal">
        <aside className="tech-stage" data-cursor="Stack">
          <div className="tech-stage-reactor" aria-hidden="true" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool.name}
              initial={{ opacity: 0, scale: 0.96, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.96, filter: "blur(12px)" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <img src={activeTool.icon} alt={`${activeTool.name} logo`} />
              <p className="eyebrow">{activeTool.label}</p>
              <h3>{activeTool.name}</h3>
              <p>{activeTool.description}</p>
            </motion.div>
          </AnimatePresence>
        </aside>

        <div className="tech-grid" role="tablist" aria-label="Technology selector">
          {toolLogos.map((tool, index) => (
            <button
              key={tool.name}
              type="button"
              className={`tech-button ${index === activeIndex ? "is-active" : ""}`}
              data-cursor="Inspect"
              onClick={(event) => {
                setActiveIndex(index);
                registerInteraction(event.currentTarget);
              }}
            >
              <img src={tool.icon} alt="" loading="lazy" />
              <span>{tool.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="capability-grid reveal compact-caps">
        {capabilities.map((item) => (
          <span key={item} data-cursor="Skill">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = experience[activeIndex] ?? experience[0];

  return (
    <section className="content-section experience-section">
      <div className="section-intro reveal">
        <p className="eyebrow">Timeline</p>
        <h2>
          Experience as a <RotatingText words={["path", "record", "story", "system"]} />.
        </h2>
        <p>Timeline dibuat compact agar tidak menjadi scroll panjang yang membosankan.</p>
      </div>

      <div className="timeline-switcher reveal">
        <div className="timeline-tabs">
          {experience.map((item, index) => (
            <button
              key={`${item.period}-${item.role}`}
              type="button"
              className={index === activeIndex ? "is-active" : ""}
              data-cursor="Read"
              onClick={() => setActiveIndex(index)}
            >
              {item.period}
            </button>
          ))}
        </div>

        <article className="timeline-detail">
          <small>{active.period}</small>
          <h3>{active.role}</h3>
          <p className="company">{active.company}</p>
          <p>{active.description}</p>
        </article>
      </div>
    </section>
  );
}

function Contact() {
  const emailHref = profile.email.includes("example") ? "#" : `mailto:${profile.email}`;

  return (
    <section id="contact" className="contact-section reveal">
      <p className="eyebrow">Contact</p>

      <h2>
        Let’s shape Dlavie into a <ShinyText>king-level digital presence.</ShinyText>
      </h2>

      <p>
        Kirim foto, detail project, dan copywriting personal kamu. Setelah itu visual system ini bisa dipoles menjadi
        identity portfolio yang matang dan memorable.
      </p>

      <div className="contact-actions">
        <MagneticButton href={emailHref} variant="primary" cursor="Mail">
          {profile.email} <Mail size={18} />
        </MagneticButton>

        <MagneticButton href={profile.github} external cursor="GitHub">
          GitHub <GithubIcon size={18} />
        </MagneticButton>
      </div>
    </section>
  );
}

function App() {
  const [hasEntered, setHasEntered] = useState(false);

  useMotionSystem();

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
  };

  return (
    <main onPointerMove={handlePointerMove}>
      <WelcomeGateway isVisible={!hasEntered} onComplete={() => setHasEntered(true)} />

      <ShaderBackdrop />
      <AntigravityParticles />
      <CustomCursor />

      <div className="noise" aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" />

      <Navbar />
      <Hero />
      <LiveStats />
      <SignalRail />
      <ProjectDeck />
      <TechInspector />
      <About />
      <Experience />
      <Contact />

      <footer className="footer">
        <span>© 2026 {profile.name}</span>
        <span>Designed for {profile.brand}</span>
      </footer>

      {hasEntered ? <MusicIsland /> : null}

      <Analytics />
      <SpeedInsights />
    </main>
  );
}

export default App;