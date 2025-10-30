import Image from "next/image";
import { Hero } from "../components/Hero";
import { WhyChoose } from "../components/WhyChoose";
import { HowItWorks } from "../components/HowItWorks";
import { Opportunities } from "../components/Opportunities";
import { Testimonials } from "../components/Testimonials";
import { CTA } from "../components/CTA";
import { Benefits } from "../components/Benefits";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <WhyChoose />
      <Benefits />
      <HowItWorks />
      <Opportunities />
      <Testimonials />
      <CTA />
    </main>
  );
}
