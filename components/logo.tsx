import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex flex-row items-center gap-0.5">
      <Image
        src="/svgs/logo.svg"
        height={40}
        width={40}
        alt="ScribeVoice Logo"
        className="size-8 sm:size-10"
      />
      <span className="hidden text-3xl leading-none font-bold tracking-tighter sm:inline-block sm:pl-0.5">
        ScribeVoice
      </span>
    </Link>
  );
}
