import type { Answers, Question, QuestionWalk } from "./types";

export const QUESTIONS_START_ID = "product";

/**
 * Linear v1 flow with one skip: a "Real-time app" product implies
 * realtime = yes, so that question is not shown.
 * Options may set `next` later to branch without changing UI code.
 */
export const QUESTIONS: Question[] = [
  {
    id: "product",
    prompt: "What are you building?",
    helper:
      "Pick the closest match. You can still get a backend-capable stack for a web or mobile app.",
    next: "scale",
    options: [
      {
        id: "web",
        label: "Web app",
        description:
          "Browser-based product, SaaS, dashboard, or marketing + app.",
        mapsTo: { dimension: "product", value: "web" },
      },
      {
        id: "mobile",
        label: "Mobile app",
        description: "iOS, Android, or cross-platform client.",
        mapsTo: { dimension: "product", value: "mobile" },
      },
      {
        id: "api",
        label: "API or backend service",
        description: "HTTP APIs, workers, or a service other apps will call.",
        mapsTo: { dimension: "product", value: "api" },
      },
      {
        id: "realtime",
        label: "Real-time app",
        description:
          "Chat, collaboration, live presence, or streaming updates.",
        mapsTo: { dimension: "product", value: "realtime" },
      },
      {
        id: "pipeline",
        label: "Data pipeline",
        description:
          "ETL/ELT, analytics warehouse, or streaming data platform.",
        mapsTo: { dimension: "product", value: "pipeline" },
      },
    ],
  },
  {
    id: "scale",
    prompt: "Expected scale in year one?",
    helper: "Users, or equivalent request volume if you are building an API.",
    next: "team",
    options: [
      {
        id: "startup",
        label: "Under 10K users",
        mapsTo: { dimension: "scale", value: "startup" },
      },
      {
        id: "growth",
        label: "10K–1M",
        mapsTo: { dimension: "scale", value: "growth" },
      },
      {
        id: "hyperscale",
        label: "1M+",
        mapsTo: { dimension: "scale", value: "hyperscale" },
      },
    ],
  },
  {
    id: "team",
    prompt: "Team size & experience?",
    next: "budget",
    options: [
      {
        id: "solo",
        label: "Solo/beginner",
        mapsTo: { dimension: "teamExperience", value: "solo" },
      },
      {
        id: "small",
        label: "Small team",
        mapsTo: { dimension: "teamExperience", value: "small" },
      },
      {
        id: "experienced",
        label: "Experienced team",
        mapsTo: { dimension: "teamExperience", value: "experienced" },
      },
    ],
  },
  {
    id: "budget",
    prompt: "Infra budget?",
    next: "realtime",
    options: [
      {
        id: "free",
        label: "Free tier only",
        mapsTo: { dimension: "budget", value: "free" },
      },
      {
        id: "low",
        label: "Low budget",
        mapsTo: { dimension: "budget", value: "low" },
      },
      {
        id: "enterprise",
        label: "Enterprise budget",
        mapsTo: { dimension: "budget", value: "enterprise" },
      },
    ],
  },
  {
    id: "realtime",
    prompt: "Real-time features needed?",
    helper: "Live updates, presence, chat, multiplayer, or streaming events.",
    next: "data",
    skipWhen: [
      {
        questionId: "product",
        optionIds: ["realtime"],
        implicitAnswer: "yes",
      },
    ],
    options: [
      {
        id: "yes",
        label: "Yes",
        mapsTo: { dimension: "realTime", value: "yes" },
      },
      {
        id: "no",
        label: "No",
        mapsTo: { dimension: "realTime", value: "no" },
      },
    ],
  },
  {
    id: "data",
    prompt: "Primary data shape?",
    next: "deploy",
    options: [
      {
        id: "relational",
        label: "Relational",
        mapsTo: { dimension: "dataType", value: "relational" },
      },
      {
        id: "document",
        label: "Document-based",
        mapsTo: { dimension: "dataType", value: "document" },
      },
      {
        id: "both",
        label: "Both",
        mapsTo: { dimension: "dataType", value: "both" },
      },
      {
        id: "analytics",
        label: "Heavy analytics",
        mapsTo: { dimension: "dataType", value: "analytics" },
      },
    ],
  },
  {
    id: "deploy",
    prompt: "Deployment preference?",
    next: null,
    options: [
      {
        id: "serverless",
        label: "Serverless",
        mapsTo: { dimension: "deploymentPreference", value: "serverless" },
      },
      {
        id: "self-hosted",
        label: "Self-hosted",
        mapsTo: { dimension: "deploymentPreference", value: "self-hosted" },
      },
      {
        id: "managed",
        label: "Managed cloud",
        mapsTo: { dimension: "deploymentPreference", value: "managed" },
      },
    ],
  },
];

export const QUESTIONS_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((question) => [question.id, question]),
);

export function getQuestion(id: string): Question {
  const question = QUESTIONS_BY_ID[id];
  if (!question) {
    throw new Error(`Unknown question id: ${id}`);
  }
  return question;
}

function matchingSkipRule(question: Question, answers: Answers) {
  return question.skipWhen?.find((rule) =>
    rule.optionIds.includes(answers[rule.questionId] ?? ""),
  );
}

/**
 * Walks the configurable question tree using answers collected so far.
 * Skipped questions receive their implicit answer and are not returned as visible.
 */
export function walkQuestionTree(answers: Answers = {}): QuestionWalk {
  const resolved: Answers = { ...answers };
  const visible: Question[] = [];
  let current: Question | undefined = QUESTIONS_BY_ID[QUESTIONS_START_ID];

  while (current) {
    const skip = matchingSkipRule(current, resolved);
    if (skip) {
      if (!resolved[current.id]) {
        resolved[current.id] = skip.implicitAnswer;
      }
      current = current.next ? QUESTIONS_BY_ID[current.next] : undefined;
      continue;
    }

    visible.push(current);
    const answer = resolved[current.id];
    if (!answer) {
      return { visible, pending: current, complete: false, resolved };
    }

    const option = current.options.find((item) => item.id === answer);
    if (!option) {
      throw new Error(
        `Unknown option "${answer}" for question "${current.id}"`,
      );
    }

    const nextId = option.next === undefined ? current.next : option.next;
    current = nextId ? QUESTIONS_BY_ID[nextId] : undefined;
  }

  return { visible, pending: null, complete: true, resolved };
}

export function findOptionLabel(
  questionId: string,
  optionId: string,
): string | undefined {
  return QUESTIONS_BY_ID[questionId]?.options.find(
    (option) => option.id === optionId,
  )?.label;
}

export function getWizardProgress(answers: Answers): {
  step: number;
  total: number;
  answered: number;
  ratio: number;
} {
  const walk = walkQuestionTree(answers);
  const answered = walk.visible.filter(
    (question) =>
      Boolean(walk.resolved[question.id]) && question.id !== walk.pending?.id,
  ).length;

  let remaining = 0;
  let cursor = walk.pending ?? undefined;
  const resolved: Answers = { ...walk.resolved };

  while (cursor) {
    const skip = matchingSkipRule(cursor, resolved);
    if (skip) {
      resolved[cursor.id] = skip.implicitAnswer;
      cursor = cursor.next ? QUESTIONS_BY_ID[cursor.next] : undefined;
      continue;
    }
    remaining += 1;
    cursor = cursor.next ? QUESTIONS_BY_ID[cursor.next] : undefined;
  }

  const total = answered + remaining;
  return {
    step: walk.complete ? total : answered + 1,
    total,
    answered,
    ratio: total === 0 ? 0 : answered / total,
  };
}
