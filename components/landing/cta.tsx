import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="grid w-full place-items-center gap-5 px-4 pt-12 pb-24 text-center sm:px-6 sm:pt-28 sm:pb-36">
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
