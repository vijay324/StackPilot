import { evaluateCondition } from "@/lib/engine/profile";
import type {
  Answers,
  Question,
  QuestionWalk,
  SectionId,
  WizardProgress,
} from "@/lib/types";
import { SECTION_IDS } from "@/lib/types";

export const QUESTIONS_START_ID = "role";

export const QUESTIONS: Question[] = [
  {
    id: "role",
    section: "who",
    kind: "single",
    prompt: "Who is answering these questions?",
    helper:
      "We’ll keep the wording simple, and only ask extra technical detail if you write code.",
    options: [
      {
        id: "founder",
        label: "Non-technical founder or product person",
        description: "You have the idea. Someone else may write the code.",
      },
      {
        id: "developer",
        label: "Developer",
        description: "You will implement it yourself.",
      },
      {
        id: "lead",
        label: "Technical lead of a team",
        description: "You choose architecture for people who will ship it.",
      },
    ],
  },
  {
    id: "team",
    section: "who",
    kind: "single",
    prompt: "Who will build the first version?",
    options: [
      {
        id: "solo-learning",
        label: "Just me, still learning",
        description: "You want a path that is hard to get stuck on.",
      },
      {
        id: "solo-experienced",
        label: "Just me, experienced",
        description: "You can operate tools, but time still matters.",
      },
      {
        id: "small",
        label: "2–5 people",
      },
      {
        id: "large",
        label: "6 or more people",
      },
      {
        id: "agency",
        label: "An agency or contractor will build it",
      },
    ],
  },
  {
    id: "languages",
    section: "who",
    kind: "multi",
    minSelections: 1,
    prompt: "Which languages is the team already comfortable with?",
    promptTechnical: "Which languages should bias the stack?",
    helper:
      "Pick every language you would rather not relearn. “No preference” is fine.",
    showWhen: { questionId: "role", anyOf: ["developer", "lead"] },
    options: [
      { id: "typescript", label: "TypeScript / JavaScript" },
      { id: "python", label: "Python" },
      { id: "go", label: "Go" },
      { id: "java", label: "Java / Kotlin" },
      { id: "csharp", label: "C# / .NET" },
      { id: "ruby", label: "Ruby" },
      { id: "php", label: "PHP" },
      { id: "rust", label: "Rust" },
      { id: "swift", label: "Swift" },
      { id: "dart", label: "Dart" },
      { id: "elixir", label: "Elixir" },
      { id: "none", label: "No preference", exclusive: true },
    ],
  },
  {
    id: "product",
    section: "what",
    kind: "single",
    prompt: "What are you building?",
    helper:
      "Pick the closest match. You can still get a full stack if the product spans more than one box.",
    options: [
      {
        id: "website",
        label: "Website",
        description:
          "Marketing site, blog, docs, or brochure — mostly public pages.",
      },
      {
        id: "webapp",
        label: "Web app",
        description: "People sign in. Dashboards, SaaS, portals.",
      },
      {
        id: "mobile",
        label: "Mobile app",
        description: "iOS, Android, or both.",
      },
      {
        id: "web-mobile",
        label: "Web and mobile",
        description: "Same product on phones and in the browser.",
      },
      {
        id: "desktop",
        label: "Desktop app",
        description: "Windows, macOS, or Linux software people install.",
      },
      {
        id: "api",
        label: "API or backend only",
        description: "Other apps will call this. No product UI yet.",
      },
      {
        id: "realtime",
        label: "Realtime collaboration or chat",
        description: "Live presence, documents, rooms, or messaging.",
      },
      {
        id: "store",
        label: "Online store",
        description: "Catalog, cart, and checkout.",
      },
      {
        id: "analytics",
        label: "Data or analytics platform",
        description: "Pipelines, warehouses, or reporting.",
      },
      {
        id: "internal",
        label: "Internal tool",
        description: "Admin, ops, or company-only software.",
      },
      {
        id: "ai",
        label: "AI-powered product",
        description:
          "The main value is generating, searching, or chatting with models.",
      },
    ],
  },
  {
    id: "platforms",
    section: "what",
    kind: "multi",
    minSelections: 1,
    prompt: "Which devices must it run on?",
    helper: "Pick every surface that is required for version one.",
    showWhen: {
      questionId: "product",
      anyOf: ["mobile", "web-mobile", "desktop"],
    },
    options: [
      { id: "ios", label: "iPhone / iPad" },
      { id: "android", label: "Android" },
      { id: "windows", label: "Windows" },
      { id: "macos", label: "macOS" },
      { id: "linux", label: "Linux" },
      { id: "browser", label: "Web browser" },
    ],
  },
  {
    id: "nativeDepth",
    section: "what",
    kind: "single",
    prompt: "How deep does it need to go into the device?",
    promptTechnical: "How much native platform surface do you need?",
    helper: "This decides a shared codebase versus a native app.",
    showWhen: {
      questionId: "product",
      anyOf: ["mobile", "web-mobile", "desktop"],
    },
    options: [
      {
        id: "standard",
        label: "Standard screens and forms",
        description: "Lists, accounts, settings — typical app UI.",
      },
      {
        id: "device",
        label: "Camera, maps, or notifications",
        description: "Common device features, not exotic hardware.",
      },
      {
        id: "heavy",
        label: "Heavy device features",
        description:
          "Bluetooth, AR, background processing, or high-FPS graphics.",
      },
    ],
  },
  {
    id: "webKind",
    section: "what",
    kind: "single",
    prompt: "What kind of website or web app is this?",
    showWhen: {
      questionId: "product",
      anyOf: [
        "website",
        "webapp",
        "web-mobile",
        "store",
        "internal",
        "ai",
        "realtime",
      ],
    },
    options: [
      { id: "public", label: "Mostly public content" },
      { id: "logged-in", label: "Mostly a signed-in app" },
      { id: "both", label: "Public pages plus a signed-in app" },
      {
        id: "editor",
        label: "Editor-like and highly interactive",
        description: "Canvas, documents, design tools, or dense UI.",
      },
    ],
  },
  {
    id: "seo",
    section: "what",
    kind: "single",
    prompt: "Does Google (or other search engines) need to find these pages?",
    promptTechnical: "How important is server-rendered, crawlable HTML?",
    showWhen: {
      questionId: "product",
      anyOf: ["website", "webapp", "web-mobile", "store", "ai"],
    },
    options: [
      { id: "must", label: "Must be found on Google" },
      { id: "nice", label: "Nice to have" },
      { id: "none", label: "Not needed — it lives behind a login" },
    ],
  },
  {
    id: "realtime",
    section: "what",
    kind: "single",
    prompt: "Do people need to see updates instantly?",
    helper:
      "Think chat, live dashboards, co-editing, or games — not ordinary page refresh.",
    options: [
      { id: "none", label: "No — ordinary pages and forms are enough" },
      { id: "notify", label: "Notifications only (email, push, badges)" },
      {
        id: "live",
        label: "Live-updating screens",
        description: "Feeds, dashboards, presence indicators.",
      },
      {
        id: "collab",
        label: "Collaborative editing or chat",
      },
      {
        id: "multiplayer",
        label: "Low-latency multiplayer, audio, or video",
      },
    ],
  },
  {
    id: "offline",
    section: "what",
    kind: "single",
    prompt: "Must it work without a network connection?",
    showWhen: {
      any: [
        { questionId: "product", anyOf: ["mobile", "web-mobile", "desktop"] },
        { questionId: "webKind", anyOf: ["editor"] },
      ],
    },
    options: [
      { id: "sync", label: "Must work offline and sync later" },
      { id: "readonly", label: "Read-only offline is enough" },
      { id: "online", label: "Always online is fine" },
    ],
  },
  {
    id: "media",
    section: "what",
    kind: "single",
    prompt: "Will people upload files?",
    options: [
      { id: "none", label: "No uploads" },
      { id: "docs", label: "Images and documents" },
      { id: "video", label: "Video or large files" },
    ],
  },
  {
    id: "ai",
    section: "what",
    kind: "single",
    prompt: "Is AI part of the product?",
    options: [
      { id: "none", label: "No" },
      {
        id: "api",
        label: "We call an AI API",
        description: "OpenAI, Gemini, Anthropic, or similar.",
      },
      {
        id: "rag",
        label: "Search over our own documents",
        description: "Chat or search that cites your files (RAG).",
      },
      {
        id: "train",
        label: "We train or host our own models",
      },
    ],
  },
  {
    id: "dataShape",
    section: "data",
    kind: "single",
    prompt: "What does the information mostly look like?",
    helper:
      "If you are not sure, pick “Not sure” — we will default to a relational database, which fits most products.",
    promptTechnical: "What is the primary data model?",
    options: [
      {
        id: "relational",
        label: "Things that relate to each other",
        description: "Users, orders, invoices, permissions.",
      },
      {
        id: "document",
        label: "Flexible records that change shape",
        description: "JSON-like documents, CMS content, evolving schemas.",
      },
      {
        id: "timeseries",
        label: "Events or measurements over time",
        description: "Metrics, IoT, activity streams.",
      },
      {
        id: "graph",
        label: "Connections and networks",
        description: "Social graphs, recommendations, fraud rings.",
      },
      { id: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "dataVolume",
    section: "data",
    kind: "single",
    prompt: "How much data do you expect in a few years?",
    options: [
      { id: "small", label: "Small — fits on one laptop comfortably" },
      { id: "growing", label: "Growing to many gigabytes" },
      { id: "tb", label: "Terabytes or more" },
      { id: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "consistency",
    section: "data",
    kind: "single",
    prompt: "How strict does the data need to be?",
    promptTechnical: "What is your consistency requirement?",
    helperTechnical:
      "Strong consistency for money and inventory. Eventual consistency is fine for feeds and analytics.",
    showWhen: { questionId: "role", anyOf: ["developer", "lead"] },
    options: [
      {
        id: "strong",
        label: "Money or inventory must be exactly right",
      },
      {
        id: "eventual",
        label: "Eventual consistency is fine",
      },
      { id: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "search",
    section: "data",
    kind: "single",
    prompt: "Do people need to search inside your content?",
    options: [
      { id: "none", label: "No" },
      { id: "filter", label: "Basic filtering (status, date, category)" },
      {
        id: "fulltext",
        label: "Full-text search with typos and ranking",
      },
    ],
  },
  {
    id: "analytics",
    section: "data",
    kind: "single",
    prompt: "Do you need reporting or analytics?",
    options: [
      { id: "none", label: "No" },
      { id: "simple", label: "Simple dashboards" },
      {
        id: "bi",
        label: "Business intelligence over large data",
      },
    ],
  },
  {
    id: "scaleYear1",
    section: "scale",
    kind: "single",
    prompt: "How many people (or equivalent API calls) in year one?",
    helper: "Guess. We will still plan a path toward much larger scale.",
    options: [
      { id: "under-1k", label: "Under 1,000" },
      { id: "1k-10k", label: "1,000–10,000" },
      { id: "10k-100k", label: "10,000–100,000" },
      { id: "100k-1m", label: "100,000–1 million" },
      { id: "1m-plus", label: "1 million+" },
    ],
  },
  {
    id: "scaleAmbition",
    section: "scale",
    kind: "single",
    prompt: "If this works, how large could it become?",
    helper:
      "This does not pick an expensive stack on day one. It shapes the 1 million → 1 billion story.",
    options: [
      { id: "local", label: "Small and local" },
      { id: "national", label: "National" },
      { id: "global", label: "Global, 100 million+ people" },
      { id: "billion", label: "Billion-scale target" },
    ],
  },
  {
    id: "trafficPattern",
    section: "scale",
    kind: "single",
    prompt: "How does traffic arrive?",
    options: [
      { id: "steady", label: "Fairly steady" },
      { id: "spiky", label: "Spiky — launches, events, or viral moments" },
      { id: "batch", label: "Mostly batch or scheduled work" },
    ],
  },
  {
    id: "geo",
    section: "scale",
    kind: "single",
    prompt: "Where are the users?",
    options: [
      { id: "one-region", label: "One country or region" },
      { id: "multi-region", label: "Several regions" },
      {
        id: "worldwide",
        label: "Worldwide, and latency matters",
      },
    ],
  },
  {
    id: "readWrite",
    section: "scale",
    kind: "single",
    prompt: "Is the product more about reading or writing?",
    promptTechnical: "Read/write mix?",
    showWhen: { questionId: "role", anyOf: ["developer", "lead"] },
    options: [
      { id: "read-heavy", label: "Read-heavy" },
      { id: "write-heavy", label: "Write-heavy" },
      { id: "balanced", label: "Balanced" },
    ],
  },
  {
    id: "budget",
    section: "constraints",
    kind: "single",
    prompt: "Monthly infrastructure budget?",
    helper: "Tools and hosting, not salaries.",
    options: [
      { id: "zero", label: "$0 — free tiers only" },
      { id: "under-50", label: "Under $50" },
      { id: "50-500", label: "$50–500" },
      { id: "500-5k", label: "$500–5,000" },
      { id: "enterprise", label: "Enterprise — cost is not the constraint" },
    ],
  },
  {
    id: "timeline",
    section: "constraints",
    kind: "single",
    prompt: "When does the first version need to exist?",
    options: [
      { id: "days", label: "Days — a prototype" },
      { id: "1-3-months", label: "1–3 months" },
      { id: "6-months", label: "6+ months" },
    ],
  },
  {
    id: "compliance",
    section: "constraints",
    kind: "multi",
    minSelections: 1,
    prompt: "Any rules about data or industry?",
    helper:
      "Pick every rule that applies. “None” is the usual answer for an early product.",
    options: [
      { id: "none", label: "None of these", exclusive: true },
      { id: "gdpr", label: "GDPR" },
      { id: "hipaa", label: "HIPAA" },
      { id: "soc2", label: "SOC 2" },
      { id: "pci", label: "PCI — we store or process card data ourselves" },
      { id: "residency", label: "Data must stay in a specific country" },
    ],
  },
  {
    id: "ops",
    section: "constraints",
    kind: "single",
    prompt: "Who will keep the servers healthy?",
    options: [
      {
        id: "none",
        label: "Nobody — we should not manage servers",
      },
      {
        id: "light",
        label: "A developer can do light operations",
      },
      {
        id: "dedicated",
        label: "A dedicated DevOps or platform team",
      },
    ],
  },
  {
    id: "deployPreference",
    section: "constraints",
    kind: "single",
    prompt: "How do you want to host it?",
    options: [
      { id: "serverless", label: "Fully managed, no servers to think about" },
      { id: "paas", label: "Managed platform (PaaS)" },
      { id: "cloud", label: "Our own cloud account (AWS, GCP, Azure)" },
      { id: "self-hosted", label: "Self-hosted or on-premises" },
      { id: "unsure", label: "No preference" },
    ],
  },
  {
    id: "existingCloud",
    section: "constraints",
    kind: "multi",
    minSelections: 1,
    prompt: "Are you already tied to a cloud or vendor?",
    options: [
      { id: "none", label: "None", exclusive: true },
      { id: "aws", label: "AWS" },
      { id: "gcp", label: "Google Cloud" },
      { id: "azure", label: "Azure" },
      { id: "cloudflare", label: "Cloudflare" },
      { id: "microsoft", label: "Microsoft shop (.NET, Active Directory)" },
    ],
  },
  {
    id: "lockIn",
    section: "constraints",
    kind: "single",
    prompt: "How do you feel about vendor lock-in?",
    helper:
      "A hosted backend can ship faster. Open-source stacks are easier to move later.",
    options: [
      {
        id: "ok",
        label: "Fine with a vendor-managed backend if it ships faster",
      },
      {
        id: "portable",
        label: "Prefer open-source and portable",
      },
      { id: "unsure", label: "No preference" },
    ],
  },
  {
    id: "auth",
    section: "integrations",
    kind: "single",
    prompt: "How will people sign in?",
    options: [
      { id: "none", label: "No accounts" },
      { id: "email", label: "Email and password" },
      { id: "social", label: "Social login (Google, Apple, GitHub…)" },
      { id: "sso", label: "Enterprise SSO (SAML, Okta)" },
      { id: "passwordless", label: "Passwordless or magic links" },
    ],
  },
  {
    id: "payments",
    section: "integrations",
    kind: "single",
    prompt: "Do you take money?",
    options: [
      { id: "none", label: "No" },
      { id: "once", label: "One-time payments" },
      { id: "subscriptions", label: "Subscriptions" },
      { id: "marketplace", label: "Marketplace payouts" },
      { id: "iap", label: "In-app purchases (App Store / Play)" },
      { id: "regional", label: "Regional gateways (UPI, local cards, etc.)" },
    ],
  },
  {
    id: "integrations",
    section: "integrations",
    kind: "multi",
    minSelections: 1,
    prompt: "Which extra pieces does version one need?",
    helper: "Skip anything you can add later.",
    options: [
      { id: "none", label: "None of these", exclusive: true },
      { id: "email", label: "Transactional email" },
      { id: "push", label: "SMS or push notifications" },
      { id: "jobs", label: "Background jobs and scheduling" },
      { id: "maps", label: "Maps" },
      { id: "cms", label: "CMS for marketing content" },
      { id: "video", label: "Video streaming" },
      { id: "webhooks", label: "Webhooks to other systems" },
      { id: "analytics", label: "Product analytics" },
    ],
  },
  {
    id: "observability",
    section: "integrations",
    kind: "multi",
    minSelections: 1,
    prompt: "What do you want to see in production from day one?",
    promptTechnical: "Observability for v1?",
    showWhen: { questionId: "role", anyOf: ["developer", "lead"] },
    options: [
      { id: "errors", label: "Error tracking" },
      { id: "metrics", label: "Metrics and tracing" },
      { id: "none", label: "Not now", exclusive: true },
    ],
  },
];

export const QUESTIONS_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((question) => [question.id, question]),
);

function showWhen(condition: Question["showWhen"], answers: Answers) {
  return evaluateCondition(
    condition,
    answers,
    undefined,
    (id) => QUESTIONS_BY_ID[id],
  );
}

export function getQuestion(id: string): Question {
  const question = QUESTIONS_BY_ID[id];
  if (!question) {
    throw new Error(`Unknown question id: ${id}`);
  }
  return question;
}

export function findOptionLabel(
  questionId: string,
  optionId: string,
): string | undefined {
  return QUESTIONS_BY_ID[questionId]?.options.find(
    (option) => option.id === optionId,
  )?.label;
}

export function isQuestionVisible(
  question: Question,
  answers: Answers,
): boolean {
  return showWhen(question.showWhen, answers) !== false;
}

export function pruneHiddenAnswers(answers: Answers): Answers {
  const next: Answers = { ...answers };
  for (const question of QUESTIONS) {
    if (showWhen(question.showWhen, next) === false) {
      delete next[question.id];
    }
  }
  return next;
}

/**
 * Walks questions in array order. Hidden questions (`showWhen` is false)
 * are omitted. Undecided `showWhen` still appears so progress can grow.
 */
export function walkQuestionTree(answers: Answers = {}): QuestionWalk {
  const resolved: Answers = { ...answers };
  const visible: Question[] = [];

  for (const question of QUESTIONS) {
    const visibility = showWhen(question.showWhen, resolved);
    if (visibility === false) {
      continue;
    }
    visible.push(question);
    if (!resolved[question.id]) {
      return { visible, pending: question, complete: false, resolved };
    }
  }

  return { visible, pending: null, complete: true, resolved };
}

export function getWizardProgress(answers: Answers): WizardProgress {
  const walk = walkQuestionTree(answers);
  const candidate = QUESTIONS.filter(
    (question) => showWhen(question.showWhen, answers) !== false,
  );
  const answered = candidate.filter((question) =>
    Boolean(answers[question.id]),
  ).length;
  const total = candidate.length;
  const current = walk.pending ?? walk.visible[walk.visible.length - 1] ?? null;
  const section: SectionId | null = current?.section ?? null;
  const sectionQuestions = candidate.filter(
    (question) => question.section === section,
  );
  const sectionStep = current
    ? sectionQuestions.findIndex((question) => question.id === current.id) + 1
    : sectionQuestions.length;
  const sectionIdIndex = section ? SECTION_IDS.indexOf(section) : 0;

  return {
    step: walk.complete ? total : answered + 1,
    total,
    answered,
    ratio: total === 0 ? 0 : answered / total,
    section,
    sectionIndex: sectionIdIndex + 1,
    sectionTotal: SECTION_IDS.length,
    sectionStep: Math.max(sectionStep, 1),
    sectionCount: Math.max(sectionQuestions.length, 1),
  };
}

export function questionCopy(
  question: Question,
  role: string | undefined,
): { prompt: string; helper?: string } {
  const technical = role === "developer" || role === "lead";
  return {
    prompt:
      technical && question.promptTechnical
        ? question.promptTechnical
        : question.prompt,
    helper:
      technical && question.helperTechnical
        ? question.helperTechnical
        : question.helper,
  };
}
