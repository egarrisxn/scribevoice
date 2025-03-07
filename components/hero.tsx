import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center gap-3 px-6 text-center">
      <Badge variant="fun">Use Your Voice!</Badge>
      <h1 className="text-[3.75rem] leading-none font-bold tracking-tighter sm:text-[6.5rem]">
        ScribeVoice
      </h1>
      <p className="text-muted-foreground max-w-[22rem] text-lg sm:mt-1 sm:mb-4 sm:max-w-lg sm:text-2xl">
        Transform your voice into notes, transcripts, lists and more with the power of AI!
      </p>
      <Link
        href="/login"
        className="hover:text-blue text-xl leading-none tracking-tighter underline-offset-4 hover:text-blue-400 hover:underline sm:text-3xl"
      >
        Login to begin!
      </Link>
    </section>
  );
}
