import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <section className="grid min-h-screen w-full place-items-center p-4 text-center text-4xl font-extrabold tracking-tight sm:p-6 sm:text-5xl lg:p-0">
      <div className="flex w-full flex-row items-center justify-center space-x-2 py-6">
        <Loader2 className="text-primary size-8 animate-spin" />
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    </section>
  );
}
