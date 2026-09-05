import { conditionTrue } from "@/lib/engine/profile";
import type {
  Component,
  FiredReason,
  Profile,
  ScoredComponent,
} from "@/lib/types";

export type Perspective = "default" | "low-ops" | "portable" | "scale";

export function maxPositiveScore(component: Component): number {
  return component.rules.reduce((sum, item) => {
    if (typeof item.score === "number" && item.score > 0) {
      return sum + item.score;
    }
    return sum;
  }, 0);
}

export function perspectiveAdjust(
  component: Component,
  perspective: Perspective,
): number {
  const tags = component.tags ?? [];
  if (perspective === "low-ops") {
    let delta = 0;
    if (tags.includes("low-ops")) {
      delta += 4;
    }
    if (tags.includes("high-ops")) {
      delta -= 5;
    }
    if (tags.includes("kubernetes")) {
      delta -= 4;
    }
    return delta;
  }
  if (perspective === "portable") {
    let delta = component.meta.openSource ? 3 : -2;
    if (tags.includes("lock-in")) {
      delta -= 3;
    }
    return delta;
  }
  if (perspective === "scale") {
    let delta = 0;
    if (tags.includes("hyperscale")) {
      delta += 4;
    }
    if (tags.includes("hobby")) {
      delta -= 4;
    }
    if (tags.includes("baas")) {
      delta -= 1;
    }
    return delta;
  }
  return 0;
}

export function scoreComponent(
  component: Component,
  profile: Profile,
  perspective: Perspective = "default",
): ScoredComponent {
  const reasons: FiredReason[] = [];
  let excluded = false;
  let raw = 0;

  for (const item of component.rules) {
    if (!conditionTrue(item.when, {}, profile)) {
      continue;
    }
    reasons.push({ reason: item.reason, score: item.score });
    if (item.score === "exclude") {
      excluded = true;
      continue;
    }
    raw += item.score;
  }

  raw += perspectiveAdjust(component, perspective);

  const max = maxPositiveScore(component) || 1;
  const normalized = excluded
    ? 0
    : Math.max(0, Math.min(100, Math.round((raw / max) * 1000) / 10));

  return {
    component,
    excluded,
    rawScore: raw,
    normalized,
    reasons,
  };
}

export function compareScored(a: ScoredComponent, b: ScoredComponent): number {
  if (a.excluded !== b.excluded) {
    return a.excluded ? 1 : -1;
  }
  if (b.rawScore !== a.rawScore) {
    return b.rawScore - a.rawScore;
  }
  if (b.normalized !== a.normalized) {
    return b.normalized - a.normalized;
  }
  if (b.component.meta.hiringPool !== a.component.meta.hiringPool) {
    return b.component.meta.hiringPool - a.component.meta.hiringPool;
  }
  if (b.component.meta.maturity !== a.component.meta.maturity) {
    return b.component.meta.maturity - a.component.meta.maturity;
  }
  return a.component.name.localeCompare(b.component.name);
}

export function positiveReasons(
  scored: ScoredComponent,
  limit = 3,
): FiredReason[] {
  return scored.reasons
    .filter((item) => item.score !== "exclude" && item.score > 0)
    .slice(0, limit);
}
