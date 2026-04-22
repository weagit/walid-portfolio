import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Journey from "@/components/Journey";
import Toolkit from "@/components/Toolkit";
import Contact from "@/components/Contact";
import StatueLayer from "@/components/StatueLayer";
import AmbientWallpaper from "@/components/AmbientWallpaper";

export default function Home() {
  return (
    <main className="flex-1 relative">
      <AmbientWallpaper />
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
