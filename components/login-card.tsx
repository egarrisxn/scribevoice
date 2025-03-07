import { cn } from "@/lib/utils";
import GitHubAuth from "@/components/github-auth";
import GoogleAuth from "@/components/google-auth";

export default function LoginCard() {
  const Border = ({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
      <div
        {...rest}
        className={cn("absolute size-6 border-zinc-700 dark:border-zinc-200", className)}
      />
    );
  };

  return (
    <div className="border-accent relative rounded-md border-2 bg-white dark:bg-zinc-900">
      <Border className="-top-0.5 -left-0.5 rounded-tl-md border-t-2 border-l-2" />
      <Border className="-top-0.5 -right-0.5 rounded-tr-md border-t-2 border-r-2" />
      <Border className="-bottom-0.5 -left-0.5 rounded-bl-md border-b-2 border-l-2" />
      <Border className="-right-0.5 -bottom-0.5 rounded-br-md border-r-2 border-b-2" />
      <div className="w-full max-w-md space-y-2 p-4 shadow-sm transition-all duration-300 hover:shadow-lg sm:py-12">
        <div className="space-y-2 py-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Welcome back!</h1>
          <h2 className="text-muted-foreground text-sm">Log in to your account to continue.</h2>
        </div>
        <div className="flex flex-row items-center justify-center gap-3 px-6 pt-3 sm:gap-4">
          <GitHubAuth />
          <GoogleAuth />
        </div>
        <p className="flex items-center justify-center px-6 pt-4 text-center text-sm">
          &copy; {new Date().getFullYear()} ScribeVoice by{" "}
          <a
            href="https://egxo.dev"
            className="text-primary font-medium underline-offset-4 hover:text-blue-400 hover:underline"
          >
            egxo.dev
          </a>
        </p>
      </div>
    </div>
  );
}
