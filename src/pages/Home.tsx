import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import CaseStudies from "../components/CaseStudies";
import TechStack from "../components/TechStack";
import StatsSection from "../components/StatsSection";
import About from "../components/About";
import Contact from "../components/Contact";
import Seo from "../components/Seo";

export default function Home() {
  // Only show the loading animation on a fresh visit, not when navigating
  // back to "/" from another route.
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(
    () => !sessionStorage.getItem("encytics.visited")
  );

  const finish = () => {
    sessionStorage.setItem("encytics.visited", "1");
    setIsLoading(false);
  };

  return (
    <>
      <Seo />
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={finish} />}
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

      {/* If we arrived with a hash (e.g. /#services), let the browser scroll. */}
      {!isLoading && location.hash ? <ScrollToHash hash={location.hash} /> : null}
    </>
  );
}

function ScrollToHash({ hash }: { hash: string }) {
  // Defer to next frame so the section is mounted before we scroll.
  requestAnimationFrame(() => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
  return null;
}
