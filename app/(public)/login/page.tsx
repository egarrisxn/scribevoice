import type { Metadata } from "next";
import FunCard from "@/components/fun-card";
import GitHubAuth from "@/components/github-auth";
import GoogleAuth from "@/components/google-auth";

export const metadata: Metadata = {
  title: "Login",
  description: "Login and get started with ScribeVoice.",
};

export default function Login() {
  return (
    <FunCard className="mx-auto max-w-lg space-y-2 p-4 sm:py-12">
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
          className="cursor-pointer pl-0.5 font-medium text-blue-500 transition-all duration-100 ease-in-out hover:text-blue-400 hover:underline hover:underline-offset-4"
        >
          egxo.dev
        </a>
      </p>
    </FunCard>
  );
}
