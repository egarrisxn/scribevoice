import type { Metadata } from "next";
import AuthNav from "@/components/auth/auth-nav";
import LoginCard from "@/components/auth/login-card";

export const metadata: Metadata = {
  title: "Login | ScribeVoice",
  description: "Login and get started with ScribeVoice.",
};

export default function Login() {
  return (
    <section className="from-foreground/5 via-background to-background grid min-h-screen w-full place-items-center bg-gradient-to-t p-4 sm:p-6 lg:p-0">
      <AuthNav />
      <LoginCard />
    </section>
  );
}
