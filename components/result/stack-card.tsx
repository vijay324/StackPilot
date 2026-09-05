import { positiveReasons } from "@/lib/engine/score";
import type { AssembledStack, ChosenLayer, ScoredComponent } from "@/lib/types";
import { LAYER_LABELS } from "@/lib/types";

export function ScalingTimeline({
  story,
}: {
  story: AssembledStack["scaling"];
}) {
  const stages = [
    { id: "to10k", label: "0→10K", body: story.to10k },
    { id: "to1m", label: "10K→1M", body: story.to1m },
    { id: "to1b", label: "1M→1B", body: story.to1b },
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

export function LayerRow({
  item,
  technical,
}: {
  item: ChosenLayer;
  technical: boolean;
}) {
  const chosen = item.chosen.component;
  const reasons = positiveReasons(item.chosen, 3);

  return (
    <article className="border-t border-border py-6 first:border-t-0 first:pt-0">
      <p className="font-mono text-xs text-muted-foreground">
        {LAYER_LABELS[item.layer]}
      </p>
      <h3 className="mt-2 font-mono text-base text-foreground">
        {chosen.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {technical ? chosen.summary : chosen.plainSummary}
      </p>
      {reasons.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {reasons.map((reason) => (
            <li key={reason.reason} className="text-sm leading-relaxed">
              <span className="font-mono text-xs text-primary">
                Why it fits
              </span>
              <span className="mt-1 block text-foreground/90">
                {reason.reason}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {item.alternatives.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium text-muted-foreground">
            Layer alternatives
          </p>
          <ul className="mt-2 space-y-2">
            {item.alternatives.map((alt: ScoredComponent) => (
              <li key={alt.component.id} className="text-sm">
                <span className="font-mono text-xs">{alt.component.name}</span>
                <span className="mt-1 block text-muted-foreground">
                  {positiveReasons(alt, 1)[0]?.reason ??
                    (technical
                      ? alt.component.summary
                      : alt.component.plainSummary)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
