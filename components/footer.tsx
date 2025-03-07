import GitHubIcon from "@/components/icons/github";

export default function MainFooter() {
  return (
    <footer className="border-foreground/5 w-full border-t">
      <div className="text-muted-foreground container mx-auto flex flex-col items-center justify-center gap-4 py-8 text-center text-sm md:flex-row md:justify-between md:p-6">
        <div className="flex items-center">
          <p>
            &copy; {new Date().getFullYear()} ScribeVoice by{" "}
            <a
              href="https://egxo.dev"
              className="text-primary font-medium underline-offset-4 hover:text-blue-400 hover:underline"
            >
              egxo.dev
            </a>
          </p>
        </div>
        <div className="flex flex-row items-center gap-3">
          <p className="order-2 flex md:order-1">Powered by OpenAI.</p>
          <a
            href="https://github.com/egarrisxn/xprod"
            className="order-1 flex duration-200 hover:text-black md:order-2 dark:hover:text-white"
          >
            <GitHubIcon className="size-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
