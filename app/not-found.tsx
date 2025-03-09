import Link from "next/link";
import PublicNav from "@/components/public-nav";

export default function NotFoundPage() {
  return (
    <section className="grid h-dvh w-full place-items-center px-4 sm:px-6 lg:px-0">
      <PublicNav />
      <div className="flex flex-auto flex-col items-center justify-center px-4 text-center sm:flex-row">
        <h1 className="text-primary text-2xl font-extrabold tracking-tight sm:mr-5 sm:border-r sm:border-gray-900/10 sm:pr-5 sm:text-3xl sm:dark:border-gray-300/10">
          404
        </h1>
        <p className="my-2 sm:my-0">Page not be found.</p>
        <Link
          href="/"
          className="cursor-pointer font-medium text-blue-500 transition-all duration-100 ease-in-out hover:text-blue-400 hover:underline hover:underline-offset-4 sm:pl-1.5"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
}
