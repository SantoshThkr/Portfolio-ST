import { engineeringPrinciples, explorations, mindsetPrinciples, stories, toolbox } from "@/lib/content";
import { ContactSection, JourneySection, NowSection, ThinkingSection, ToolboxSection, WorkSection } from "./portfolio-sections";
import { Header, Hero, MotionProvider, PageProgress } from "./portfolio-interactive";

export default function Portfolio() {
  return <MotionProvider><a href="#main-content" className="skip-link">Skip to content</a><main id="main-content" tabIndex={-1} className="noise overflow-hidden"><PageProgress /><Header /><Hero /><WorkSection stories={stories} /><ThinkingSection principles={mindsetPrinciples} engineeringPrinciples={engineeringPrinciples} /><JourneySection /><ToolboxSection toolbox={toolbox} /><NowSection explorations={explorations} /><ContactSection /><footer className="mx-auto flex max-w-6xl justify-between border-t hairline px-6 py-8 text-xs text-slate-500 md:px-10"><span>Santosh Thakur · Noida, India</span><span>© {new Date().getFullYear()}</span></footer></main></MotionProvider>;
}
