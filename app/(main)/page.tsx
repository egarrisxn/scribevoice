import Navbar from "@/components/shared/navbar";
import Hero from "@/components/landing/hero";
import CTA from "@/components/landing/cta";
import Footer from "@/components/shared/footer";

export default function Home() {
  return (
    <div className="mx-auto flex w-full flex-col">
      <Navbar />
      <Hero />
      <CTA />
      <Footer />
    </div>
  );
}
