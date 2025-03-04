export default function Footer() {
  return (
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
  );
}
