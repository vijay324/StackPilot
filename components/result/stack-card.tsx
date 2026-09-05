import { Check, Minus } from "lucide-react";
import type { ScoredStack } from "@/lib/types";

export function ScalingTimeline({ stack }: { stack: ScoredStack["stack"] }) {
  const stages = [
    { id: "to10k", label: "0→10K", body: stack.scalingStory.to10k },
    { id: "to1m", label: "10K→1M", body: stack.scalingStory.to1m },
    { id: "to1b", label: "1M→1B", body: stack.scalingStory.to1b },
  ] as const;

  return (
    <section aria-labelledby="scaling-heading" className="mt-14">
      <h2
        id="scaling-heading"
        className="text-sm font-medium text-muted-foreground"
      >
        Scaling story
      </h2>
      <ol className="mt-5 grid gap-0 md:grid-cols-3">
        {stages.map((stage, index) => (
          <li
            key={stage.id}
            className="relative border-t border-border py-5 md:border-t-0 md:border-l md:px-5 md:py-0 first:md:border-l-0 first:md:pl-0"
          >
            <p className="font-mono text-xs text-primary">
              {String(index + 1).padStart(2, "0")} · {stage.label}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              {stage.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ComparisonList({ stack }: { stack: ScoredStack["stack"] }) {
  return (
    <section
      aria-labelledby="tradeoffs-heading"
      className="mt-14 grid gap-10 sm:grid-cols-2"
    >
      <div>
        <h2
          id="tradeoffs-heading"
          className="text-sm font-medium text-muted-foreground"
        >
          Pros
        </h2>
        <ul className="mt-4 space-y-3">
          {stack.pros.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed">
              <Check
                className="mt-0.5 size-4 shrink-0 text-success"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-sm font-medium text-muted-foreground">Cons</h2>
        <ul className="mt-4 space-y-3">
          {stack.cons.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed">
              <Minus
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function WhyList({ scored }: { scored: ScoredStack }) {
  return (
    <section aria-labelledby="why-heading" className="mt-14">
      <h2
        id="why-heading"
        className="text-sm font-medium text-muted-foreground"
      >
        Why this fits your answers
      </h2>
      <ul className="mt-4 space-y-3">
        {scored.reasons.map((reason) => (
          <li
            key={`${reason.dimension}-${reason.optionId}`}
            className="text-sm leading-relaxed"
          >
            <span className="font-mono text-xs text-primary">
              {reason.optionLabel}
            </span>
            <span className="mt-1 block text-foreground/90">
              {reason.detail}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
