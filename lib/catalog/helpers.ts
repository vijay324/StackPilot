import type {
  Component,
  Condition,
  FitRule,
  RuleScore,
  ScalingStory,
} from "@/lib/types";

export const LAST_REVIEWED = "2026-09-05";

export function rule(
  when: Condition,
  score: RuleScore,
  reason: string,
): FitRule {
  return { when, score, reason };
}

export function scaling(
  to10k: string,
  to1m: string,
  to1b: string,
): ScalingStory {
  return { to10k, to1m, to1b };
}

export function meta(
  hiringPool: 1 | 2 | 3,
  maturity: 1 | 2 | 3,
  openSource: boolean,
  sources: string[],
): Component["meta"] {
  return {
    hiringPool,
    maturity,
    openSource,
    lastReviewed: LAST_REVIEWED,
    sources,
  };
}

export const webProduct: Condition = {
  field: "product",
  anyOf: [
    "website",
    "webapp",
    "web-mobile",
    "realtime",
    "store",
    "internal",
    "ai",
  ],
};

export const tinyTeam: Condition = {
  field: "team",
  anyOf: ["solo-learning", "solo-experienced", "agency"],
};

export const experiencedTeam: Condition = {
  field: "team",
  anyOf: ["large", "solo-experienced"],
};

export const lowOps: Condition = {
  field: "ops",
  anyOf: ["none"],
};

export const dedicatedOps: Condition = {
  field: "ops",
  is: "dedicated",
};

export const freeBudget: Condition = {
  field: "budget",
  anyOf: ["zero", "under-50"],
};

export const enterpriseBudget: Condition = {
  field: "budget",
  is: "enterprise",
};

export const tsLang: Condition = {
  field: "languages",
  includes: "typescript",
};

export const hipaa: Condition = {
  field: "compliance",
  includes: "hipaa",
};

export const brochureNoAuth: Condition = {
  all: [
    { field: "product", is: "website" },
    { field: "auth", is: "none" },
  ],
};
