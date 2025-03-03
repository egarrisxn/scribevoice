"use client";

import { useEffect } from "react";

export default function Error({
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
    <section className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
      <div className="flex flex-auto flex-col items-center justify-center px-4 text-center sm:flex-row">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:mr-6 sm:border-r sm:border-gray-900/10 sm:pr-6 sm:text-3xl dark:text-gray-200 sm:dark:border-gray-300/10">
          Error
        </h1>
        <h2 className="mt-2 text-gray-700 sm:mt-0 dark:text-gray-400">
          There seems to be a problem. {""}
          <button onClick={() => reset()} className="text-blue-500 underline underline-offset-2">
            Try Again
          </button>
          .
        </h2>
      </div>
    </section>
  );
}
