import MainNavbar from "@/components/main-nav";
import Hero from "@/components/hero";
import MainFooter from "@/components/footer";

export default function Home() {
  return (
    <div className="grid min-h-[100dvh] w-full grid-rows-[auto_1fr_auto]">
      <MainNavbar />
      <Hero />
      <MainFooter />
    </div>
  );
}
