import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center sm:gap-0.5">
      <Image
        src="/icon.svg"
        height={40}
        width={40}
        alt="ScribeVoice Logo"
        className="size-6 rounded-full shadow-lg sm:size-10 dark:shadow-blue-500/50"
      />
      <span className="inline-block pb-0.5 text-2xl leading-none font-medium tracking-tighter sm:hidden">
        SV
      </span>
      <span className="hidden text-3xl leading-none font-bold tracking-tighter sm:inline-block sm:pl-0.5">
        ScribeVoice
      </span>
    </Link>
  );
}
