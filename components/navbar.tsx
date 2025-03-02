import { Mic } from "lucide-react";
import ThemeToggle from "./theme-toggle";

export default function Navbar() {
  return (
    <header className="shadow-foreground/10 w-full border-b shadow-[1px_2px_8px_0px]">
      <nav className="mx-auto flex flex-row items-center justify-between p-4 sm:p-6">
        <section className="flex items-center gap-0.5 sm:gap-1">
          <Mic className="size-5 sm:size-7" />
          <span className="inline-block text-sm font-bold sm:text-base">ScribeVoice</span>
        </section>
        <section className="flex items-center">
          <ThemeToggle />
        </section>
      </nav>
    </header>
  );
}
