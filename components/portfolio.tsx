import { capabilities, engineeringPrinciples, experience, mindsetPrinciples, nowItems, projects, stories, toolbox } from "@/lib/content";
import { BuildsSection, CapabilitiesSection, ContactSection, ExperienceSection, NowSection, ThinkingSection, ToolboxSection, WorkSection } from "./portfolio-sections";
import { Header, Hero, MotionProvider, PageProgress } from "./portfolio-interactive";

export default function Portfolio() {
  return <MotionProvider><a href="#main-content" className="skip-link">Skip to content</a><main id="main-content" tabIndex={-1} className="noise overflow-hidden"><PageProgress /><Header /><Hero /><CapabilitiesSection capabilities={capabilities} /><WorkSection stories={stories} /><BuildsSection projects={projects} /><ThinkingSection principles={mindsetPrinciples} engineeringPrinciples={engineeringPrinciples} /><ExperienceSection experience={experience} /><ToolboxSection toolbox={toolbox} /><NowSection items={nowItems} /><ContactSection /><footer className="site-footer"><span>Santosh Thakur · Noida, India</span><span>© {new Date().getFullYear()}</span></footer></main></MotionProvider>;
}
