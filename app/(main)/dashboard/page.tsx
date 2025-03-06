import type { Metadata } from "next";
import Dashboard from "@/components/dashboard";
import Footer from "@/components/shared/footer";

import Navbar from "@/components/shared/navbar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "ScribeVerse Dashboard.",
};

export default function Home() {
  return (
    <div className="mx-auto flex w-full flex-col">
      <Navbar />
      <Dashboard />
      <Footer />
    </div>
  );
}
