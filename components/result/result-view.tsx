"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Collapsible } from "radix-ui";
import { useState } from "react";
import {
  ComparisonList,
  ScalingTimeline,
  WhyList,
} from "@/components/result/stack-card";
import { Button } from "@/components/ui/button";
import type { RecommendationResult, ScoredStack } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ResultActions() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this result URL", url);
    }
  }

  return (
    <div className="mt-12 flex flex-col gap-3 sm:flex-row">
      <Button type="button" onClick={share} className="sm:min-w-40">
        {copied ? "Copied" : "Share result"}
      </Button>
      <Button asChild variant="outline">
        <Link href="/wizard">Start over</Link>
      </Button>
    </div>
  );
}

function RunnerUp({ item, rank }: { item: ScoredStack; rank: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 rounded-md border border-border bg-card px-4 py-3 text-left transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span>
          <span className="font-mono text-xs text-muted-foreground">
            Alternative {rank}
          </span>
          <span className="mt-1 block font-mono text-sm text-foreground">
            {item.stack.name}
          </span>
        </span>
        <span className="flex items-center gap-3 text-muted-foreground">
          <span className="font-mono text-xs">{item.score}</span>
          <ChevronDown
            className={cn(
              "size-4 motion-safe:transition-transform",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </span>
      </Collapsible.Trigger>
      <Collapsible.Content className="overflow-hidden data-[state=open]:animate-in">
        <div className="border-x border-b border-border px-4 py-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.stack.summary}
          </p>
          {item.reasons.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {item.reasons.slice(0, 4).map((reason) => (
                <li
                  key={`${reason.dimension}-${reason.optionId}`}
                  className="text-sm"
                >
                  {reason.detail}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export function ResultView({ result }: { result: RecommendationResult }) {
  const { winner, runnersUp } = result;

  return (
    <article>
      <p className="font-mono text-xs text-primary">Recommended stack</p>
      <h1 className="mt-3 font-mono text-2xl leading-snug tracking-tight text-balance sm:text-4xl">
        {winner.stack.name}
      </h1>
      <p className="mt-4 max-w-prose text-lg leading-relaxed text-muted-foreground">
        {winner.stack.summary}
      </p>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        Match score {winner.score} / 100
      </p>
      <ScalingTimeline stack={winner.stack} />
      <ComparisonList stack={winner.stack} />
      <WhyList scored={winner} />
      {runnersUp.length > 0 ? (
        <section aria-labelledby="runners-heading" className="mt-14">
          <h2
            id="runners-heading"
            className="text-sm font-medium text-muted-foreground"
          >
            Runner-up alternatives
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {runnersUp.map((item, index) => (
              <RunnerUp key={item.stack.id} item={item} rank={index + 1} />
            ))}
          </div>
        </section>
      ) : null}
      <ResultActions />
    </article>
  );
}
