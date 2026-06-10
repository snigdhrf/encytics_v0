import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import CaseStudies from "./components/CaseStudies";
import TechStack from "./components/TechStack";
import StatsSection from "./components/StatsSection";
import About from "./components/About";
import Contact from "./components/Contact";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <Navbar />
          <main>
            <Hero />
            <Services />
            <CaseStudies />
            <TechStack />
            <StatsSection />
            <About />
            <Contact />
          </main>
        </>
      )}
    </>
  );
}

export default App;
