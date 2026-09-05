import { COMPONENTS } from "@/lib/catalog";
import {
  isDeveloperRole,
  needsDesktop,
  needsMobile,
  needsWeb,
  scaleAtLeast,
} from "@/lib/engine/profile";
import {
  compareScored,
  type Perspective,
  scoreComponent,
} from "@/lib/engine/score";
import { PRESETS } from "@/lib/presets";
import type {
  AssembledStack,
  ChosenLayer,
  Component,
  Layer,
  Profile,
  ScalingStory,
  ScoredComponent,
} from "@/lib/types";
import { ASSEMBLY_ORDER, LAYER_LABELS } from "@/lib/types";

function hasTag(component: Component, tag: string): boolean {
  return (component.tags ?? []).includes(tag);
}

function isSidecar(component: Component): boolean {
  return hasTag(component, "sidecar");
}

export function selectLayers(profile: Profile): Layer[] {
  const layers: Layer[] = [];
  const web = needsWeb(profile.product) && profile.product !== "api";
  const mobile =
    needsMobile(profile.product) ||
    profile.platforms.includes("ios") ||
    profile.platforms.includes("android");
  const desktop =
    needsDesktop(profile.product) ||
    profile.platforms.some((item) =>
      ["windows", "macos", "linux"].includes(item),
    );

  if (web) {
    layers.push("webFrontend");
  }
  if (mobile && profile.product !== "api" && profile.product !== "website") {
    layers.push("mobileFrontend");
  }
  if (desktop && profile.product === "desktop") {
    layers.push("desktopFrontend");
  }

  const staticSite =
    profile.product === "website" &&
    profile.auth === "none" &&
    profile.payments === "none";

  layers.push("backend");

  if (!staticSite || profile.product !== "website") {
    layers.push("database");
  } else if (profile.auth !== "none") {
    layers.push("database");
  }

  layers.push("hosting");

  if (
    scaleAtLeast(profile.scaleYear1, "10k-100k") ||
    profile.readWrite === "read-heavy" ||
    ["live", "collab", "multiplayer"].includes(profile.realtime)
  ) {
    layers.push("cache");
  }

  if (web) {
    layers.push("cdn");
  }

  if (
    profile.integrations.includes("jobs") ||
    profile.payments !== "none" ||
    profile.integrations.includes("email") ||
    profile.trafficPattern === "spiky"
  ) {
    layers.push("queue");
  }

  if (["live", "collab", "multiplayer"].includes(profile.realtime)) {
    layers.push("realtimeTransport");
  }

  if (profile.search === "fulltext") {
    layers.push("search");
  }

  if (profile.ai === "rag" || profile.ai === "train") {
    layers.push("vector");
  }

  if (profile.analytics === "bi" || profile.product === "analytics") {
    layers.push("warehouse");
  }

  if (profile.auth !== "none") {
    layers.push("auth");
  }

  if (profile.media !== "none") {
    layers.push("storage");
  }

  if (profile.payments !== "none") {
    layers.push("payments");
  }

  if (
    profile.integrations.includes("email") ||
    profile.integrations.includes("push") ||
    profile.auth === "email" ||
    profile.auth === "passwordless"
  ) {
    layers.push("messaging");
  }

  if (layers.includes("mobileFrontend")) {
    layers.push("mobileDelivery");
  }

  if (
    isDeveloperRole(profile.role) &&
    (profile.observability.includes("errors") ||
      profile.observability.includes("metrics"))
  ) {
    layers.push("observability");
  }

  return ASSEMBLY_ORDER.filter((layer) => layers.includes(layer));
}

function tokenHits(
  token: string,
  ids: Set<string>,
  tags: Set<string>,
): boolean {
  if (token.startsWith("tag:")) {
    return tags.has(token.slice(4));
  }
  return ids.has(token);
}

export function isCompatible(
  component: Component,
  chosenIds: Set<string>,
  chosenTags: Set<string>,
): boolean {
  for (const item of component.requires ?? []) {
    if (!tokenHits(item, chosenIds, chosenTags)) {
      return false;
    }
  }
  for (const item of component.conflicts ?? []) {
    if (tokenHits(item, chosenIds, chosenTags)) {
      return false;
    }
  }
  return true;
}

function synergyBonus(
  component: Component,
  chosenIds: Set<string>,
  chosenTags: Set<string>,
): { bonus: number; reasons: string[] } {
  let bonus = 0;
  const reasons: string[] = [];
  for (const item of component.synergy ?? []) {
    if (
      tokenHits(item.with, chosenIds, chosenTags) ||
      chosenIds.has(item.with)
    ) {
      bonus += item.bonus;
      reasons.push(item.reason);
    }
  }
  return { bonus, reasons };
}

function pickForLayer(
  layer: Layer,
  scored: ScoredComponent[],
  chosenIds: Set<string>,
  chosenTags: Set<string>,
  allowSidecars = false,
): { chosen: ScoredComponent; alternatives: ScoredComponent[] } | null {
  const pool = scored
    .filter((item) => item.component.layer === layer)
    .filter((item) => !item.excluded)
    .filter((item) => allowSidecars || !isSidecar(item.component))
    .filter((item) => isCompatible(item.component, chosenIds, chosenTags))
    .map((item) => {
      const extra = synergyBonus(item.component, chosenIds, chosenTags);
      if (extra.reasons.length === 0) {
        return item;
      }
      return {
        ...item,
        rawScore: item.rawScore + extra.bonus,
        reasons: [
          ...extra.reasons.map(
            (reason) => ({ reason, score: extra.bonus as 1 | 2 | 3 }) as const,
          ),
          ...item.reasons,
        ],
      };
    })
    .sort((a, b) => b.rawScore - a.rawScore || compareScored(a, b));

  const winner = pool[0];
  if (!winner) {
    return null;
  }
  return { chosen: winner, alternatives: pool.slice(1, 3) };
}

