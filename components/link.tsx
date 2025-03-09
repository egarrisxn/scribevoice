import Link from "next/link";

interface XLinkProps {
  href: string;
  text: string;
  className?: string;
}

export default function XLink({ href, text, className }: XLinkProps) {
  return (
    <Link
      href={href}
      className={`cursor-pointer font-medium transition-all duration-150 ease-in ${className}`}
    >
      {text}
    </Link>
  );
}
