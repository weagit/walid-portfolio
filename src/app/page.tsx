import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Journey from "@/components/Journey";
import Toolkit from "@/components/Toolkit";
import Contact from "@/components/Contact";
import StatueLayer from "@/components/StatueLayer";
import LiquidEther from "@/components/LiquidEther";
import PillNav from "@/components/PillNav";

export default function Home() {
  return (
    <main className="flex-1 relative">
      {/* Liquid ether background — subtle steel ribbons drifting + reacting
          to cursor. Sits at viewport-level behind everything. */}
      <div
        aria-hidden
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ opacity: 0.7 }}
      >
        <LiquidEther
          colors={["#1A1D24", "#4A5664", "#A8B5C4"]}
          mouseForce={12}
          cursorSize={120}
          resolution={0.35}
          iterationsPoisson={16}
          iterationsViscous={16}
          dt={0.014}
          autoDemo
          autoSpeed={0.32}
          autoIntensity={1.6}
        />
      </div>

      {/* Soft grain over the liquid for film texture */}
      <div
        aria-hidden
        className="grain fixed inset-0 z-0 pointer-events-none opacity-40"
      />

      <PillNav />
      <StatueLayer />
      <Hero />
      <About />
      <Projects />
      <Journey />
      <Toolkit />
      <Contact />
    </main>
  );
}
