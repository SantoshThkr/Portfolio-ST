/**
 * Single source of truth for identity, URLs and contact details.
 * Change the domain here and every canonical URL, sitemap entry,
 * Open Graph tag and JSON-LD block follows.
 */
export const site = {
  url: "https://santosht.dev",
  name: "Santosh Thakur",
  role: "Full-stack AI engineer",
  location: { city: "Noida", region: "Uttar Pradesh", country: "India", timeZone: "Asia/Kolkata" },
  email: "santoshthakurxd@gmail.com",
  github: "https://github.com/SantoshThkr",
  linkedin: "https://www.linkedin.com/in/ithakurr/",
  resume: "/SantoshThakurResume.pdf",
  portrait: { src: "/my-avtar/Avtar1.PNG", width: 1024, height: 1536 },
  title: "Santosh Thakur — Full-stack AI engineer",
  description:
    "Full-stack AI engineer in Noida building RAG systems, streaming LLM interfaces, and the React, Next.js, FastAPI and NestJS services around them. 6+ years of production web engineering.",
} as const;

export const nav = [
  { label: "Work", href: "/#work", id: "work" },
  { label: "Experience", href: "/#experience", id: "experience" },
  { label: "Skills", href: "/#skills", id: "skills" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Contact", href: "/#contact", id: "contact" },
] as const;
