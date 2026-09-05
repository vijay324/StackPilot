import Link from "next/link";
import { Wordmark } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader({
  action = "start",
}: {
  action?: "start" | "none";
}) {
  return (
    <header className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
      <Wordmark />
      <div className="flex items-center gap-1">
        <ThemeToggle />
        {action === "start" ? (
          <Button asChild size="sm">
            <Link href="/wizard">Start</Link>
          </Button>
        ) : null}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border px-5 py-6 text-sm text-muted-foreground sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>StackPilot · MIT License · No accounts, no tracking</p>
        <p>Open source. Fork the catalog, keep the engine honest.</p>
      </div>
    </footer>
  );
}
