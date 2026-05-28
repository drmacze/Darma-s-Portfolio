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
  role: "Developer",
  location: "Indonesia",
  availability: "Open for collaboration",
  email: "your-email@example.com",
  github: "https://github.com/drmacze",
  instagram: "#",
  linkedin: "#",

  // TODO: Ganti setelah kamu kirim/siapkan foto.
  // Taruh file di public/images/darma-profile.jpg lalu ubah menjadi: "/images/darma-profile.jpg"
  avatar: "",

  // TODO: Ini placeholder. Nanti jawab pertanyaan personalisasi agar copywriting bisa dibuat lebih tajam.
  headline: "Designing refined web experiences with code, motion, and visual detail.",
  shortBio:
    "Portfolio ini masih memakai placeholder. Isi dengan deskripsi singkat tentang Darma, fokus development kamu, dan value yang kamu bawa sebagai developer Dlavie.",
  longBio:
    "Bagian ini disiapkan untuk cerita personal kamu sebagai developer: perjalanan belajar, jenis project yang ingin kamu bangun, prinsip desain/kode, dan arah Dlavie sebagai identitas digital.",
};

export const stats = [
  { value: "01", label: "Brand identity to refine" },
  { value: "03+", label: "Core web skills to highlight" },
  { value: "∞", label: "Motion and interaction experiments" },
];

export const visualPrinciples: VisualPrinciple[] = [
  {
    title: "Editorial Layout",
    description: "Section dibuat lebih visual dengan hierarchy, cards, dan rhythm agar tidak terasa seperti kumpulan teks polos.",
    icon: "layers",
  },
  {
    title: "Subtle Motion",
    description: "Animasi tetap ada, tapi dibuat lebih elegan: smooth reveal, parallax ringan, dan ambient particles yang tidak norak.",
    icon: "motion",
  },
  {
    title: "Clean Engineering",
    description: "Konten dipisah dari komponen supaya mudah diedit, aman dideploy, dan tidak bergantung pada library berat yang tidak perlu.",
    icon: "code",
  },
  {
    title: "Performance Aware",
    description: "Shader dan efek visual dipakai sebagai enhancement, dengan reduced-motion fallback untuk aksesibilitas dan device low-end.",
    icon: "performance",
  },
];

export const capabilities = [
  "Frontend Engineering",
  "UI/UX Implementation",
  "Responsive Web Design",
  "Animation Systems",
  "Three.js / Shader Experiments",
  "Performance Optimization",
  "Component Architecture",
  "Creative Development",
];

export const toolLogos: ToolLogo[] = [
  {
    name: "React",
    label: "Interface",
    icon: "https://cdn.simpleicons.org/react/61DAFB",
    description: "Component-driven UI dengan ekosistem modern.",
  },
  {
    name: "TypeScript",
    label: "Safety",
    icon: "https://cdn.simpleicons.org/typescript/3178C6",
    description: "Typed codebase agar struktur lebih aman dan maintainable.",
  },
  {
    name: "Vite",
    label: "Tooling",
    icon: "https://cdn.simpleicons.org/vite/646CFF",
    description: "Development server cepat dan build ringan.",
  },
  {
    name: "GSAP",
    label: "Timeline",
    icon: "https://cdn.simpleicons.org/greensock/88CE02",
    description: "Scroll-triggered animation dan timeline yang presisi.",
  },
  {
    name: "Three.js",
    label: "WebGL",
    icon: "https://cdn.simpleicons.org/threedotjs/FFFFFF",
    description: "Shader backdrop dan eksperimen visual berbasis GPU.",
  },
  {
    name: "Framer Motion",
    label: "Motion UI",
    icon: "https://cdn.simpleicons.org/framer/0055FF",
    description: "Entrance animation dan micro-interaction untuk React.",
  },
  {
    name: "CSS3",
    label: "Styling",
    icon: "https://cdn.simpleicons.org/css3/1572B6",
    description: "Responsive layout, visual polish, dan detail interaction.",
  },
  {
    name: "GitHub",
    label: "Workflow",
    icon: "https://cdn.simpleicons.org/github/FFFFFF",
    description: "Repository, versioning, dan deployment workflow.",
  },
];

export const projects: Project[] = [
  {
    title: "Lumina",
    year: "2026",
    category: "Web Product",
    description:
      "Deskripsikan project Lumina di sini: masalah yang diselesaikan, fitur utama, peran kamu, dan hasil yang ingin ditonjolkan.",
    stack: ["React", "TypeScript", "Framer Motion", "GSAP"],
    href: "#",
    status: "draft",
  },
  {
    title: "Dlavie Portfolio System",
    year: "2026",
    category: "Personal Brand",
    description:
      "Portfolio premium dengan layout editorial, logo technology wall, subtle shader background, smooth scroll, dan struktur konten yang mudah diedit.",
    stack: ["Vite", "React", "Three.js", "Lenis"],
    href: "#",
    status: "draft",
  },
  {
    title: "Project Name Here",
    year: "2026",
    category: "Case Study",
    description:
      "Ganti dengan project terbaik kamu. Jelaskan konteks, kontribusi teknis, dan dampaknya dalam 1–2 kalimat padat.",
    stack: ["HTML", "CSS", "JavaScript"],
    href: "#",
    status: "draft",
  },
];

export const experience: ExperienceItem[] = [
  {
    period: "2026 — Now",
    role: "Developer",
    company: "Dlavie",
    description:
      "Isi pengalaman kamu di Dlavie: apa yang kamu bangun, teknologi yang digunakan, dan tanggung jawab utama.",
  },
  {
    period: "2025 — 2026",
    role: "Web Development Learner",
    company: "Independent Projects",
    description:
      "Isi perjalanan belajar kamu: stack yang dikuasai, project latihan, kontribusi, atau pencapaian penting.",
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
  "Canvas Particles",
  "CSS Shaders",
  "Responsive UI",
];
