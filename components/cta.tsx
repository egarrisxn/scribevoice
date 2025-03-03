import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="from-foreground/5 dark:from-foreground/10 via-background to-background grid w-full place-content-center place-items-center gap-5 bg-gradient-to-t pt-12 pb-24 text-center sm:py-28">
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
  );
}
