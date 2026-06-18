import { Hero } from "./components/sections/Hero";
import { FeatureBentoGrid } from "./components/sections/FeatureBentoGrid";
import { PlatformHighlights } from "./components/sections/PlatformHighlights";
import { DataFlowBanner } from "./components/sections/DataFlowBanner";
import { Footer } from "./components/sections/Footer";

function App() {
  return (
    <main className="bg-ink">
      <Hero />
      <FeatureBentoGrid />
      <PlatformHighlights />
      <DataFlowBanner />
      <Footer />
    </main>
  );
}

export default App;
