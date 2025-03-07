export default function MainFooter() {
  return (
    <footer className="border-foreground/5 w-full border-t">
      <div className="text-muted-foreground container mx-auto flex flex-col items-center justify-center gap-4 py-8 text-center text-sm md:flex-row md:justify-between md:p-6">
        <p>
          &copy; {new Date().getFullYear()} ScribeVoice by{" "}
          <a
            href="https://egxo.dev"
            className="text-primary font-medium underline-offset-4 hover:text-blue-400 hover:underline"
          >
            egxo.dev
          </a>
        </p>
        <p>Powered by OpenAI</p>
      </div>
    </footer>
  );
}
