import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";
import Logo from "@/components/logo";
import ThemeToggle from "@/components/theme-toggle";

export default async function MainNav() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <header className="container mx-auto flex w-full items-center justify-between p-4 sm:p-5">
      <Logo />
      <nav className="text-primary flex items-center gap-4 text-sm font-medium sm:gap-5 sm:text-base">
        {session ? (
          <div className="flex flex-row items-center gap-4 sm:gap-5">
            <Link
              href="/dashboard"
              className="underline-offset-2 hover:text-blue-400 hover:underline"
            >
              Dashboard
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="cursor-pointer underline-offset-4 hover:text-blue-400 hover:underline"
              >
                Sign Out
              </button>
            </form>
          </div>
        ) : (
          <Link href="/login" className="underline-offset-4 hover:text-blue-400 hover:underline">
            Login
          </Link>
        )}
        <ThemeToggle />
      </nav>
    </header>
  );
}
