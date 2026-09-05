import type {
  Answers,
  Condition,
  Profile,
  Question,
  Ternary,
} from "@/lib/types";

export const MULTI_QUESTION_IDS = new Set([
  "languages",
  "platforms",
  "compliance",
  "existingCloud",
  "integrations",
  "observability",
]);

export function splitMulti(value: string | undefined): string[] {
  if (!value) {
    return [];
  }
  return value.split("+").filter(Boolean);
}

export function joinMulti(ids: string[]): string {
  return [...new Set(ids)].join("+");
}

export function parseSelected(questionId: string, answers: Answers): string[] {
  const raw = answers[questionId];
  if (!raw) {
    return [];
  }
  if (MULTI_QUESTION_IDS.has(questionId) || raw.includes("+")) {
    return splitMulti(raw);
  }
  return [raw];
}

function fieldValue(
  profile: Profile | undefined,
  field: string,
): string | string[] | undefined {
  if (!profile) {
    return undefined;
  }
  return (profile as unknown as Record<string, string | string[]>)[field];
}

function matchesList(selected: string[], anyOf: string[]): boolean {
  return anyOf.some((id) => selected.includes(id));
}

export function andTernary(a: Ternary, b: Ternary): Ternary {
  if (a === false || b === false) {
    return false;
  }
  if (a === "unknown" || b === "unknown") {
    return "unknown";
  }
  return true;
}

export function orTernary(a: Ternary, b: Ternary): Ternary {
  if (a === true || b === true) {
    return true;
  }
  if (a === "unknown" || b === "unknown") {
    return "unknown";
  }
  return false;
}

export function notTernary(value: Ternary): Ternary {
  if (value === "unknown") {
    return "unknown";
  }
  return !value;
}

function evalQuestionClause(
  questionId: string,
  anyOf: string[],
  answers: Answers,
  profile: Profile | undefined,
  getQuestion?: (id: string) => Question | undefined,
): Ternary {
  const selected = parseSelected(questionId, answers);
  if (selected.length === 0) {
    const target = getQuestion?.(questionId);
    if (target?.showWhen) {
      const visibility = evaluateCondition(
        target.showWhen,
        answers,
        profile,
        getQuestion,
      );
      if (visibility === false) {
        return false;
      }
    }
    return "unknown";
  }
  return matchesList(selected, anyOf);
}

function evalFieldClause(
  clause: Extract<Condition, { field: string }>,
  profile: Profile | undefined,
): Ternary {
  const value = fieldValue(profile, clause.field);
  if (value === undefined) {
    return "unknown";
  }
  const list = Array.isArray(value) ? value : [value];
  if (list.length === 0) {
    if (clause.noneOf) {
      return true;
    }
    return false;
  }
  if (clause.is !== undefined) {
    return list.length === 1 ? list[0] === clause.is : list.includes(clause.is);
  }
  if (clause.includes !== undefined) {
    return list.includes(clause.includes);
  }
  if (clause.anyOf) {
    return matchesList(list, clause.anyOf);
  }
  if (clause.noneOf) {
    return !matchesList(list, clause.noneOf);
  }
  return true;
}

export function evaluateCondition(
  condition: Condition | undefined,
  answers: Answers,
  profile?: Profile,
  getQuestion?: (id: string) => Question | undefined,
): Ternary {
  if (!condition) {
    return true;
  }
  if ("all" in condition) {
    return condition.all.reduce<Ternary>(
      (acc, item) =>
        andTernary(acc, evaluateCondition(item, answers, profile, getQuestion)),
      true,
    );
  }
  if ("any" in condition) {
    return condition.any.reduce<Ternary>(
      (acc, item) =>
        orTernary(acc, evaluateCondition(item, answers, profile, getQuestion)),
      false,
    );
  }
  if ("not" in condition) {
    return notTernary(
      evaluateCondition(condition.not, answers, profile, getQuestion),
    );
  }
  if ("questionId" in condition) {
    return evalQuestionClause(
      condition.questionId,
      condition.anyOf,
      answers,
      profile,
      getQuestion,
    );
  }
  return evalFieldClause(condition, profile);
}

export function conditionTrue(
  condition: Condition | undefined,
  answers: Answers,
  profile?: Profile,
): boolean {
  return evaluateCondition(condition, answers, profile) === true;
}

