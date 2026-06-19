import { Hero } from "./components/sections/Hero";
import { FeatureBentoGrid } from "./components/sections/FeatureBentoGrid";
import { PlatformHighlights } from "./components/sections/PlatformHighlights";
import { DataFlowBanner } from "./components/sections/DataFlowBanner";
import { Footer } from "./components/sections/Footer";
import { Navbar } from "./components/ui/Navbar";

function App() {
  return (
    <div className="bg-ink scroll-smooth">
      <Navbar />
      <main>
        <Hero />
        <FeatureBentoGrid />
        <PlatformHighlights />
        <DataFlowBanner />
        <Footer />
      </main>
    </div>
  );
}

export default App;
