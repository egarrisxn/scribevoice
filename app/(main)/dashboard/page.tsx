import type { Metadata } from "next";
import Logo from "@/components/logo";
import ThemeToggle from "@/components/theme-toggle";
import Dashboard from "@/components/dashboard";
import Footer from "@/components/footer";
import SignOutButton from "@/components/signout-button";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "ScribeVerse Dashboard.",
};

export default function Home() {
  return (
    <div className="mx-auto flex w-full flex-col">
      <header className="mx-auto flex w-full items-center justify-between p-4 sm:p-5">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-3">
          <SignOutButton />
          <ThemeToggle />
        </nav>
      </header>
      <Dashboard />
      <Footer />
    </div>
  );
}