function first(answers: Answers, id: string, fallback: string): string {
  return parseSelected(id, answers)[0] ?? fallback;
}

function listOr(answers: Answers, id: string, fallback: string[]): string[] {
  const selected = parseSelected(id, answers);
  return selected.length > 0 ? selected : fallback;
}

const WEB_PRODUCTS = new Set([
  "website",
  "webapp",
  "web-mobile",
  "realtime",
  "store",
  "internal",
  "ai",
]);

const MOBILE_PRODUCTS = new Set(["mobile", "web-mobile"]);
const DESKTOP_PRODUCTS = new Set(["desktop"]);

export function needsWeb(product: string): boolean {
  return WEB_PRODUCTS.has(product);
}

export function needsMobile(product: string): boolean {
  return MOBILE_PRODUCTS.has(product);
}

export function needsDesktop(product: string): boolean {
  return DESKTOP_PRODUCTS.has(product);
}

export function isDeveloperRole(role: string): boolean {
  return role === "developer" || role === "lead";
}

export function scaleAtLeast(scaleYear1: string, min: string): boolean {
  const order = ["under-1k", "1k-10k", "10k-100k", "100k-1m", "1m-plus"];
  return order.indexOf(scaleYear1) >= order.indexOf(min);
}

export function buildProfile(answers: Answers): Profile {
  const product = first(answers, "product", "webapp");
  const role = first(answers, "role", "founder");

  const defaultPlatforms: string[] = [];
  if (needsWeb(product)) {
    defaultPlatforms.push("browser");
  }
  if (needsMobile(product)) {
    defaultPlatforms.push("ios", "android");
  }
  if (needsDesktop(product)) {
    defaultPlatforms.push("windows", "macos");
  }

  const languages = listOr(answers, "languages", ["none"]);
  const platforms = listOr(answers, "platforms", defaultPlatforms);

  let webKind = first(answers, "webKind", "unsure");
  if (webKind === "unsure") {
    if (product === "website") {
      webKind = "public";
    } else if (product === "webapp" || product === "internal") {
      webKind = "logged-in";
    } else if (product === "realtime") {
      webKind = "editor";
    } else {
      webKind = "both";
    }
  }

  let seo = first(answers, "seo", "unsure");
  if (seo === "unsure") {
    seo = product === "website" ? "must" : "nice";
  }

  return {
    role,
    team: first(answers, "team", "solo-learning"),
    languages: languages.includes("none") ? [] : languages,
    product,
    platforms,
    nativeDepth: first(answers, "nativeDepth", "standard"),
    webKind,
    seo,
    realtime: first(answers, "realtime", "none"),
    offline: first(answers, "offline", "online"),
    media: first(answers, "media", "none"),
    ai: first(answers, "ai", "none"),
    dataShape: first(answers, "dataShape", "unsure"),
    dataVolume: first(answers, "dataVolume", "unsure"),
    consistency: first(answers, "consistency", "strong"),
    search: first(answers, "search", "none"),
    analytics: first(answers, "analytics", "none"),
    scaleYear1: first(answers, "scaleYear1", "1k-10k"),
    scaleAmbition: first(answers, "scaleAmbition", "national"),
    trafficPattern: first(answers, "trafficPattern", "steady"),
    geo: first(answers, "geo", "one-region"),
    readWrite: first(answers, "readWrite", "balanced"),
    budget: first(answers, "budget", "under-50"),
    timeline: first(answers, "timeline", "1-3-months"),
    compliance: listOr(answers, "compliance", ["none"]).filter(
      (item) => item !== "none",
    ),
    ops: first(answers, "ops", "none"),
    deployPreference: first(answers, "deployPreference", "unsure"),
    existingCloud: listOr(answers, "existingCloud", ["none"]).filter(
      (item) => item !== "none",
    ),
    lockIn: first(answers, "lockIn", "unsure"),
    auth: first(answers, "auth", "none"),
    payments: first(answers, "payments", "none"),
    integrations: listOr(answers, "integrations", ["none"]).filter(
      (item) => item !== "none",
    ),
    observability: listOr(answers, "observability", ["none"]).filter(
      (item) => item !== "none",
    ),
  };
}
