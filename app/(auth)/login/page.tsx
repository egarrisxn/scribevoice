import type { Metadata } from "next";
import AuthNav from "@/components/auth-nav";
import LoginCard from "@/components/login-card";

export const metadata: Metadata = {
  title: "Login | ScribeVoice",
  description: "Login and get started with ScribeVoice.",
};

export default function Login() {
  return (
    <section className="grid min-h-screen w-full place-items-center p-4 sm:p-6 lg:p-0">
      <AuthNav />
      <LoginCard />
    </section>
  );
}
