export const PRODUCTS = [
  "web",
  "mobile",
  "api",
  "realtime",
  "pipeline",
] as const;
export type Product = (typeof PRODUCTS)[number];

export const SCALES = ["startup", "growth", "hyperscale"] as const;
export type Scale = (typeof SCALES)[number];

export const TEAMS = ["solo", "small", "experienced"] as const;
export type TeamExperience = (typeof TEAMS)[number];

export const BUDGETS = ["free", "low", "enterprise"] as const;
export type Budget = (typeof BUDGETS)[number];

export const REALTIME = ["yes", "no"] as const;
export type RealTimeNeed = (typeof REALTIME)[number];

export const DATA_TYPES = [
  "relational",
  "document",
  "both",
  "analytics",
] as const;
export type DataType = (typeof DATA_TYPES)[number];

export const DEPLOYMENTS = ["serverless", "self-hosted", "managed"] as const;
export type Deployment = (typeof DEPLOYMENTS)[number];

/** 0 = poor fit, 1 = possible, 2 = good, 3 = excellent */
export type Affinity = 0 | 1 | 2 | 3;

export const PROFILE_DIMENSIONS = [
  "product",
  "scale",
  "teamExperience",
  "budget",
  "realTime",
  "dataType",
  "deploymentPreference",
] as const;

export type ProfileDimension = (typeof PROFILE_DIMENSIONS)[number];

export interface UserProfile {
  product: Product;
  scale: Scale;
  teamExperience: TeamExperience;
  budget: Budget;
  realTime: RealTimeNeed;
  dataType: DataType;
  deploymentPreference: Deployment;
}

export interface StackProfile {
  product: Record<Product, Affinity>;
  scale: Record<Scale, Affinity>;
  teamExperience: Record<TeamExperience, Affinity>;
  budget: Record<Budget, Affinity>;
  realTime: Record<RealTimeNeed, Affinity>;
  dataType: Record<DataType, Affinity>;
  deploymentPreference: Record<Deployment, Affinity>;
}

export interface ScalingStory {
  to10k: string;
  to1m: string;
  to1b: string;
}

export interface Stack {
  id: string;
  name: string;
  summary: string;
  profile: StackProfile;
  pros: string[];
  cons: string[];
  scalingStory: ScalingStory;
}

/** questionId → optionId */
export type Answers = Record<string, string>;

export type ProfileMapping =
  | { dimension: "product"; value: Product }
  | { dimension: "scale"; value: Scale }
  | { dimension: "teamExperience"; value: TeamExperience }
  | { dimension: "budget"; value: Budget }
  | { dimension: "realTime"; value: RealTimeNeed }
  | { dimension: "dataType"; value: DataType }
  | { dimension: "deploymentPreference"; value: Deployment };

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  mapsTo: ProfileMapping;
  /** Override the question's default next id */
  next?: string | null;
}

export interface SkipRule {
  questionId: string;
  optionIds: string[];
  implicitAnswer: string;
}

export interface Question {
  id: string;
  prompt: string;
  helper?: string;
  options: QuestionOption[];
  /** Default next question id, or null to finish */
  next: string | null;
  skipWhen?: SkipRule[];
}

export interface MatchReason {
  dimension: ProfileDimension;
  questionId: string;
  optionId: string;
  optionLabel: string;
  affinity: Affinity;
  detail: string;
}

export interface ScoredStack {
  stack: Stack;
  score: number;
  reasons: MatchReason[];
}

export interface RecommendationResult {
  winner: ScoredStack;
  runnersUp: ScoredStack[];
  ranked: ScoredStack[];
  profile: UserProfile;
  answers: Answers;
}

export interface QuestionWalk {
  visible: Question[];
  pending: Question | null;
  complete: boolean;
  resolved: Answers;
}
