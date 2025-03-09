import PublicNav from "@/components/public-nav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh w-full place-items-center px-4 sm:px-6 lg:px-0">
      <PublicNav />
      {children}
    </div>
  );
}
