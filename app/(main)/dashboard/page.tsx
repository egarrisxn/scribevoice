import type { Metadata } from "next";
import MainFooter from "@/components/shared/footer";
import Dashboard from "@/components/dashboard";
import MainNavbar from "@/components/shared/navbar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "ScribeVerse Dashboard.",
};

export default function Home() {
  return (
    <div className="mx-auto flex w-full flex-col">
      <MainNavbar />
      <Dashboard />
      <MainFooter />
    </div>
  );
}
