import { describe, expect, test } from "vitest";
import {
  getWizardProgress,
  QUESTIONS,
  walkQuestionTree,
} from "@/lib/questions";
import {
  DIMENSION_WEIGHTS,
  decodeAnswers,
  encodeAnswers,
  IncompleteAnswersError,
  recommend,
  recommendFromEncoded,
  scoreStack,
  weightTotal,
} from "@/lib/scoring";
import { STACKS } from "@/lib/stacks";
import {
  type Answers,
  BUDGETS,
  DATA_TYPES,
  DEPLOYMENTS,
  PRODUCTS,
  PROFILE_DIMENSIONS,
  REALTIME,
  SCALES,
  type Stack,
  TEAMS,
} from "@/lib/types";

const soloWebFree: Answers = {
  product: "web",
  scale: "startup",
  team: "solo",
  budget: "free",
  realtime: "no",
  data: "relational",
  deploy: "serverless",
};

const mobileRealtimeFree: Answers = {
  product: "mobile",
  scale: "startup",
  team: "solo",
  budget: "free",
  realtime: "yes",
  data: "document",
  deploy: "serverless",
};

const mobileRelational: Answers = {
  product: "mobile",
  scale: "startup",
  team: "small",
  budget: "free",
  realtime: "yes",
  data: "relational",
  deploy: "serverless",
};

const enterpriseApiHyperscale: Answers = {
  product: "api",
  scale: "hyperscale",
  team: "experienced",
  budget: "enterprise",
  realtime: "no",
  data: "relational",
  deploy: "self-hosted",
};

const analyticsPipeline: Answers = {
  product: "pipeline",
  scale: "growth",
  team: "experienced",
  budget: "enterprise",
  realtime: "no",
  data: "analytics",
  deploy: "managed",
};

const realtimeCollaboration: Answers = {
  product: "realtime",
  scale: "growth",
  team: "experienced",
  budget: "low",
  data: "relational",
  deploy: "managed",
};

const heavyOpsStacks = [
  "go-redis-kubernetes",
  "spring-postgres-k8s",
  "kafka-flink-k8s",
  "airflow-dbt-bigquery",
];

function idsOf(result: ReturnType<typeof recommend>) {
  return [result.winner, ...result.runnersUp].map((item) => item.stack.id);
}

describe("catalog integrity", () => {
  test("weights sum to 100", () => {
    expect(weightTotal()).toBe(100);
    expect(Object.keys(DIMENSION_WEIGHTS)).toHaveLength(
      PROFILE_DIMENSIONS.length,
    );
  });

  test("ships 15–20 curated stacks", () => {
    expect(STACKS.length).toBeGreaterThanOrEqual(15);
    expect(STACKS.length).toBeLessThanOrEqual(20);
  });

  test("every stack has a complete affinity profile and copy", () => {
    const dimensions: Array<{
      key: keyof Stack["profile"];
      values: readonly string[];
    }> = [
      { key: "product", values: PRODUCTS },
      { key: "scale", values: SCALES },
      { key: "teamExperience", values: TEAMS },
      { key: "budget", values: BUDGETS },
      { key: "realTime", values: REALTIME },
      { key: "dataType", values: DATA_TYPES },
      { key: "deploymentPreference", values: DEPLOYMENTS },
    ];

    const ids = new Set<string>();
    for (const stack of STACKS) {
      expect(stack.id).toBeTruthy();
      expect(ids.has(stack.id)).toBe(false);
      ids.add(stack.id);
      expect(stack.name).toBeTruthy();
      expect(stack.summary).toBeTruthy();
      expect(stack.pros.length).toBeGreaterThan(0);
      expect(stack.cons.length).toBeGreaterThan(0);
      expect(stack.scalingStory.to10k).toBeTruthy();
      expect(stack.scalingStory.to1m).toBeTruthy();
      expect(stack.scalingStory.to1b).toBeTruthy();

      for (const { key, values } of dimensions) {
        for (const value of values) {
          const affinity = stack.profile[key][value as never];
          expect(affinity).toBeGreaterThanOrEqual(0);
          expect(affinity).toBeLessThanOrEqual(3);
        }
      }
    }
  });

  test("every question option maps onto a profile dimension", () => {
    for (const question of QUESTIONS) {
      expect(question.options.length).toBeGreaterThan(1);
      for (const option of question.options) {
        expect(option.mapsTo.dimension).toBeTruthy();
        expect(option.mapsTo.value).toBe(option.id);
      }
    }
  });
});

