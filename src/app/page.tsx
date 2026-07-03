import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Leaderboard } from "@/components/Leaderboard";
import { ApplyForm } from "@/components/ApplyForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <Leaderboard />
      <ApplyForm />
      <Footer />
    </main>
  );
}
