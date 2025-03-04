import Logo from "@/components/logo";
import LoginButton from "@/components/login-button";
import ThemeToggle from "@/components/theme-toggle";
import Hero from "@/components/hero";
import CTA from "@/components/cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="mx-auto flex w-full flex-col">
      <header className="mx-auto flex w-full items-center justify-between p-4 sm:p-5">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-3">
          <LoginButton />
          <ThemeToggle />
        </nav>
      </header>
      <Hero />
      <CTA />
      <Footer />
    </div>
  );
}
