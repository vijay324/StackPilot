import { composeStack, perspectiveAlternatives } from "@/lib/engine/compose";
import { buildProfile } from "@/lib/engine/profile";
import { walkQuestionTree } from "@/lib/questions";
import type { Answers, RecommendationResult } from "@/lib/types";

export class IncompleteAnswersError extends Error {
  readonly missingQuestionIds: string[];

  constructor(missingQuestionIds: string[]) {
    super(
      `Incomplete answers; missing: ${missingQuestionIds.join(", ") || "(unknown)"}`,
    );
    this.name = "IncompleteAnswersError";
    this.missingQuestionIds = missingQuestionIds;
  }
}

const LEGACY_MAP: Record<string, (value: string, answers: Answers) => void> = {
  product: (value, answers) => {
    const map: Record<string, string> = {
      web: "webapp",
      mobile: "mobile",
      api: "api",
      realtime: "realtime",
      pipeline: "analytics",
    };
    answers.product = map[value] ?? value;
  },
  scale: (value, answers) => {
    const map: Record<string, { year: string; ambition: string }> = {
      startup: { year: "1k-10k", ambition: "national" },
      growth: { year: "100k-1m", ambition: "national" },
      hyperscale: { year: "1m-plus", ambition: "billion" },
    };
    const mapped = map[value];
    if (mapped) {
      answers.scaleYear1 = mapped.year;
      answers.scaleAmbition = mapped.ambition;
    }
  },
  team: (value, answers) => {
    const map: Record<string, { team: string; role: string }> = {
      solo: { team: "solo-learning", role: "developer" },
      small: { team: "small", role: "lead" },
      experienced: { team: "large", role: "lead" },
    };
    const mapped = map[value];
    if (mapped) {
      answers.team = mapped.team;
      if (!answers.role) {
        answers.role = mapped.role;
      }
      return;
    }
    answers.team = value;
  },
  budget: (value, answers) => {
    const map: Record<string, string> = {
      free: "zero",
      low: "under-50",
      enterprise: "enterprise",
    };
    answers.budget = map[value] ?? value;
  },
  realtime: (value, answers) => {
    if (value === "yes" || value === "no") {
      answers.realtime = value === "yes" ? "live" : "none";
      return;
    }
    answers.realtime = value;
  },
  data: (value, answers) => {
    const map: Record<string, string> = {
      relational: "relational",
      document: "document",
      both: "relational",
      analytics: "timeseries",
    };
    answers.dataShape = map[value] ?? value;
  },
  deploy: (value, answers) => {
    const map: Record<string, string> = {
      serverless: "serverless",
      "self-hosted": "self-hosted",
      managed: "paas",
    };
    answers.deployPreference = map[value] ?? value;
  },
};

export function decodeAnswers(encoded: string): Answers {
  const answers: Answers = {};
  const trimmed = encoded.trim();
  if (!trimmed) {
    return answers;
  }

  for (const pair of trimmed.split(",")) {
    const separator = pair.indexOf(":");
    if (separator <= 0) {
      throw new Error(`Invalid answers token: "${pair}"`);
    }
    const questionId = pair.slice(0, separator);
    const optionId = pair.slice(separator + 1);
    if (!questionId || !optionId) {
      throw new Error(`Invalid answers token: "${pair}"`);
    }
    const migrate = LEGACY_MAP[questionId];
    if (migrate) {
      migrate(optionId, answers);
      continue;
    }
    answers[questionId] = optionId;
  }
  return answers;
}

export function encodeAnswers(answers: Answers): string {
  const { resolved } = walkQuestionTree(answers);
  return Object.entries(resolved)
    .filter(([, value]) => Boolean(value))
    .map(([id, value]) => `${id}:${value}`)
    .join(",");
}

export function parseAnswersParam(
  value: string | string[] | undefined,
): Answers | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) {
    return null;
  }
  try {
    return decodeAnswers(raw);
  } catch {
    return null;
  }
}

export function resultHref(answers: Answers): string {
  return `/result?a=${encodeURIComponent(encodeAnswers(answers))}`;
}

export function wizardHref(answers?: Answers): string {
  if (!answers || Object.keys(answers).length === 0) {
    return "/wizard";
  }
  return `/wizard?a=${encodeURIComponent(encodeAnswers(answers))}`;
}

export function recommend(answers: Answers): RecommendationResult {
  const walk = walkQuestionTree(answers);
  if (!walk.complete) {
    const missing = walk.visible
      .filter((question) => !walk.resolved[question.id])
      .map((question) => question.id);
    throw new IncompleteAnswersError(missing);
  }
  const profile = buildProfile(walk.resolved);
  const bestOverall = composeStack(profile);
  const alternatives = perspectiveAlternatives(profile, bestOverall);
  return {
    bestOverall,
    alternatives,
    layers: bestOverall.layers,
    profile,
    answers: walk.resolved,
  };
}

export function recommendFromEncoded(
  encoded: string | string[] | undefined,
): RecommendationResult | null {
  const answers = parseAnswersParam(encoded);
  if (!answers) {
    return null;
  }
  try {
    const walk = walkQuestionTree(answers);
    if (!walk.complete) {
      return null;
    }
    return recommend(answers);
  } catch {
    return null;
  }
}

export { composeStack, selectLayers } from "@/lib/engine/compose";
export { buildProfile, joinMulti, splitMulti } from "@/lib/engine/profile";
export { scoreComponent } from "@/lib/engine/score";
