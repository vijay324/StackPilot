export const SECTION_IDS = [
  "who",
  "what",
  "data",
  "scale",
  "constraints",
  "integrations",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_LABELS: Record<SectionId, string> = {
  who: "Who is building",
  what: "What you are building",
  data: "Data",
  scale: "Scale and traffic",
  constraints: "Constraints",
  integrations: "Integrations",
};

export const LAYERS = [
  "webFrontend",
  "mobileFrontend",
  "desktopFrontend",
  "backend",
  "database",
  "hosting",
  "cache",
  "cdn",
  "queue",
  "realtimeTransport",
  "search",
  "vector",
  "warehouse",
  "auth",
  "storage",
  "payments",
  "messaging",
  "mobileDelivery",
  "observability",
] as const;
export type Layer = (typeof LAYERS)[number];

export const LAYER_LABELS: Record<Layer, string> = {
  webFrontend: "Web frontend",
  mobileFrontend: "Mobile",
  desktopFrontend: "Desktop",
  backend: "Backend",
  database: "Database",
  hosting: "Deployment",
  cache: "Cache",
  cdn: "CDN",
  queue: "Jobs and queues",
  realtimeTransport: "Realtime",
  search: "Search",
  vector: "Vector search",
  warehouse: "Analytics warehouse",
  auth: "Authentication",
  storage: "File storage",
  payments: "Payments",
  messaging: "Messaging",
  mobileDelivery: "App store delivery",
  observability: "Observability",
};

export const ASSEMBLY_ORDER: Layer[] = [
  "webFrontend",
  "mobileFrontend",
  "desktopFrontend",
  "backend",
  "database",
  "hosting",
  "cache",
  "cdn",
  "queue",
  "realtimeTransport",
  "search",
  "vector",
  "warehouse",
  "auth",
  "storage",
  "payments",
  "messaging",
  "mobileDelivery",
  "observability",
];

/** questionId → optionId (multi-select joined with "+") */
export type Answers = Record<string, string>;

export type Ternary = true | false | "unknown";

export type Condition =
  | { questionId: string; anyOf: string[] }
  | {
      field: string;
      is?: string;
      anyOf?: string[];
      noneOf?: string[];
      includes?: string;
    }
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition };

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  /** Exclusive "none / no preference" for multi-select */
  exclusive?: boolean;
}

export interface Question {
  id: string;
  section: SectionId;
  kind: "single" | "multi";
  prompt: string;
  promptTechnical?: string;
  helper?: string;
  helperTechnical?: string;
  options: QuestionOption[];
  showWhen?: Condition;
  /** Multi only. Default 1; 0 allows empty. */
  minSelections?: number;
}

export interface QuestionWalk {
  visible: Question[];
  pending: Question | null;
  complete: boolean;
  resolved: Answers;
}

export interface Profile {
  role: string;
  team: string;
  languages: string[];
  product: string;
  platforms: string[];
  nativeDepth: string;
  webKind: string;
  seo: string;
  realtime: string;
  offline: string;
  media: string;
  ai: string;
  dataShape: string;
  dataVolume: string;
  consistency: string;
  search: string;
  analytics: string;
  scaleYear1: string;
  scaleAmbition: string;
  trafficPattern: string;
  geo: string;
  readWrite: string;
  budget: string;
  timeline: string;
  compliance: string[];
  ops: string;
  deployPreference: string;
  existingCloud: string[];
  lockIn: string;
  auth: string;
  payments: string;
  integrations: string[];
  observability: string[];
}

export type RuleScore = -3 | -2 | -1 | 1 | 2 | 3 | "exclude";

export interface FitRule {
  when: Condition;
  score: RuleScore;
  reason: string;
}

export interface ScalingStory {
  to10k: string;
  to1m: string;
  to1b: string;
}

export interface Component {
  id: string;
  layer: Layer;
  name: string;
  summary: string;
  plainSummary: string;
  rules: FitRule[];
  tags?: string[];
  requires?: string[];
  conflicts?: string[];
  synergy?: Array<{ with: string; bonus: number; reason: string }>;
  scaling: ScalingStory;
  pros: string[];
  cons: string[];
  meta: {
    hiringPool: 1 | 2 | 3;
    maturity: 1 | 2 | 3;
    openSource: boolean;
    lastReviewed: string;
    sources: string[];
  };
}

export interface FiredReason {
  reason: string;
  score: RuleScore;
}

export interface ScoredComponent {
  component: Component;
  excluded: boolean;
  rawScore: number;
  normalized: number;
  reasons: FiredReason[];
}

export interface ChosenLayer {
  layer: Layer;
  chosen: ScoredComponent;
  alternatives: ScoredComponent[];
}

export interface StackPreset {
  id: string;
  name: string;
  components: string[];
  narrative: string;
  plainNarrative: string;
  scaling: ScalingStory;
}

export interface AssembledStack {
  title: string;
  summary: string;
  plainSummary: string;
  score: number;
  layers: ChosenLayer[];
  componentIds: string[];
  scaling: ScalingStory;
  presetId?: string;
  perspective?: string;
}

export interface RecommendationResult {
  bestOverall: AssembledStack;
  alternatives: AssembledStack[];
  layers: ChosenLayer[];
  profile: Profile;
  answers: Answers;
}

export interface WizardProgress {
  step: number;
  total: number;
  answered: number;
  ratio: number;
  section: SectionId | null;
  sectionIndex: number;
  sectionTotal: number;
  sectionStep: number;
  sectionCount: number;
}
