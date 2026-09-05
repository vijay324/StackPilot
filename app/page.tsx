/*
THESIS: The questionnaire is the product. Refuse a SaaS hero with a fake dashboard.
OWN-WORLD: Near-black field, 1px #26262A rules, Geist, electric blue only on live controls.
STORY: Seven answers in, a deterministic engine names a stack that has a 0→1B story.
FIRST VIEWPORT: Wordmark top-left; pledge left; Question 1 as the right-hand control. Choosing an option is Start.
FORM: Brief-pinned Linear / Vercel / Polar canon. Seed skipped — palette, type, and references were locked in the spec.
*/
import type { Metadata } from "next";
import Link from "next/link";
import { HeroQuestion } from "@/components/landing/hero-question";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { STACKS } from "@/lib/stacks";

export const metadata: Metadata = {
  title: "StackPilot — Pick your stack. Scale with confidence.",
  description:
    "Answer a short questionnaire and get a deterministic tech-stack recommendation with a scaling story from zero users to a billion.",
  keywords: [
    "tech stack",
    "architecture",
    "Next.js",
    "questionnaire",
    "open source",
  ],
  openGraph: {
    title: "StackPilot — Pick your stack. Scale with confidence.",
    description:
      "A rules engine, not a chatbot. 19 real-world stacks. Same answers, same recommendation.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackPilot",
    description: "Pick your stack. Scale with confidence.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "StackPilot",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Guided questionnaire that recommends a scalable tech stack using a deterministic rules engine.",
};

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD for search engines
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        href="#question"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to questionnaire
      </a>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
          <div className="mx-auto grid max-w-5xl gap-16 lg:grid-cols-2 lg:items-start lg:gap-20">
            <div>
              <p className="font-mono text-xs text-primary">
                {STACKS.length} stacks · rules engine · no account
              </p>
              <h1 className="mt-5 text-[clamp(2.5rem,8vw,4.5rem)] font-medium tracking-tight text-balance leading-[1.05]">
                Pick your stack.
                <span className="mt-1 block text-muted-foreground">
                  Scale with confidence.
                </span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                Seven questions about what you are building. A scored catalog of
                real-world stacks. A recommendation you can share — and a path
                from the first user to a billion.
              </p>
              <p className="mt-8 text-sm text-muted-foreground">
                Or skip the preview and{" "}
                <Link
                  href="/wizard"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  start on a blank questionnaire
                </Link>
                .
              </p>
            </div>
            <div id="question">
              <HeroQuestion />
            </div>
          </div>
        </section>

        <section
          aria-labelledby="how-heading"
          className="border-b border-border px-5 py-20 sm:px-8"
        >
          <div className="mx-auto max-w-5xl">
            <h2
              id="how-heading"
              className="text-sm font-medium text-muted-foreground"
            >
              How it works
            </h2>
            <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
              <li className="md:pr-6">
                <p className="font-mono text-xs text-primary">01</p>
                <p className="mt-3 text-lg font-medium tracking-tight">
                  Answer the brief
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Product type, year-one scale, team, budget, realtime, data
                  shape, deploy preference. One screen each. Back is always
                  there.
                </p>
              </li>
              <li className="md:border-l md:border-border md:px-6">
                <p className="font-mono text-xs text-primary">02</p>
                <p className="mt-3 text-lg font-medium tracking-tight">
                  Score the catalog
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Each answer adds weight toward matching tags. Highest score
                  wins. The function is pure TypeScript, covered by tests.
                </p>
              </li>
              <li className="md:border-l md:border-border md:pl-6">
                <p className="font-mono text-xs text-primary">03</p>
                <p className="mt-3 text-lg font-medium tracking-tight">
                  Leave with a path
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Top stack, two runners-up, and what actually changes at 10K,
                  1M, and 1B users. The URL is the share button.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section
          aria-labelledby="engine-heading"
          className="border-b border-border px-5 py-20 sm:px-8"
        >
          <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-2 lg:gap-16">
            <div>
              <h2
                id="engine-heading"
                className="text-3xl font-medium tracking-tight text-balance"
              >
                Same answers. Same stack. Forever.
              </h2>
              <p className="mt-4 max-w-prose text-muted-foreground leading-relaxed">
                StackPilot does not ask a model to improvise architecture. It
                scores affinities you can read, change, and test. Fork the JSON.
                Add a stack. The engine does not care.
              </p>
            </div>
            <pre className="mt-10 overflow-x-auto rounded-md border border-border bg-card p-5 font-mono text-xs leading-relaxed text-muted-foreground lg:mt-0">
              {`score += weight(dimension)
       * affinity(stack, answer) / 3

// perfect match = 100
// product mismatch is dropped from the top 3`}
            </pre>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-medium tracking-tight">
              Ready when you are.
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Two minutes. No email. A URL you can paste in Slack.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/wizard">Start the questionnaire</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
