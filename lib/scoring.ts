import { findOptionLabel, QUESTIONS, walkQuestionTree } from "./questions";
import { STACKS } from "./stacks";
import {
  type Affinity,
  type Answers,
  type MatchReason,
  PROFILE_DIMENSIONS,
  type ProfileDimension,
  type QuestionWalk,
  type RecommendationResult,
  type ScoredStack,
  type Stack,
  type UserProfile,
} from "./types";

/**
 * Dimension weights sum to 100. Each answer contributes
 * `weight * (stackAffinity / 3)` so a perfect match scores 100.
 *
 * Product is weighted highest so a great mobile BaaS cannot beat a
 * merely-good web stack for a web app. Scale, team, and budget follow —
 * they are the usual sources of "this will hurt in six months" mismatches.
 */
export const DIMENSION_WEIGHTS: Record<ProfileDimension, number> = {
  product: 28,
  scale: 16,
  teamExperience: 14,
  budget: 14,
  dataType: 12,
  realTime: 8,
  deploymentPreference: 8,
};

export const MAX_AFFINITY = 3;
export const REASON_AFFINITY_THRESHOLD: Affinity = 2;
export const TOP_N = 3;

const QUESTION_ID_BY_DIMENSION: Record<ProfileDimension, string> = {
  product: "product",
  scale: "scale",
  teamExperience: "team",
  budget: "budget",
  realTime: "realtime",
  dataType: "data",
  deploymentPreference: "deploy",
};

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

export function roundScore(score: number): number {
  return Math.round(score * 10) / 10;
}

export function resolveAnswers(answers: Answers): QuestionWalk {
  return walkQuestionTree(answers);
}

export function answersToProfile(answers: Answers): UserProfile {
  const { complete, resolved } = walkQuestionTree(answers);
  if (!complete) {
    const missing = QUESTIONS.filter((question) => !resolved[question.id]).map(
      (question) => question.id,
    );
    throw new IncompleteAnswersError(missing);
  }

  const profile = {} as UserProfile;
  for (const question of QUESTIONS) {
    const optionId = resolved[question.id];
    const option = question.options.find((item) => item.id === optionId);
    if (!option) {
      throw new Error(
        `Unknown option "${optionId}" for question "${question.id}"`,
      );
    }
    const { dimension, value } = option.mapsTo;
    (profile[dimension] as UserProfile[typeof dimension]) = value;
  }
  return profile;
}

export function scoreStack(stack: Stack, profile: UserProfile): ScoredStack {
  let score = 0;
  const reasons: MatchReason[] = [];

  for (const dimension of PROFILE_DIMENSIONS) {
    const choice = profile[dimension];
    const table = stack.profile[dimension] as Record<string, Affinity>;
    const affinity = (table[choice] ?? 0) as Affinity;
    score += DIMENSION_WEIGHTS[dimension] * (affinity / MAX_AFFINITY);

    if (affinity >= REASON_AFFINITY_THRESHOLD) {
      const questionId = QUESTION_ID_BY_DIMENSION[dimension];
      const optionId = String(choice);
      const optionLabel = findOptionLabel(questionId, optionId) ?? optionId;
      reasons.push({
        dimension,
        questionId,
        optionId,
        optionLabel,
        affinity,
        detail: reasonDetail(stack.name, affinity, optionLabel),
      });
    }
  }

  return {
    stack,
    score: roundScore(score),
    reasons,
  };
}

function reasonDetail(
  stackName: string,
  affinity: Affinity,
  optionLabel: string,
): string {
  if (affinity === 3) {
    return `${stackName} is a strong match for “${optionLabel}”.`;
  }
  return `${stackName} works well for “${optionLabel}”.`;
}

function compareScored(
  a: ScoredStack,
  b: ScoredStack,
  profile: UserProfile,
): number {
  if (b.score !== a.score) {
    return b.score - a.score;
  }
  const productDelta =
    b.stack.profile.product[profile.product] -
    a.stack.profile.product[profile.product];
  if (productDelta !== 0) {
    return productDelta;
  }
  return a.stack.name.localeCompare(b.stack.name);
}

/**
 * Rank stacks for a complete answer set.
 * Stacks with product affinity 0 are dropped from the top 3 when at least
 * three product-capable stacks exist, so a Kafka pipeline cannot place as
 * a "runner-up" for a web app.
 */
export function recommend(
  answers: Answers,
  catalog: Stack[] = STACKS,
): RecommendationResult {
  const walk = walkQuestionTree(answers);
  const profile = answersToProfile(answers);
  const ranked = catalog
    .map((stack) => scoreStack(stack, profile))
    .sort((a, b) => compareScored(a, b, profile));

  const eligible = ranked.filter(
    (item) => item.stack.profile.product[profile.product] > 0,
  );
  const pool = eligible.length >= TOP_N ? eligible : ranked;
  const top = pool.slice(0, TOP_N);

  if (!top[0]) {
    throw new Error("Stack catalog is empty");
  }

  return {
    winner: top[0],
    runnersUp: top.slice(1),
    ranked,
    profile,
    answers: walk.resolved,
  };
}

/** Compact, URL-safe encoding: `product:web,scale:startup,...` */
export function encodeAnswers(answers: Answers): string {
  const { resolved } = walkQuestionTree(answers);
  return QUESTIONS.filter((question) => resolved[question.id])
    .map((question) => `${question.id}:${resolved[question.id]}`)
    .join(",");
}

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
    answers[questionId] = optionId;
  }

  walkQuestionTree(answers);
  return answers;
}

export function weightTotal(): number {
  return PROFILE_DIMENSIONS.reduce(
    (sum, dimension) => sum + DIMENSION_WEIGHTS[dimension],
    0,
  );
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
