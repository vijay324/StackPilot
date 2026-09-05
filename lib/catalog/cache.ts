import type { Component } from "@/lib/types";
import { meta, rule, scaling } from "./helpers";

export const CACHE: Component[] = [
  {
    id: "redis",
    layer: "cache",
    name: "Redis",
    summary:
      "In-memory cache, sessions, rate limits, and lightweight pub/sub. Upstash, ElastiCache, or Valkey.",
    plainSummary:
      "A very fast helper store that remembers popular data so the main database does less work.",
    tags: ["cache", "hyperscale"],
    synergy: [
      {
        with: "go",
        bonus: 1,
        reason: "Redis is the usual cache next to Go services.",
      },
      {
        with: "django",
        bonus: 1,
        reason: "Django cache and Channels often use Redis.",
      },
    ],
    rules: [
      rule(
        { field: "scaleYear1", anyOf: ["10k-100k", "100k-1m", "1m-plus"] },
        3,
        "At this size, a cache in front of the database is expected.",
      ),
      rule(
        { field: "readWrite", is: "read-heavy" },
        3,
        "Caches pay off when most traffic is reads.",
      ),
      rule(
        { field: "realtime", anyOf: ["live", "collab"] },
        2,
        "Pub/sub and presence often live in Redis.",
      ),
      rule(
        { field: "scaleYear1", is: "under-1k" },
        -1,
        "You can skip Redis at tiny scale.",
      ),
    ],
    scaling: scaling(
      "A single managed Redis (Upstash or ElastiCache).",
      "Cluster mode and key TTLs as a policy.",
      "Shard by keyspace; do not treat Redis as the system of record.",
    ),
    pros: ["Versatile.", "Huge ecosystem."],
    cons: ["Memory cost.", "Not durable source of truth."],
    meta: meta(3, 3, true, ["https://redis.io/docs/"]),
  },
  {
    id: "memcached",
    layer: "cache",
    name: "Memcached",
    summary:
      "Simple distributed memory cache. Less features than Redis; still fine for HTML fragments.",
    plainSummary:
      "A simple memory cache — fewer features than Redis, still useful.",
    tags: ["cache"],
    rules: [
      rule(
        { field: "readWrite", is: "read-heavy" },
        2,
        "Fragment and object caching.",
      ),
      rule(
        { field: "realtime", anyOf: ["live", "collab"] },
        -2,
        "No pub/sub story vs Redis.",
      ),
      rule(
        { field: "scaleYear1", is: "under-1k" },
        -1,
        "Skip until you measure.",
      ),
    ],
    scaling: scaling(
      "One Memcached box or Elasticache.",
      "Consistent hashing across nodes.",
      "Still just a cache — scale the database separately.",
    ),
    pros: ["Simple.", "Predictable."],
    cons: ["No data structures or pub/sub."],
    meta: meta(2, 3, true, ["https://memcached.org/"]),
  },
];

export const CDN: Component[] = [
  {
    id: "cloudflare-cdn",
    layer: "cdn",
    name: "Cloudflare CDN",
    summary:
      "Global CDN, DNS, WAF. Default for public websites regardless of origin host.",
    plainSummary:
      "A worldwide cache in front of your site so pages load faster and survive traffic spikes.",
    tags: ["cdn", "low-ops"],
    synergy: [
      {
        with: "cloudflare-workers",
        bonus: 2,
        reason: "Same network as Workers.",
      },
    ],
    rules: [
      rule(
        {
          field: "product",
          anyOf: ["website", "webapp", "store", "web-mobile"],
        },
        3,
        "Public web assets belong on a CDN.",
      ),
      rule(
        { field: "geo", anyOf: ["multi-region", "worldwide"] },
        3,
        "PoPs reduce latency.",
      ),
      rule(
        { field: "existingCloud", includes: "cloudflare" },
        3,
        "You already use Cloudflare.",
      ),
      rule(
        { field: "trafficPattern", is: "spiky" },
        2,
        "Edge cache absorbs spikes.",
      ),
    ],
    scaling: scaling(
      "Proxy DNS through Cloudflare on the free plan.",
      "Cache rules, image resize, WAF.",
      "This network already is global; origin scale is the remaining problem.",
    ),
    pros: ["Free tier.", "WAF and DNS included."],
    cons: ["Another vendor in the path."],
    meta: meta(3, 3, false, ["https://developers.cloudflare.com/cache/"]),
  },
  {
    id: "cloudfront",
    layer: "cdn",
    name: "Amazon CloudFront",
    summary: "AWS CDN. Correct when origins already live in AWS.",
    plainSummary:
      "Amazon’s worldwide cache — natural if your app already runs on AWS.",
    tags: ["cdn", "aws"],
    rules: [
      rule(
        { field: "existingCloud", includes: "aws" },
        3,
        "CloudFront is the AWS CDN.",
      ),
      rule(
        { field: "product", anyOf: ["website", "webapp", "store"] },
        2,
        "Static and origin-shielded apps.",
      ),
      rule(
        { field: "existingCloud", includes: "azure" },
        -2,
        "Use Azure Front Door in a Microsoft shop.",
      ),
    ],
    scaling: scaling(
      "One distribution in front of S3 or ALB.",
      "Origin groups and WAF.",
      "Regional caches plus multi-origin.",
    ),
    pros: ["AWS integration."],
    cons: ["Clumsier DX than Cloudflare for many teams."],
    meta: meta(3, 3, false, ["https://docs.aws.amazon.com/cloudfront/"]),
  },
  {
    id: "host-cdn",
    layer: "cdn",
    name: "Platform CDN (Vercel / Netlify / Azure Front Door)",
    summary:
      "Use the CDN that ships with the host instead of adding another vendor.",
    plainSummary:
      "The host already includes a worldwide cache — no extra product to buy yet.",
    tags: ["cdn", "low-ops"],
    synergy: [
      { with: "vercel", bonus: 3, reason: "Vercel Edge is included." },
      { with: "netlify", bonus: 2, reason: "Netlify CDN is included." },
      {
        with: "azure-app",
        bonus: 1,
        reason: "Front Door can sit in front of Azure apps.",
      },
    ],
    rules: [
      rule(
        { field: "ops", is: "none" },
        3,
        "Do not add a CDN vendor you must also operate.",
      ),
      rule(
        { field: "deployPreference", is: "serverless" },
        2,
        "The platform CDN is enough at the start.",
      ),
      rule(
        { field: "existingCloud", includes: "cloudflare" },
        -1,
        "You may already want Cloudflare in front.",
      ),
    ],
    scaling: scaling(
      "Keep the platform CDN.",
      "Add cache headers and ISR/ISR-equivalents.",
      "Put a dedicated CDN/WAF in front when you leave the platform.",
    ),
    pros: ["Zero extra vendors."],
    cons: ["Less control than Cloudflare/CloudFront."],
    meta: meta(3, 3, false, ["https://vercel.com/docs/edge-network"]),
  },
];
