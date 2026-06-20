import { Hero } from "./components/sections/Hero";
import { FeatureBentoGrid } from "./components/sections/FeatureBentoGrid";
import { PlatformHighlights } from "./components/sections/PlatformHighlights";
import { DataFlowBanner } from "./components/sections/DataFlowBanner";
import { TeamSection } from "./components/sections/TeamSection";
import { Footer } from "./components/sections/Footer";
import { Navbar } from "./components/ui/Navbar";

function App() {
  return (
    <div className="bg-base scroll-smooth">
      <Navbar />
      <main>
        <Hero />
        <FeatureBentoGrid />
        <PlatformHighlights />
        <DataFlowBanner />
        <TeamSection />
        <Footer />
      </main>
    </div>
  );
}

export default App;
