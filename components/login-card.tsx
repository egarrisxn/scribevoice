import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import GitHubAuth from "@/components/github-auth";
import GoogleAuth from "@/components/google-auth";

export default function LoginCard() {
  return (
    <Card className="from-background via-background to-accent/40 w-full max-w-md space-y-2 bg-gradient-to-t shadow-lg sm:py-12 dark:border-2 dark:shadow-blue-500/20">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-4xl font-bold tracking-tight">Welcome back!</CardTitle>
        <CardDescription>Log in to your account to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-center gap-3 pt-3 sm:gap-4">
          <GitHubAuth />
          <GoogleAuth />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center pt-4 text-center text-sm">
        <span>
          &copy; {new Date().getFullYear()} ScribeVoice by{" "}
          <a
            href="https://egxo.dev"
            className="font-medium text-blue-500 underline-offset-2 hover:text-blue-500/90 hover:underline"
          >
            egxo.dev
          </a>
        </span>
      </CardFooter>
    </Card>
  );
}
