import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-16">
        <p className="font-mono text-xs text-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight">
          This page is not in the catalog
        </h1>
        <p className="mt-4 text-muted-foreground">
          The route does not exist. The questionnaire still does.
        </p>
        <Button asChild className="mt-8 w-fit">
          <Link href="/">Back to StackPilot</Link>
        </Button>
      </main>
      <SiteFooter />
    </div>
  );
}
