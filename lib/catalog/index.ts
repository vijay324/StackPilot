import type { Component } from "@/lib/types";
import { AUTH } from "./auth";
import { BACKENDS } from "./backend";
import { CACHE, CDN } from "./cache";
import { DATABASES } from "./database";
import { DESKTOP_FRONTEND } from "./desktop";
import { WEB_FRONTEND } from "./frontend-web";
import { HOSTING } from "./hosting";
import { MOBILE_FRONTEND } from "./mobile";
import { MOBILE_DELIVERY, OBSERVABILITY } from "./mobile-delivery";
import { MESSAGING, PAYMENTS } from "./payments";
import { QUEUES } from "./queue";
import { REALTIME } from "./realtime";
import { SEARCH, VECTOR } from "./search";
import { STORAGE } from "./storage";
import { WAREHOUSE } from "./warehouse";

export const COMPONENTS: Component[] = [
  ...WEB_FRONTEND,
  ...MOBILE_FRONTEND,
  ...DESKTOP_FRONTEND,
  ...BACKENDS,
  ...DATABASES,
  ...HOSTING,
  ...CACHE,
  ...CDN,
  ...QUEUES,
  ...REALTIME,
  ...SEARCH,
  ...VECTOR,
  ...WAREHOUSE,
  ...AUTH,
  ...STORAGE,
  ...PAYMENTS,
  ...MESSAGING,
  ...MOBILE_DELIVERY,
  ...OBSERVABILITY,
];

export const COMPONENTS_BY_ID: Record<string, Component> = Object.fromEntries(
  COMPONENTS.map((component) => [component.id, component]),
);

export function getComponent(id: string): Component {
  const component = COMPONENTS_BY_ID[id];
  if (!component) {
    throw new Error(`Unknown component id: ${id}`);
  }
  return component;
}
