import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Page",
  description: "ScribeVerse test page.",
};

export default function TestPage() {
  return (
    <section className="mx-auto flex size-full flex-col items-center justify-center px-2 sm:px-4 lg:px-0">
      <h1>Test Page</h1>
    </section>
  );
}

// import type { Metadata } from "next";
// import TestDashboardNav from "@/components/test/test-dashboard-nav";
// import TestDashboardCard from "@/components/test/test-dashboard-card";
// import MainFooter from "@/components/footer";

// export const metadata: Metadata = {
//   title: "Test Page",
//   description: "ScribeVerse test page.",
// };

// export default function TestPage() {
//   return (
//     <section className="mx-auto flex size-full flex-col items-center justify-center px-2 sm:px-4 lg:px-0">
//       <TestDashboardNav />
//       <div className="mx-auto flex min-h-screen w-full flex-1 items-center justify-center pt-24 pb-8 sm:pt-32 xl:pb-20">
//         <TestDashboardCard />
//       </div>
//       <MainFooter />
//     </section>
//   );
// }
