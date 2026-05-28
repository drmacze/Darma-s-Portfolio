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

  // TODO: Ini placeholder. Nanti jawab pertanyaan di README agar aku bantu refine copywriting-nya.
  headline: "I build immersive digital products with code, motion, and precise interaction design.",
  shortBio:
    "Tulis deskripsi singkat kamu di sini: siapa kamu, fokus development kamu, dan value yang kamu bawa sebagai developer Dlavie.",
  longBio:
    "Bagian ini untuk cerita yang lebih personal: perjalanan kamu sebagai developer, jenis project yang kamu sukai, prinsip desain/kode, dan target karier kamu.",
};

export const stats = [
  { value: "01", label: "Brand identity to refine" },
  { value: "03+", label: "Core web skills to highlight" },
  { value: "∞", label: "Experiments in motion & shaders" },
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

export const projects: Project[] = [
  {
    title: "Lumina",
    year: "2026",
    category: "Web Product",
    description:
      "Deskripsikan project Lumina di sini: masalah yang diselesaikan, fitur utama, peran kamu, dan hasil yang ingin ditonjolkan.",
    stack: ["React", "TypeScript", "Motion", "GSAP"],
    href: "#",
    status: "draft",
  },
  {
    title: "Dlavie Portfolio System",
    year: "2026",
    category: "Personal Brand",
    description:
      "Portfolio sinematik yang menggabungkan UI modern, scroll animation, shader background, dan struktur konten yang mudah diedit.",
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
  "Motion",
  "Lenis",
  "tsParticles",
  "CSS Shaders",
  "Responsive UI",
];