function composeScaling(layers: ChosenLayer[]): ScalingStory {
  const take = (key: keyof ScalingStory) =>
    layers
      .slice(0, 6)
      .map(
        (item) =>
          `${item.chosen.component.name}: ${item.chosen.component.scaling[key]}`,
      )
      .join(" ");
  return {
    to10k: take("to10k"),
    to1m: take("to1m"),
    to1b: take("to1b"),
  };
}

function matchPreset(ids: string[]): (typeof PRESETS)[number] | undefined {
  let best: { preset: (typeof PRESETS)[number]; overlap: number } | undefined;
  const chosen = new Set(ids);
  for (const preset of PRESETS) {
    const overlap = preset.components.filter((id) => chosen.has(id)).length;
    const ratio = overlap / Math.max(preset.components.length, 1);
    if (ratio < 0.8) {
      continue;
    }
    if (!best || overlap > best.overlap) {
      best = { preset, overlap };
    }
  }
  return best?.preset;
}

function stackScore(layers: ChosenLayer[]): number {
  if (layers.length === 0) {
    return 0;
  }
  const sum = layers.reduce((acc, item) => acc + item.chosen.normalized, 0);
  return Math.round((sum / layers.length) * 10) / 10;
}

function toAssembled(
  layers: ChosenLayer[],
  perspective?: string,
): AssembledStack {
  const componentIds = layers.map((item) => item.chosen.component.id);
  const preset = matchPreset(componentIds);
  const title = preset?.name ?? "Your custom stack";
  const names = layers
    .filter((item) =>
      [
        "webFrontend",
        "mobileFrontend",
        "backend",
        "database",
        "hosting",
      ].includes(item.layer),
    )
    .map((item) => item.chosen.component.name);
  return {
    title,
    summary: preset?.narrative ?? names.join(" + "),
    plainSummary:
      preset?.plainNarrative ??
      `A stack built around ${names.slice(0, 4).join(", ")}.`,
    score: stackScore(layers),
    layers,
    componentIds,
    scaling: preset?.scaling ?? composeScaling(layers),
    presetId: preset?.id,
    perspective,
  };
}

function assemble(
  profile: Profile,
  layersWanted: Layer[],
  perspective: Perspective,
): ChosenLayer[] {
  const scored = COMPONENTS.map((component) =>
    scoreComponent(component, profile, perspective),
  );
  const chosenIds = new Set<string>();
  const chosenTags = new Set<string>();
  const result: ChosenLayer[] = [];

  for (const layer of layersWanted) {
    const pick = pickForLayer(layer, scored, chosenIds, chosenTags);
    if (!pick) {
      continue;
    }
    result.push({
      layer,
      chosen: pick.chosen,
      alternatives: pick.alternatives,
    });
    chosenIds.add(pick.chosen.component.id);
    for (const tag of pick.chosen.component.tags ?? []) {
      chosenTags.add(tag);
    }
  }

  if (layersWanted.includes("warehouse")) {
    const sidecars = scored
      .filter((item) => item.component.layer === "warehouse")
      .filter((item) => isSidecar(item.component) && !item.excluded)
      .filter((item) => isCompatible(item.component, chosenIds, chosenTags))
      .sort((a, b) => compareScored(a, b));
    for (const extra of sidecars.slice(0, 2)) {
      if (chosenIds.has(extra.component.id)) {
        continue;
      }
      result.push({
        layer: extra.component.layer,
        chosen: extra,
        alternatives: [],
      });
      chosenIds.add(extra.component.id);
    }
  }

  return result;
}

export function composeStack(
  profile: Profile,
  perspective: Perspective = "default",
): AssembledStack {
  const layersWanted = selectLayers(profile);
  const layers = assemble(profile, layersWanted, perspective);
  return toAssembled(
    layers,
    perspective === "default" ? undefined : perspective,
  );
}

function idSet(stack: AssembledStack): string {
  return [...stack.componentIds].sort().join(",");
}

export function perspectiveAlternatives(
  profile: Profile,
  best: AssembledStack,
): AssembledStack[] {
  const variants: AssembledStack[] = [
    composeStack(profile, "low-ops"),
    composeStack(profile, "portable"),
    composeStack(profile, "scale"),
  ];
  const unique = variants.filter((item) => idSet(item) !== idSet(best));
  unique.sort((a, b) => {
    const da = a.componentIds.filter(
      (id) => !best.componentIds.includes(id),
    ).length;
    const db = b.componentIds.filter(
      (id) => !best.componentIds.includes(id),
    ).length;
    return db - da || a.title.localeCompare(b.title);
  });
  const seen = new Set<string>();
  const out: AssembledStack[] = [];
  for (const item of unique) {
    const key = idSet(item);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push(item);
    if (out.length === 2) {
      break;
    }
  }
  return out;
}

export function layerHeadline(layer: Layer): string {
  return LAYER_LABELS[layer];
}
