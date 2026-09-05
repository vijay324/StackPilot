import type { Metadata } from "next";
import Link from "next/link";
import { ResultView } from "@/components/result/result-view";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { recommendFromEncoded } from "@/lib/engine";

type ResultProps = {
  searchParams: Promise<{ a?: string | string[] }>;
};

export async function generateMetadata({
  searchParams,
}: ResultProps): Promise<Metadata> {
  const params = await searchParams;
  const result = recommendFromEncoded(params.a);
  if (!result) {
    return {
      title: "Your stack",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: result.bestOverall.title,
    description: result.bestOverall.plainSummary,
    robots: { index: false, follow: false },
  };
}

export default async function ResultPage({ searchParams }: ResultProps) {
  const params = await searchParams;
  const result = recommendFromEncoded(params.a);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader action="none" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
        {result ? (
          <ResultView result={result} />
        ) : (
          <div>
            <h1 className="text-3xl font-medium tracking-tight">
              No answers on this URL
            </h1>
            <p className="mt-4 max-w-prose text-muted-foreground leading-relaxed">
              Results are encoded in the query string so they can be shared
              without an account. This link is missing that payload, or it is
              malformed.
            </p>
            <Button asChild className="mt-8">
              <Link href="/wizard">Start the questionnaire</Link>
            </Button>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
