import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeatureAgents } from "@/components/landing/FeatureAgents";
import { FeatureTeams } from "@/components/landing/FeatureTeams";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />
      <Hero />
      <FeatureAgents />
      <FeatureTeams />
      <FAQ />
      <Footer />
    </main>
  );
}
