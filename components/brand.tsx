import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 text-[15px] font-medium tracking-tight text-foreground rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-5 place-items-center rounded-[4px] border border-border bg-card"
      >
        <span className="block size-1.5 rounded-full bg-primary" />
      </span>
      StackPilot
    </Link>
  );
}
