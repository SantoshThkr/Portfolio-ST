import { About } from "@/components/home/about";
import { Anatomy } from "@/components/home/anatomy";
import { Contact } from "@/components/home/contact";
import { Experience } from "@/components/home/experience";
import { Hero } from "@/components/home/hero";
import { Skills } from "@/components/home/skills";
import { Work } from "@/components/home/work";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Anatomy />
      <Work />
      <Experience />
      <Skills />
      <About />
      <Contact />
    </>
  );
}
