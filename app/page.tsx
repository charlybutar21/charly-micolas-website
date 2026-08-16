import Hero from "./components/Hero";
import About from "./components/About";
import CoreCompetencies from "./components/CoreCompetencies";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <main className="container">
      <Hero />
      <About />
      <CoreCompetencies />
      <Skills />
      <Experience />
      <Education />
      <Contact />
    </main>
  );
}
