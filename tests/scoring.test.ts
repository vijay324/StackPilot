import { describe, expect, test } from "vitest";
import { COMPONENTS, COMPONENTS_BY_ID } from "@/lib/catalog";
import {
  decodeAnswers,
  encodeAnswers,
  IncompleteAnswersError,
  recommend,
  recommendFromEncoded,
} from "@/lib/engine";
import { PRESETS } from "@/lib/presets";
import {
  getWizardProgress,
  QUESTIONS,
  QUESTIONS_BY_ID,
  walkQuestionTree,
} from "@/lib/questions";
import type { Answers } from "@/lib/types";

function idsOf(result: ReturnType<typeof recommend>): string[] {
  return result.bestOverall.componentIds;
}

function hasAny(ids: string[], wanted: string[]): boolean {
  return wanted.some((id) => ids.includes(id));
}

const founderWebsite: Answers = {
  role: "founder",
  team: "solo-learning",
  product: "website",
  webKind: "public",
  seo: "must",
  realtime: "none",
  media: "none",
  ai: "none",
  dataShape: "unsure",
  dataVolume: "small",
  search: "none",
  analytics: "none",
  scaleYear1: "under-1k",
  scaleAmbition: "local",
  trafficPattern: "steady",
  geo: "one-region",
  budget: "zero",
  timeline: "days",
  compliance: "none",
  ops: "none",
  deployPreference: "serverless",
  existingCloud: "none",
  lockIn: "unsure",
  auth: "none",
  payments: "none",
  integrations: "none",
};

const soloDevSaas: Answers = {
  role: "developer",
  team: "solo-experienced",
  languages: "typescript",
  product: "webapp",
  webKind: "logged-in",
  seo: "nice",
  realtime: "none",
  media: "none",
  ai: "none",
  dataShape: "relational",
  dataVolume: "growing",
  consistency: "strong",
  search: "filter",
  analytics: "simple",
  scaleYear1: "1k-10k",
  scaleAmbition: "national",
  trafficPattern: "steady",
  geo: "one-region",
  readWrite: "balanced",
  budget: "under-50",
  timeline: "1-3-months",
  compliance: "none",
  ops: "none",
  deployPreference: "serverless",
  existingCloud: "none",
  lockIn: "unsure",
  auth: "email",
  payments: "subscriptions",
  integrations: "email",
  observability: "errors",
};

const webMobileRelational: Answers = {
  ...soloDevSaas,
  role: "lead",
  team: "small",
  product: "web-mobile",
  platforms: "ios+android+browser",
  nativeDepth: "standard",
  offline: "online",
  dataShape: "relational",
  lockIn: "ok",
  deployPreference: "serverless",
};

function without(answers: Answers, keys: string[]): Answers {
  const next = { ...answers };
  for (const key of keys) {
    delete next[key];
  }
  return next;
}

const iosNative: Answers = without(
  {
    ...soloDevSaas,
    languages: "swift",
    product: "mobile",
    platforms: "ios",
    nativeDepth: "heavy",
    offline: "online",
  },
  ["webKind", "seo"],
);

const dotnetAzure: Answers = {
  ...soloDevSaas,
  role: "lead",
  team: "large",
  languages: "csharp",
  product: "webapp",
  budget: "enterprise",
  ops: "light",
  deployPreference: "paas",
  existingCloud: "azure+microsoft",
  observability: "metrics+errors",
};

const hyperscaleApi: Answers = {
  role: "lead",
  team: "large",
  languages: "go+java",
  product: "api",
  realtime: "none",
  media: "none",
  ai: "none",
  dataShape: "relational",
  dataVolume: "tb",
  consistency: "strong",
  search: "none",
  analytics: "none",
  scaleYear1: "1m-plus",
  scaleAmbition: "billion",
  trafficPattern: "steady",
  geo: "worldwide",
  readWrite: "balanced",
  budget: "enterprise",
  timeline: "6-months",
  compliance: "none",
  ops: "dedicated",
  deployPreference: "self-hosted",
  existingCloud: "none",
  lockIn: "portable",
  auth: "none",
  payments: "none",
  integrations: "jobs",
  observability: "metrics",
};

