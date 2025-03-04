import Link from "next/link";
import { Mic } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-0.5 sm:gap-1">
      <Mic className="size-5 sm:size-6" />
      <span className="inline-block leading-none font-bold tracking-tighter sm:pb-0.5 sm:text-2xl">
        ScribeVoice
      </span>
    </Link>
  );
}
