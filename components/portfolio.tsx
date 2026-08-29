import { capabilities, engineeringPrinciples, experience, mindsetPrinciples, nowItems, projects, stories, toolbox } from "@/lib/content";
import { BuildsSection, CapabilitiesSection, ContactSection, ExperienceSection, NowSection, ThinkingSection, ToolboxSection, WorkSection } from "./portfolio-sections";
import { IntroLoader } from "./intro-loader";
import { CustomCursor, Header, Hero, MotionProvider, PageProgress } from "./portfolio-interactive";

export default function Portfolio() {
  return <MotionProvider><IntroLoader /><CustomCursor /><a href="#main-content" className="skip-link">Skip to content</a><main id="main-content" tabIndex={-1} className="noise overflow-hidden"><PageProgress /><Header /><Hero /><CapabilitiesSection capabilities={capabilities} /><WorkSection stories={stories} /><BuildsSection projects={projects} /><ThinkingSection principles={mindsetPrinciples} engineeringPrinciples={engineeringPrinciples} /><ExperienceSection experience={experience} /><ToolboxSection toolbox={toolbox} />{/* Notes remain hidden until a published article is available. */}<NowSection items={nowItems} /><ContactSection /><footer className="mx-auto flex max-w-6xl justify-between border-t hairline px-6 py-8 text-xs text-slate-500 md:px-10"><span>Santosh Thakur · Noida, India</span><span>© {new Date().getFullYear()}</span></footer></main></MotionProvider>;
}
