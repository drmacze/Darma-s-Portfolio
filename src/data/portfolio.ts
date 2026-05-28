export type Project = {
  title: string;
  year: string;
  category: string;
  description: string;
  stack: string[];
  href?: string;
  status: "draft" | "live" | "private";
};

export type ExperienceItem = {
  period: string;
  role: string;
  company: string;
  description: string;
};

export type ToolLogo = {
  name: string;
  label: string;
  icon: string;
  description: string;
};

export type VisualPrinciple = {
  title: string;
  description: string;
  icon: "layers" | "motion" | "code" | "performance";
};

export const profile = {
  name: "Darma",
  brand: "Dlavie",
  role: "Creative Developer",
  location: "Indonesia",
  availability: "Open for collaboration",
  email: "your-email@example.com",
  github: "https://github.com/drmacze",
  instagram: "#",
  linkedin: "#",

  // TODO: Ganti setelah kamu siapkan foto.
  // Taruh file di public/images/darma-profile.jpg lalu ubah menjadi: "/images/darma-profile.jpg"
  avatar: "",

  headline: "Building Dlavie as a motion-first digital identity.",
  shortBio:
    "Darma membangun interface yang terasa hidup: cepat, responsif, visual, dan punya arah produk. Portfolio ini dirancang sebagai stage interaktif, bukan sekadar halaman teks statis.",
  longBio:
    "Dlavie adalah identitas digital untuk menggabungkan engineering, UI/UX, motion, dan eksperimen visual. Fokusnya bukan hanya membuat website berfungsi, tapi menciptakan pengalaman yang terlihat matang, terasa presisi, dan mudah dikembangkan menjadi produk nyata.",
};

export const stats = [
  { value: "03", label: "Interactive project slots" },
  { value: "16", label: "Visual technology marks" },
  { value: "60fps", label: "Motion-first experience" },
];

export const visualPrinciples: VisualPrinciple[] = [
  {
    title: "Kinetic Welcome",
    description: "First impression dibuat dengan teks bergerak, line motion, dan entrance flow yang bersih agar terasa seperti digital product intro.",
    icon: "motion",
  },
  {
    title: "Icon-Rich Interface",
    description: "Logo teknologi asli, glyph visual, chip stack, dan micro states dipakai untuk mengurangi kesan teks polos.",
    icon: "layers",
  },
  {
    title: "Compact Composition",
    description: "Box besar dikurangi. Section dibuat lebih rapat, visual, dan editorial supaya tidak boros tempat.",
    icon: "performance",
  },
  {
    title: "Production Mindset",
    description: "Efek visual tetap punya fallback, musik hanya opt-in, dan animasi diposisikan sebagai enhancement yang terkontrol.",
    icon: "code",
  },
];

export const capabilities = [
  "Creative Frontend",
  "Motion UI",
  "WebGL Atmosphere",
  "Responsive System",
  "Component Architecture",
  "Shader Styling",
  "Scroll Storytelling",
  "Interactive Cards",
  "Design Systems",
  "Performance Pass",
  "Mobile Touch UX",
  "Product Thinking",
];

