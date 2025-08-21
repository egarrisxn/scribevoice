import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <section className="flex flex-auto flex-col items-center justify-center px-4 text-center sm:flex-row">
      <h1 className="text-2xl font-extrabold tracking-tight text-primary sm:mr-5 sm:border-r sm:border-gray-900/10 sm:pr-5 sm:text-3xl sm:dark:border-gray-300/10">
        Error
      </h1>
      <p className="my-2 sm:my-0">There seems to be a problem.</p>
      <Link
        href="/"
        className="cursor-pointer font-medium text-blue-500 transition-all duration-100 ease-in-out hover:text-blue-400 hover:underline hover:underline-offset-4 sm:pl-1.5"
      >
        Return Home
      </Link>
    </section>
  );
}
