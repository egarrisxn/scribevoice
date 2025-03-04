import { Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import MainContent from "@/components/main-content";

export default function Home() {
  return (
    <main className="grid min-h-[100dvh] max-w-screen overflow-x-hidden">
      <header className="shadow-foreground/10 w-full border-b shadow-[1px_2px_8px_0px]">
        <nav className="mx-auto flex flex-row items-center justify-between p-4 sm:p-6">
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Mic className="size-5 sm:size-6" />
            <span className="inline-block leading-none font-bold tracking-tighter sm:pb-0.5 sm:text-2xl">
              ScribeVoice
            </span>
          </div>
          <ThemeToggle />
        </nav>
      </header>
      <section className="from-foreground/10 via-background to-background grid w-full place-content-center place-items-center gap-5 bg-gradient-to-br py-24 text-center sm:pt-44 sm:pb-36">
        <Badge variant="fun">Use Your Voice!</Badge>
        <h1 className="text-[4rem] leading-none font-bold tracking-tighter sm:text-[6.5rem]">
          ScribeVoice
        </h1>
        <p className="text-muted-foreground max-w-sm text-lg sm:mt-1.5 sm:max-w-lg sm:text-2xl">
          Transform your voice into notes, transcripts, lists and more with the power of AI!
        </p>
      </section>
      <section className="w-full">
        <MainContent />
      </section>
      <section className="from-foreground/5 dark:from-foreground/10 via-background to-background grid w-full place-content-center place-items-center gap-5 bg-gradient-to-t pt-12 pb-24 text-center sm:pt-28 sm:pb-36">
        <h2 className="text-3xl font-extrabold md:text-4xl">Completely Open Source</h2>
        <p className="text-muted-foreground max-w-sm text-sm sm:max-w-lg">
          The code for this project is completely open source and available on GitHub. Join the
          community and contribute to the future of web development!
        </p>
        <Button asChild>
          <a href="https://github.com/egarrisxn/scribevoice" target="_blank">
            View on GitHub
          </a>
        </Button>
      </section>
      <footer className="border-foreground/5 w-full border-t">
        <div className="text-muted-foreground container mx-auto flex flex-col items-center justify-center gap-4 py-8 text-center text-sm md:flex-row md:justify-between md:p-6">
          <p>
            &copy; {new Date().getFullYear()} ScribeVoice by{" "}
            <a
              href="https://egxo.dev"
              className="font-medium text-blue-500 underline-offset-2 hover:text-blue-500/90 hover:underline"
            >
              egxo.dev
            </a>
          </p>
          <p>Powered by OpenAI</p>
        </div>
      </footer>
    </main>
  );
}