const biPlatform: Answers = {
  role: "lead",
  team: "large",
  languages: "python",
  product: "analytics",
  realtime: "none",
  media: "none",
  ai: "none",
  dataShape: "timeseries",
  dataVolume: "tb",
  consistency: "eventual",
  search: "none",
  analytics: "bi",
  scaleYear1: "100k-1m",
  scaleAmbition: "global",
  trafficPattern: "batch",
  geo: "multi-region",
  readWrite: "read-heavy",
  budget: "enterprise",
  timeline: "6-months",
  compliance: "none",
  ops: "dedicated",
  deployPreference: "cloud",
  existingCloud: "gcp",
  lockIn: "unsure",
  auth: "none",
  payments: "none",
  integrations: "jobs",
  observability: "metrics",
};

const collabEditor: Answers = {
  ...soloDevSaas,
  languages: "elixir+typescript",
  product: "realtime",
  webKind: "editor",
  seo: "none",
  realtime: "collab",
  offline: "online",
  ops: "light",
  deployPreference: "paas",
  budget: "50-500",
};

const multiplayer: Answers = {
  ...soloDevSaas,
  languages: "go",
  product: "webapp",
  realtime: "multiplayer",
  team: "large",
  ops: "dedicated",
  deployPreference: "cloud",
  budget: "enterprise",
  scaleAmbition: "global",
};

const hipaaApp: Answers = {
  ...soloDevSaas,
  compliance: "hipaa",
  lockIn: "portable",
  deployPreference: "cloud",
  budget: "500-5k",
  ops: "light",
};

describe("catalog integrity", () => {
  test("unique component ids and complete copy", () => {
    const ids = new Set<string>();
    for (const component of COMPONENTS) {
      expect(component.id).toBeTruthy();
      expect(ids.has(component.id)).toBe(false);
      ids.add(component.id);
      expect(component.plainSummary.length).toBeGreaterThan(10);
      expect(component.summary.length).toBeGreaterThan(10);
      expect(component.rules.length).toBeGreaterThanOrEqual(3);
      expect(component.scaling.to10k).toBeTruthy();
      expect(component.scaling.to1m).toBeTruthy();
      expect(component.scaling.to1b).toBeTruthy();
      expect(component.meta.lastReviewed).toBeTruthy();
      expect(component.meta.sources.length).toBeGreaterThanOrEqual(1);
      expect(component.pros.length).toBeGreaterThan(0);
      expect(component.cons.length).toBeGreaterThan(0);
    }
  });

  test("requires, conflicts, synergy, and presets resolve", () => {
    for (const component of COMPONENTS) {
      for (const token of [
        ...(component.requires ?? []),
        ...(component.conflicts ?? []),
        ...(component.synergy ?? []).map((item) => item.with),
      ]) {
        if (token.startsWith("tag:")) {
          continue;
        }
        expect(COMPONENTS_BY_ID[token], token).toBeTruthy();
      }
    }
    for (const preset of PRESETS) {
      for (const id of preset.components) {
        expect(COMPONENTS_BY_ID[id], `${preset.id}:${id}`).toBeTruthy();
      }
    }
  });
});

describe("question integrity", () => {
  test("option ids are unique per question and showWhen points at real questions", () => {
    for (const question of QUESTIONS) {
      expect(question.options.length).toBeGreaterThan(1);
      const ids = new Set<string>();
      for (const option of question.options) {
        expect(ids.has(option.id)).toBe(false);
        ids.add(option.id);
      }
    }
  });

  test("every question is reachable and no path exceeds 35 questions", () => {
    expect(QUESTIONS.length).toBeGreaterThan(20);
    expect(QUESTIONS.length).toBeLessThanOrEqual(35);
    for (const question of QUESTIONS) {
      expect(QUESTIONS_BY_ID[question.id]).toBe(question);
    }
  });

  test("progress starts at question 1 with a live total", () => {
    const progress = getWizardProgress({});
    expect(progress.step).toBe(1);
    expect(progress.total).toBeGreaterThan(10);
  });
});

