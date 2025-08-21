import Link from "next/link";
import Logo from "@/components/logo";
import SignOutButton from "@/components/signout-button";
import ThemeToggle from "@/components/theme-toggle";

export default function DashboardNav() {
  return (
    <header className="absolute top-0 z-10 container mx-auto flex w-full items-center justify-between p-2 sm:p-4 lg:p-6">
      <Logo />
      <nav className="flex items-center gap-4 sm:gap-5">
        <Link
          href="/"
          className="cursor-pointer text-sm font-medium text-primary transition-all duration-150 ease-in-out hover:text-blue-400 hover:underline hover:underline-offset-4 sm:text-base"
        >
          Home
        </Link>
        <SignOutButton />
        <ThemeToggle />
      </nav>
    </header>
  );
}
