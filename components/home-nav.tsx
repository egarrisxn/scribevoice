import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/logo";
import SignOutButton from "./signout-button";
import ThemeToggle from "@/components/theme-toggle";

export default async function HomeNav() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <header className="absolute top-0 z-10 container mx-auto flex w-full items-center justify-between p-2 sm:p-4 lg:p-6">
      <Logo />
      <nav className="flex items-center gap-4 text-sm font-medium text-primary sm:gap-5 sm:text-base">
        {session ? (
          <div className="flex flex-row items-center gap-4 sm:gap-5">
            <Link
              href="/dashboard"
              className="cursor-pointer transition-all duration-150 ease-in-out hover:text-blue-400 hover:underline hover:underline-offset-4"
            >
              Dashboard
            </Link>
            <SignOutButton />
          </div>
        ) : (
          <Link
            href="/login"
            className="cursor-pointer transition-all duration-150 ease-in-out hover:text-blue-400 hover:underline hover:underline-offset-4"
          >
            Login
          </Link>
        )}
        <ThemeToggle />
      </nav>
    </header>
  );
}
