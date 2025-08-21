import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function FunCard({ children, className }: CardProps) {
  const Border = ({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
      <div
        {...rest}
        className={cn("absolute size-6 border-zinc-700 dark:border-zinc-200", className)}
      />
    );
  };

  return (
    <div className="relative rounded-md border-2 border-accent bg-white dark:bg-zinc-900">
      <Border className="-top-0.5 -left-0.5 rounded-tl-md border-t-2 border-l-2" />
      <Border className="-top-0.5 -right-0.5 rounded-tr-md border-t-2 border-r-2" />
      <Border className="-bottom-0.5 -left-0.5 rounded-bl-md border-b-2 border-l-2" />
      <Border className="-right-0.5 -bottom-0.5 rounded-br-md border-r-2 border-b-2" />
      <div className={cn("shadow-sm transition-all duration-300 hover:shadow-lg", className)}>
        {children}
      </div>
    </div>
  );
}
