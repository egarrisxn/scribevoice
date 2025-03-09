import type { Metadata } from "next";
import DashboardCard from "@/components/main/dashboard-card";
import MainFooter from "@/components/footer";
import DashboardNav from "@/components/dashboard-nav";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "ScribeVerse Dashboard.",
};

export default function DashboardPage() {
  return (
    <section className="mx-auto flex size-full flex-col items-center justify-center px-2 sm:px-4 lg:px-0">
      <DashboardNav />
      <div className="mx-auto flex min-h-screen w-full flex-1 items-center justify-center pt-24 pb-8 sm:pt-32 xl:pb-20">
        <DashboardCard />
      </div>
      <MainFooter />
    </section>
  );
}
