import GitHubIcon from "@/components/icons/github";

export default function Footer() {
  return (
    <footer className="border-foreground/5 container w-full border-t">
      <div className="text-muted-foreground mx-auto flex flex-col items-center justify-center gap-4 py-8 text-center text-sm md:flex-row md:justify-between md:p-6">
        <p className="flex items-center">
          &copy; {new Date().getFullYear()} ScribeVoice by{" "}
          <a
            href="https://egxo.dev"
            className="pl-0.5 text-blue-500 hover:text-blue-400 hover:underline hover:underline-offset-4"
          >
            egxo.dev
          </a>
        </p>
        <div className="flex flex-row items-center gap-3">
          <p className="order-2 flex md:order-1">Powered by OpenAI.</p>
          <a
            href="https://github.com/egarrisxn/xprod"
            className="hover:text-primary order-1 flex md:order-2"
          >
            <GitHubIcon className="size-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
