import FunCard from "@/components/fun-card";
import GitHubAuth from "@/components/github-auth";
import GoogleAuth from "@/components/google-auth";

export default function LoginCard() {
  return (
    <FunCard className="w-full max-w-md space-y-2 p-4 sm:py-12">
      <div className="space-y-2 py-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Welcome back!</h1>
        <h2 className="text-sm text-muted-foreground">Log in to your account to continue.</h2>
      </div>
      <div className="flex flex-row items-center justify-center gap-3 px-6 pt-3 sm:gap-4">
        <GitHubAuth />
        <GoogleAuth />
      </div>
      <p className="flex items-center justify-center px-6 pt-4 text-center text-sm">
        &copy; {new Date().getFullYear()} ScribeVoice by{" "}
        <a
          href="https://egxo.dev"
          className="font-medium text-primary underline-offset-4 hover:text-blue-400 hover:underline"
        >
          egxo.dev
        </a>
      </p>
    </FunCard>
  );
}
