import type { Metadata } from "next";
import MainFooter from "@/components/footer";
import DashboardCard from "@/components/main/dashboard-card";
import MainNavbar from "@/components/main-nav";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "ScribeVerse Dashboard.",
};

export default function Home() {
  return (
    <div className="grid min-h-[100dvh] w-full grid-rows-[auto_1fr_auto]">
      <MainNavbar />
      <DashboardCard />
      <MainFooter />
    </div>
  );
}
