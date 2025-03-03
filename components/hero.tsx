import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <section className="from-foreground/10 via-background to-background grid w-full place-content-center place-items-center gap-5 bg-gradient-to-br py-24 text-center sm:pt-44 sm:pb-36">
      <Badge variant="fun">Use Your Voice!</Badge>
      <h1 className="text-[4rem] leading-none font-bold tracking-tight sm:text-[6.5rem]">
        ScribeVoice
      </h1>
      <p className="text-muted-foreground max-w-sm text-lg sm:mt-1.5 sm:max-w-lg sm:text-2xl">
        Transform your voice into notes, transcripts, lists and more with the power of AI!
      </p>
    </section>
  );
}