describe("recommend()", () => {
  test("returns a winner and two unique runners-up", () => {
    const result = recommend(soloWebFree);
    expect(result.runnersUp).toHaveLength(2);
    const ids = idsOf(result);
    expect(new Set(ids).size).toBe(3);
    expect(result.winner.score).toBeGreaterThanOrEqual(
      result.runnersUp[0].score,
    );
    expect(result.runnersUp[0].score).toBeGreaterThanOrEqual(
      result.runnersUp[1].score,
    );
  });

  test("is deterministic", () => {
    const first = recommend(soloWebFree);
    const second = recommend(soloWebFree);
    expect(idsOf(first)).toEqual(idsOf(second));
    expect(first.winner.score).toBe(second.winner.score);
  });

  test("solo beginner web + free serverless → lightweight TS/Postgres, not K8s", () => {
    const result = recommend(soloWebFree);
    expect(result.winner.stack.id).toBe("nextjs-postgres-vercel");
    expect(result.winner.score).toBe(100);
    for (const id of idsOf(result)) {
      expect(heavyOpsStacks).not.toContain(id);
    }
  });

  test("mobile + document + realtime + free → Firebase + Flutter", () => {
    const result = recommend(mobileRealtimeFree);
    expect(result.winner.stack.id).toBe("firebase-flutter");
    expect(result.winner.score).toBe(100);
  });

  test("mobile + relational SQL prefers React Native + Supabase over Firebase", () => {
    const result = recommend(mobileRelational);
    expect(result.winner.stack.id).toBe("react-native-supabase");
    expect(idsOf(result)).not.toContain("nextjs-postgres-vercel");
  });

  test("experienced team, hyperscale API, enterprise, self-hosted → Go or Spring", () => {
    const result = recommend(enterpriseApiHyperscale);
    expect(["go-redis-kubernetes", "spring-postgres-k8s"]).toContain(
      result.winner.stack.id,
    );
    expect(idsOf(result)).not.toContain("firebase-flutter");
    expect(idsOf(result)).not.toContain("nextjs-postgres-vercel");
  });

  test("analytics pipeline on managed cloud → Airflow + dbt + BigQuery", () => {
    const result = recommend(analyticsPipeline);
    expect(result.winner.stack.id).toBe("airflow-dbt-bigquery");
    expect(idsOf(result)).toContain("kafka-flink-k8s");
  });

  test("realtime product skips the realtime question and still recommends Phoenix", () => {
    const walk = walkQuestionTree(realtimeCollaboration);
    expect(walk.complete).toBe(true);
    expect(walk.resolved.realtime).toBe("yes");
    expect(walk.visible.map((question) => question.id)).not.toContain(
      "realtime",
    );

    const result = recommend(realtimeCollaboration);
    expect(result.winner.stack.id).toBe("phoenix-liveview-fly");
    expect(result.answers.realtime).toBe("yes");
  });

  test("does not surface product-affinity-0 stacks in the top 3", () => {
    const result = recommend(soloWebFree);
    for (const item of [result.winner, ...result.runnersUp]) {
      expect(item.stack.profile.product.web).toBeGreaterThan(0);
    }
    expect(idsOf(result)).not.toContain("kafka-flink-k8s");
    expect(idsOf(result)).not.toContain("airflow-dbt-bigquery");
  });

  test("reasons only cite dimensions with affinity ≥ 2 and use the user's labels", () => {
    const result = recommend(soloWebFree);
    expect(result.winner.reasons.length).toBeGreaterThan(0);
    for (const reason of result.winner.reasons) {
      expect(reason.affinity).toBeGreaterThanOrEqual(2);
      expect(reason.detail).toContain(result.winner.stack.name);
      expect(reason.optionLabel).toBeTruthy();
    }
    expect(
      result.winner.reasons.some((reason) => reason.optionLabel === "Web app"),
    ).toBe(true);
  });

  test("throws on incomplete answers", () => {
    expect(() => recommend({ product: "web" })).toThrow(IncompleteAnswersError);
  });

  test("throws on an unknown option", () => {
    expect(() =>
      recommend({ ...soloWebFree, product: "mainframe" }),
    ).toThrowError(/Unknown option/);
  });
});

describe("scoreStack()", () => {
  test("perfect affinity totals 100", () => {
    const result = recommend(soloWebFree);
    const scored = scoreStack(result.winner.stack, result.profile);
    expect(scored.score).toBe(100);
  });
});

describe("getWizardProgress()", () => {
  test("starts at question 1 of 7", () => {
    const progress = getWizardProgress({});
    expect(progress.step).toBe(1);
    expect(progress.total).toBe(7);
    expect(progress.ratio).toBe(0);
  });

  test("realtime product shortens the path to 6 questions", () => {
    const progress = getWizardProgress({ product: "realtime" });
    expect(progress.total).toBe(6);
    expect(progress.step).toBe(2);
  });
});

describe("recommendFromEncoded()", () => {
  test("returns a recommendation from a share string", () => {
    const result = recommendFromEncoded(encodeAnswers(soloWebFree));
    expect(result?.winner.stack.id).toBe("nextjs-postgres-vercel");
  });

  test("returns null for empty or incomplete payloads", () => {
    expect(recommendFromEncoded(undefined)).toBeNull();
    expect(recommendFromEncoded("product:web")).toBeNull();
  });
});

describe("shareable answers encoding", () => {
  test("round-trips a complete answer set", () => {
    const encoded = encodeAnswers(soloWebFree);
    expect(encoded).toContain("product:web");
    expect(decodeAnswers(encoded)).toEqual(soloWebFree);
  });

  test("fills the skipped realtime answer when encoding a realtime product", () => {
    const encoded = encodeAnswers(realtimeCollaboration);
    expect(encoded).toContain("realtime:yes");
    const decoded = decodeAnswers(encoded);
    expect(decoded.realtime).toBe("yes");
    expect(recommend(decoded).winner.stack.id).toBe("phoenix-liveview-fly");
  });

  test("rejects malformed tokens", () => {
    expect(() => decodeAnswers("productweb")).toThrowError(
      /Invalid answers token/,
    );
  });
});
