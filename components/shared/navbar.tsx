import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/actions";
import Logo from "@/components/shared/logo";
import ThemeToggle from "@/components/shared/theme-toggle";

export default async function MainNavbar() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <header className="container mx-auto flex w-full items-center justify-between p-4 sm:p-5">
      <Logo />
      <nav className="text-primary flex items-center gap-3 text-sm font-medium sm:gap-4 sm:text-base">
        {session ? (
          <div className="flex flex-row items-center gap-3 sm:gap-4">
            <Link
              href="/dashboard"
              className="underline-offset-2 hover:text-blue-500/90 hover:underline"
            >
              Dashboard
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="cursor-pointer underline-offset-2 hover:text-blue-500/90 hover:underline"
              >
                Sign Out
              </button>
            </form>
          </div>
        ) : (
          <Link href="/login" className="underline-offset-2 hover:text-blue-500/90 hover:underline">
            Login
          </Link>
        )}
        <ThemeToggle />
      </nav>
    </header>
  );
}
