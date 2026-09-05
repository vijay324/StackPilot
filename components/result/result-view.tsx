"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Collapsible } from "radix-ui";
import { useMemo, useState } from "react";
import { LayerRow, ScalingTimeline } from "@/components/result/stack-card";
import { Button } from "@/components/ui/button";
import type { AssembledStack, RecommendationResult } from "@/lib/types";
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

function PerspectiveCard({
  item,
  technical,
}: {
  item: AssembledStack;
  technical: boolean;
}) {
  const [open, setOpen] = useState(false);
  const label =
    item.perspective === "low-ops"
      ? "Lowest operations"
      : item.perspective === "portable"
        ? "Most portable"
        : item.perspective === "scale"
          ? "Maximum scale headroom"
          : "Alternative";

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 rounded-md border border-border bg-card px-4 py-3 text-left transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span>
          <span className="font-mono text-xs text-muted-foreground">
            {label}
          </span>
          <span className="mt-1 block font-mono text-sm text-foreground">
            {item.title}
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
            {technical ? item.summary : item.plainSummary}
          </p>
          <ul className="mt-4 space-y-1 font-mono text-xs text-muted-foreground">
            {item.layers.slice(0, 8).map((layer) => (
              <li key={`${layer.layer}-${layer.chosen.component.id}`}>
                {layer.chosen.component.name}
              </li>
            ))}
          </ul>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export function ResultView({ result }: { result: RecommendationResult }) {
  const { bestOverall, alternatives, profile } = result;
  const [technical, setTechnical] = useState(profile.role !== "founder");

  const visibleLayers = useMemo(() => {
    if (technical) {
      return bestOverall.layers;
    }
    return bestOverall.layers.filter((item) => item.layer !== "observability");
  }, [bestOverall.layers, technical]);

  return (
    <article>
      <p className="font-mono text-xs text-primary">
        Best Overall Recommendation
      </p>
      <h1 className="mt-3 font-mono text-2xl leading-snug tracking-tight text-balance sm:text-4xl">
        {bestOverall.title}
      </h1>
      <p className="mt-4 max-w-prose text-lg leading-relaxed text-muted-foreground">
        {technical ? bestOverall.summary : bestOverall.plainSummary}
      </p>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        Match score {bestOverall.score} / 100
      </p>
      <div className="mt-6">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setTechnical((value) => !value)}
        >
          {technical ? "Show plain language" : "Show technical detail"}
        </Button>
      </div>
      <section aria-labelledby="layers-heading" className="mt-14">
        <h2
          id="layers-heading"
          className="text-sm font-medium text-muted-foreground"
        >
          Recommended layers
        </h2>
        <div className="mt-6">
          {visibleLayers.map((item) => (
            <LayerRow
              key={`${item.layer}-${item.chosen.component.id}`}
              item={item}
              technical={technical}
            />
          ))}
        </div>
      </section>
      <ScalingTimeline story={bestOverall.scaling} />
      {alternatives.length > 0 ? (
        <section aria-labelledby="alt-heading" className="mt-14">
          <h2
            id="alt-heading"
            className="text-sm font-medium text-muted-foreground"
          >
            Other ways to slice it
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {alternatives.map((item) => (
              <PerspectiveCard
                key={item.perspective ?? item.title}
                item={item}
                technical={technical}
              />
            ))}
          </div>
        </section>
      ) : null}
      <ResultActions />
    </article>
  );
}