describe("recommend()", () => {
  test("persona answers complete the tree", () => {
    for (const answers of [
      founderWebsite,
      soloDevSaas,
      webMobileRelational,
      iosNative,
      dotnetAzure,
      hyperscaleApi,
      biPlatform,
      collabEditor,
      multiplayer,
      hipaaApp,
    ]) {
      const walk = walkQuestionTree(answers);
      expect(walk.complete, JSON.stringify(walk.pending)).toBe(true);
    }
  });

  test("solo non-technical website on $0 → Astro or Next.js + Vercel", () => {
    const result = recommend(founderWebsite);
    expect(hasAny(idsOf(result), ["astro", "nextjs"])).toBe(true);
    expect(idsOf(result)).toContain("vercel");
    expect(idsOf(result)).not.toContain("kubernetes");
    expect(idsOf(result)).not.toContain("supabase");
    expect(idsOf(result)).not.toContain("firebase");
  });

  test("solo dev SaaS → Next.js + Postgres + Vercel", () => {
    const result = recommend(soloDevSaas);
    expect(idsOf(result)).toContain("nextjs");
    expect(hasAny(idsOf(result), ["postgres", "supabase"])).toBe(true);
    expect(hasAny(idsOf(result), ["vercel", "netlify"])).toBe(true);
    expect(idsOf(result)).not.toContain("kubernetes");
  });

  test("small team web+mobile relational prefers Expo and SQL, not a web-only stack as mobile", () => {
    const result = recommend(webMobileRelational);
    expect(hasAny(idsOf(result), ["expo", "flutter"])).toBe(true);
    expect(hasAny(idsOf(result), ["postgres", "supabase"])).toBe(true);
    expect(idsOf(result)).not.toContain("kafka");
  });

  test("iOS-only heavy device features → SwiftUI", () => {
    const result = recommend(iosNative);
    expect(idsOf(result)).toContain("swiftui");
    expect(idsOf(result)).not.toContain("capacitor");
  });

  test("enterprise .NET shop on Azure → ASP.NET + Azure SQL", () => {
    const result = recommend(dotnetAzure);
    expect(idsOf(result)).toContain("aspnet");
    expect(hasAny(idsOf(result), ["azure-sql", "azure-app"])).toBe(true);
    expect(idsOf(result)).not.toContain("firebase");
  });

  test("hyperscale API experienced self-hosted → Go or Spring + Kubernetes + SQL + Redis", () => {
    const result = recommend(hyperscaleApi);
    expect(hasAny(idsOf(result), ["go", "spring"])).toBe(true);
    expect(hasAny(idsOf(result), ["kubernetes", "aws-eks"])).toBe(true);
    expect(hasAny(idsOf(result), ["postgres", "cockroach"])).toBe(true);
    expect(idsOf(result)).toContain("redis");
    expect(idsOf(result)).not.toContain("firebase");
    expect(idsOf(result)).not.toContain("pocketbase");
  });

  test("BI platform → BigQuery or Snowflake + dbt + Dagster/Airflow", () => {
    const result = recommend(biPlatform);
    expect(hasAny(idsOf(result), ["bigquery", "snowflake"])).toBe(true);
    expect(hasAny(idsOf(result), ["dbt", "dagster"])).toBe(true);
    expect(idsOf(result)).not.toContain("pocketbase");
  });

  test("collaborative editor → Phoenix Channels or Liveblocks", () => {
    const result = recommend(collabEditor);
    expect(
      hasAny(idsOf(result), [
        "phoenix-channels",
        "liveblocks",
        "phoenix-liveview",
      ]),
    ).toBe(true);
  });

  test("multiplayer never recommends serverless-only hosting", () => {
    const result = recommend(multiplayer);
    expect(idsOf(result)).not.toContain("vercel");
    expect(idsOf(result)).not.toContain("aws-lambda");
    expect(
      hasAny(idsOf(result), ["socketio", "phoenix-channels", "livekit"]),
    ).toBe(true);
  });

  test("HIPAA excludes hobby BaaS", () => {
    const result = recommend(hipaaApp);
    expect(idsOf(result)).not.toContain("firebase");
    expect(idsOf(result)).not.toContain("pocketbase");
    expect(idsOf(result)).not.toContain("convex");
  });

  test("is deterministic and alternatives differ from best overall", () => {
    const first = recommend(soloDevSaas);
    const second = recommend(soloDevSaas);
    expect(idsOf(first)).toEqual(idsOf(second));
    expect(first.bestOverall.score).toBe(second.bestOverall.score);
    for (const alt of first.alternatives) {
      expect([...alt.componentIds].sort().join(",")).not.toBe(
        [...first.bestOverall.componentIds].sort().join(","),
      );
    }
  });

  test("throws on incomplete answers", () => {
    expect(() => recommend({ role: "founder" })).toThrow(
      IncompleteAnswersError,
    );
  });

  test("python internal tool prefers Django, not Kubernetes", () => {
    const result = recommend(
      without(
        {
          ...soloDevSaas,
          languages: "python",
          product: "internal",
          webKind: "logged-in",
          deployPreference: "paas",
          ops: "light",
        },
        ["seo"],
      ),
    );
    expect(idsOf(result)).toContain("django");
    expect(idsOf(result)).not.toContain("kubernetes");
  });

  test("online store includes Stripe and not IAP-only billing", () => {
    const result = recommend({
      ...soloDevSaas,
      product: "store",
      webKind: "both",
      seo: "must",
      payments: "once",
    });
    expect(idsOf(result)).toContain("stripe");
    expect(idsOf(result)).not.toContain("revenuecat");
  });

  test("RAG product includes a vector store", () => {
    const result = recommend({
      ...soloDevSaas,
      product: "ai",
      ai: "rag",
      webKind: "logged-in",
    });
    expect(hasAny(idsOf(result), ["pgvector", "qdrant", "pinecone"])).toBe(
      true,
    );
  });

  test("desktop TypeScript product prefers Electron or Tauri", () => {
    const result = recommend(
      without(
        {
          ...soloDevSaas,
          product: "desktop",
          platforms: "windows+macos",
          nativeDepth: "standard",
          offline: "online",
        },
        ["webKind", "seo"],
      ),
    );
    expect(hasAny(idsOf(result), ["electron", "tauri"])).toBe(true);
    expect(idsOf(result)).not.toContain("swiftui");
  });

  test("document + mobile + realtime still avoids Kubernetes for a solo builder", () => {
    const result = recommend(
      without(
        {
          ...soloDevSaas,
          team: "solo-learning",
          product: "mobile",
          platforms: "ios+android",
          nativeDepth: "standard",
          offline: "online",
          dataShape: "document",
          realtime: "live",
          lockIn: "ok",
        },
        ["webKind", "seo"],
      ),
    );
    expect(hasAny(idsOf(result), ["firebase", "flutter", "expo"])).toBe(true);
    expect(idsOf(result)).not.toContain("kubernetes");
  });

  test("full-text search adds a search layer", () => {
    const result = recommend({
      ...soloDevSaas,
      search: "fulltext",
    });
    expect(
      hasAny(idsOf(result), [
        "meilisearch",
        "typesense",
        "algolia",
        "postgres-fts",
        "opensearch",
      ]),
    ).toBe(true);
  });
});

