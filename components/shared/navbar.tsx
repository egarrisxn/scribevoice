import Logo from "@/components/shared/logo";
import LoginButton from "@/components/auth/login-button";
import SignOutButton from "@/components/auth/signout-button";
import ThemeToggle from "@/components/shared/theme-toggle";
import { createClient } from "@/utils/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <header className="mx-auto flex w-full items-center justify-between border-b p-4 sm:p-5">
      <Logo />
      <nav className="flex items-center gap-2 sm:gap-3">
        {session ? <SignOutButton /> : <LoginButton />}
        <ThemeToggle />
      </nav>
    </header>
  );
}
