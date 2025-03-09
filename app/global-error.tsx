"use client";

import { useEffect } from "react";
import PublicNav from "@/components/public-nav";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <PublicNav />
        <section className="grid h-dvh w-full place-items-center px-4 sm:px-6 lg:px-0">
          <div className="flex flex-auto flex-col items-center justify-center px-4 text-center sm:flex-row">
            <h1 className="text-primary text-2xl font-extrabold tracking-tight sm:mr-5 sm:border-r sm:border-gray-900/10 sm:pr-5 sm:text-3xl sm:dark:border-gray-300/10">
              Error
            </h1>
            <p className="my-2 sm:my-0">There seems to be a problem.</p>
            <button
              onClick={() => reset()}
              className="cursor-pointer font-medium text-blue-500 transition-all duration-100 ease-in-out hover:text-blue-400 hover:underline hover:underline-offset-4 sm:pl-1.5"
            >
              Try Again
            </button>
          </div>
        </section>
      </body>
    </html>
  );
}
