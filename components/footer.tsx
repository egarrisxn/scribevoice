export default function Footer() {
  return (
    <footer className="border-foreground/5 w-full border-t">
      <div className="text-muted-foreground container mx-auto flex flex-col items-center justify-center gap-4 py-8 text-center text-sm md:flex-row md:justify-between md:p-6">
        <p>&copy; {new Date().getFullYear()} ScribeVoice. All rights reserved.</p>
        <p>Powered by OpenAI</p>
      </div>
    </footer>
  );
}
