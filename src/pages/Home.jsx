import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection ";
import HowItWorksSection from "@/components/HowItWorksSection ";
import TestimonialsSection from "@/components/TestimonialsSection ";
import { useEffect } from "react";

const SectionDivider = () => (
  <div className="relative flex items-center justify-center py-2 px-8">
    {/* left line */}
    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-300/60" />

    {/* center diamond */}
    <div className="mx-4 w-2 h-2 rotate-45 bg-amber-400/70 shrink-0" />

    {/* right line */}
    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-300/60" />
  </div>
);

const Home = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div>
      <main className="min-h-screen bg-[#faf8f4]">

        <Hero />

        <SectionDivider />
        <FeaturesSection />

        <SectionDivider />

        <HowItWorksSection />

        <SectionDivider />


        <TestimonialsSection />

        <SectionDivider />

        <StatsSection />

      </main>
    </div>
  );
};

export default Home;