describe("shareable answers encoding", () => {
  test("round-trips a complete answer set including multi-select", () => {
    const encoded = encodeAnswers(webMobileRelational);
    expect(encoded).toContain("platforms:ios+android+browser");
    expect(decodeAnswers(encoded)).toMatchObject(webMobileRelational);
  });

  test("round-trips founder answers without treating them as legacy v1 tokens", () => {
    const encoded = encodeAnswers(founderWebsite);
    expect(decodeAnswers(encoded).team).toBe("solo-learning");
    expect(decodeAnswers(encoded).realtime).toBe("none");
    expect(recommendFromEncoded(encoded)?.bestOverall.componentIds).toEqual(
      recommend(founderWebsite).bestOverall.componentIds,
    );
  });

  test("legacy 7-question URLs do not throw and resume as a partial set", () => {
    const legacy =
      "product:web,scale:startup,team:solo,budget:free,realtime:no,data:relational,deploy:serverless";
    const decoded = decodeAnswers(legacy);
    expect(decoded.product).toBe("webapp");
    expect(decoded.scaleYear1).toBe("1k-10k");
    expect(decoded.budget).toBe("zero");
    expect(decoded.deployPreference).toBe("serverless");
    const walk = walkQuestionTree(decoded);
    expect(walk.complete).toBe(false);
    expect(recommendFromEncoded(legacy)).toBeNull();
  });

  test("rejects malformed tokens", () => {
    expect(() => decodeAnswers("productweb")).toThrowError(
      /Invalid answers token/,
    );
  });
});
