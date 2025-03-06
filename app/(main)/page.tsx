import Link from "next/link";
import MainNavbar from "@/components/shared/navbar";
import Hero from "@/components/landing/hero";
import CTA from "@/components/landing/cta";
import MainFooter from "@/components/shared/footer";

export default function Home() {
  return (
    <div className="mx-auto flex w-full flex-col">
      <MainNavbar />
      <Hero />
      <section className="grid w-full gap-5 px-4 pt-4 pb-16 text-center sm:px-6">
        <Link
          href="/login"
          className="hover:text-blue text-xl leading-none font-medium tracking-tighter underline-offset-2 hover:text-blue-500/90 hover:underline sm:text-3xl"
        >
          Login to begin!
        </Link>
      </section>
      <CTA />
      <MainFooter />
    </div>
  );
}
