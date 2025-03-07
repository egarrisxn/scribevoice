import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-screen w-full place-items-center p-4 sm:p-6 lg:p-0">
      <div className="flex flex-auto flex-col items-center justify-center px-4 text-center sm:flex-row">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:mr-5 sm:border-r sm:border-gray-900/10 sm:pr-5 sm:text-3xl dark:text-gray-200 sm:dark:border-gray-300/10">
          404
        </h1>
        <p className="mt-2 text-gray-700 sm:mt-0 dark:text-gray-400">Page not be found.</p>
        <Link
          href="/"
          className="cursor-pointer font-medium text-blue-500 underline-offset-4 hover:text-blue-400 hover:underline sm:pl-1.5"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
}
