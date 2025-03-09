import Link from "next/link";
import { ChevronLeftCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";

export default function PublicNav() {
  return (
    <header className="absolute top-0 z-10 w-full">
      <div className="container mx-auto flex items-center justify-between p-4 lg:p-6">
        <Button variant="outline" asChild>
          <Link href="/">
            <ChevronLeftCircle className="mr-2 size-4" />
            Back
          </Link>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
