import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <section className="grid h-dvh w-full place-items-center px-4 text-3xl font-extrabold tracking-tight sm:px-6 lg:px-0">
      <div className="flex w-full flex-row items-center justify-center space-x-2">
        <Loader2 className="text-primary size-6 animate-spin sm:size-8" />
        <span className="text-xl font-semibold sm:text-2xl">Loading...</span>
      </div>
    </section>
  );
}
