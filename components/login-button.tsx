import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginButton() {
  return (
    <Button asChild variant="link">
      <Link href="/login">Login</Link>
    </Button>
  );
}