export const toolLogos: ToolLogo[] = [
  {
    name: "React",
    label: "Interface",
    icon: "https://cdn.simpleicons.org/react/61DAFB",
    description: "Component-driven UI untuk membangun portfolio sebagai sistem, bukan halaman statis.",
  },
  {
    name: "TypeScript",
    label: "Safety",
    icon: "https://cdn.simpleicons.org/typescript/3178C6",
    description: "Typed codebase agar struktur data, komponen, dan props lebih aman dikembangkan.",
  },
  {
    name: "Vite",
    label: "Build",
    icon: "https://cdn.simpleicons.org/vite/646CFF",
    description: "Build tool modern untuk workflow cepat, HMR ringan, dan deployment sederhana.",
  },
  {
    name: "GSAP",
    label: "Timeline",
    icon: "https://cdn.simpleicons.org/greensock/88CE02",
    description: "Scroll-triggered animation, entrance sequencing, dan motion orchestration.",
  },
  {
    name: "Three.js",
    label: "WebGL",
    icon: "https://cdn.simpleicons.org/threedotjs/FFFFFF",
    description: "Atmospheric shader backdrop dan efek visual berbasis GPU.",
  },
  {
    name: "Framer Motion",
    label: "Motion UI",
    icon: "https://cdn.simpleicons.org/framer/0055FF",
    description: "Transition, reveal, dan komponen animasi React yang smooth.",
  },
  {
    name: "React Three Fiber",
    label: "3D React",
    icon: "https://cdn.simpleicons.org/react/61DAFB",
    description: "Fondasi untuk scene 3D interaktif di ekosistem React.",
  },
  {
    name: "Theatre.js",
    label: "Cinematic",
    icon: "https://cdn.simpleicons.org/javascript/F7DF1E",
    description: "Timeline direction untuk animasi sinematik dan motion direction.",
  },
  {
    name: "Lenis",
    label: "Smooth Scroll",
    icon: "https://cdn.simpleicons.org/scrollreveal/FFCB36",
    description: "Smooth scrolling untuk pengalaman membaca yang lebih halus.",
  },
  {
    name: "CSS3",
    label: "Visual Layer",
    icon: "https://cdn.simpleicons.org/css3/1572B6",
    description: "Layout, blend mode, keyframes, responsive styling, dan interaction polish.",
  },
  {
    name: "GLSL",
    label: "Shader",
    icon: "https://cdn.simpleicons.org/opengl/5586A4",
    description: "Shader language untuk atmosfer visual, noise, distortion, dan GPU effect.",
  },
  {
    name: "Anime.js",
    label: "Micro Motion",
    icon: "https://cdn.simpleicons.org/javascript/F7DF1E",
    description: "Animation engine untuk micro-interaction dan sequencing ringan.",
  },
  {
    name: "Lottie",
    label: "Vector Motion",
    icon: "https://cdn.simpleicons.org/lottie/00DDB3",
    description: "Vector animation untuk icon, loader, dan motion asset ringan.",
  },
  {
    name: "Vercel",
    label: "Deployment",
    icon: "https://cdn.simpleicons.org/vercel/FFFFFF",
    description: "Hosting, analytics, speed insights, dan deployment pipeline.",
  },
  {
    name: "GitHub",
    label: "Workflow",
    icon: "https://cdn.simpleicons.org/github/FFFFFF",
    description: "Repository, versioning, dan integrasi deployment otomatis.",
  },
  {
    name: "Figma",
    label: "Design",
    icon: "https://cdn.simpleicons.org/figma/F24E1E",
    description: "Visual planning, layout reference, dan UI design direction.",
  },
];

export const projects: Project[] = [
  {
    title: "Lumina",
    year: "2026",
    category: "Web Product",
    description:
      "Product interface untuk eksperimen Dlavie: clean layout, motion layer, responsive component, dan arah visual yang siap dikembangkan menjadi website nyata.",
    stack: ["React", "TypeScript", "Motion UI", "GSAP"],
    href: "#",
    status: "draft",
  },
  {
    title: "Dlavie Portfolio System",
    year: "2026",
    category: "Personal Brand",
    description:
      "Portfolio interaktif dengan welcome gate, technology wall, project preview, WebGL atmosphere, smooth scroll, dan compact visual rhythm.",
    stack: ["Vite", "React", "Three.js", "Lenis"],
    href: "#",
    status: "draft",
  },
  {
    title: "Creative Case Study",
    year: "2026",
    category: "Case Study",
    description:
      "Slot case study untuk project terbaik berikutnya: fokus pada problem, role, tech decision, visual result, dan dampak terhadap user experience.",
    stack: ["UI/UX", "Responsive", "Animation", "Performance"],
    href: "#",
    status: "draft",
  },
];

export const experience: ExperienceItem[] = [
  {
    period: "2026 — Now",
    role: "Creative Developer",
    company: "Dlavie",
    description:
      "Membangun identitas digital Dlavie melalui UI engineering, motion language, visual system, dan eksperimen web modern.",
  },
  {
    period: "2025 — 2026",
    role: "Web Development Learner",
    company: "Independent Projects",
    description:
      "Mengasah fondasi frontend, layout responsive, styling modern, component architecture, dan deployment workflow.",
  },
];

export const techStack = [
  "React",
  "TypeScript",
  "Vite",
  "GSAP",
  "Three.js",
  "Framer Motion",
  "Lenis",
  "React Three Fiber",
  "Theatre.js",
  "GLSL",
  "Lottie",
  "Vercel",
  "Responsive UI",
  "Creative Development",
];
