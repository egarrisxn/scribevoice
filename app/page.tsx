import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Landing from "@/components/landing";
import CTA from "@/components/cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="grid min-h-[100dvh] max-w-screen grid-rows-[auto_1fr_auto] overflow-x-hidden">
      <Navbar />
      <Hero />
      <Landing />
      <CTA />
      <Footer />
    </main>
  );
}
