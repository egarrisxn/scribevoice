import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/logo";
import SignOutButton from "@/components/signout-button";
import ThemeToggle from "@/components/theme-toggle";
import Footer from "@/components/footer";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <section className="mx-auto flex size-full flex-col items-center justify-center px-2 sm:px-4 lg:px-0">
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
      <div className="mx-auto flex min-h-screen flex-1 items-center justify-center pb-24 xl:pb-20">
        <div className="flex flex-col items-center justify-center gap-3 px-6 text-center">
          <Badge variant="fun">Use Your Voice!</Badge>
          <h1 className="text-[3.75rem] leading-none font-bold tracking-tighter sm:text-[6.5rem]">
            ScribeVoice
          </h1>
          <p className="max-w-[22rem] text-lg text-muted-foreground sm:mt-1 sm:mb-4 sm:max-w-lg sm:text-2xl">
            Transform your voice into notes, transcripts, lists and more with
            the power of AI!
          </p>
          {session ? (
            <Link
              href="/dashboard"
              className="text-xl leading-none tracking-tighter transition-all duration-150 ease-in-out hover:text-blue-400 hover:underline hover:underline-offset-4 sm:text-3xl"
            >
              Visit Your Dashboard!
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-xl leading-none tracking-tighter transition-all duration-150 ease-in-out hover:text-blue-400 hover:underline hover:underline-offset-4 sm:text-3xl"
            >
              Login to Get Started!
            </Link>
          )}
        </div>
      </div>
      <Footer />
    </section>
  );
}
