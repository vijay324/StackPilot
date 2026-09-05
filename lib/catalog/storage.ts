import type { Component } from "@/lib/types";
import { meta, rule, scaling } from "./helpers";

export const STORAGE: Component[] = [
  {
    id: "s3",
    layer: "storage",
    name: "Amazon S3",
    summary:
      "The default object store. Use directly on AWS, or S3-compatible APIs elsewhere.",
    plainSummary: "The standard place to put files in the cloud.",
    tags: ["storage", "aws"],
    rules: [
      rule(
        { field: "media", anyOf: ["docs", "video"] },
        3,
        "Object storage is the file plane.",
      ),
      rule({ field: "existingCloud", includes: "aws" }, 3, "S3 is native AWS."),
      rule({ field: "media", is: "none" }, "exclude", "No uploads."),
    ],
    scaling: scaling(
      "One bucket and presigned URLs.",
      "Lifecycle rules and CloudFront.",
      "This already is a 1B-object store; watch request patterns.",
    ),
    pros: ["Durability.", "Ecosystem."],
    cons: ["AWS account required for the real thing."],
    meta: meta(3, 3, false, ["https://docs.aws.amazon.com/s3/"]),
  },
  {
    id: "r2",
    layer: "storage",
    name: "Cloudflare R2",
    summary:
      "S3-compatible object store with no egress fees. Natural with Workers.",
    plainSummary:
      "Cloudflare’s file storage — often cheaper to serve files from.",
    tags: ["storage"],
    synergy: [
      {
        with: "cloudflare-workers",
        bonus: 2,
        reason: "R2 is on the Cloudflare network.",
      },
    ],
    rules: [
      rule(
        { field: "media", anyOf: ["docs", "video"] },
        2,
        "Object storage for uploads.",
      ),
      rule(
        { field: "existingCloud", includes: "cloudflare" },
        3,
        "Stay on Cloudflare.",
      ),
      rule({ field: "media", is: "none" }, "exclude", "No uploads."),
    ],
    scaling: scaling(
      "One R2 bucket.",
      "Custom domains and cache.",
      "This already is a global object store.",
    ),
    pros: ["No egress tax.", "S3 API."],
    cons: ["Younger ecosystem than S3."],
    meta: meta(2, 3, false, ["https://developers.cloudflare.com/r2/"]),
  },
  {
    id: "gcs",
    layer: "storage",
    name: "Google Cloud Storage",
    summary: "GCS buckets on GCP.",
    plainSummary: "Google Cloud’s file storage.",
    tags: ["storage", "gcp"],
    rules: [
      rule(
        { field: "existingCloud", includes: "gcp" },
        3,
        "GCS is native GCP.",
      ),
      rule({ field: "media", anyOf: ["docs", "video"] }, 2, "Object storage."),
      rule({ field: "media", is: "none" }, "exclude", "No uploads."),
    ],
    scaling: scaling(
      "One bucket.",
      "CDN and lifecycle.",
      "This already scales.",
    ),
    pros: ["GCP-native."],
    cons: ["GCP account."],
    meta: meta(3, 3, false, ["https://cloud.google.com/storage/docs"]),
  },
  {
    id: "supabase-storage",
    layer: "storage",
    name: "Supabase Storage",
    summary:
      "S3-compatible storage with RLS. Best when the backend is already Supabase.",
    plainSummary: "File uploads that come with Supabase.",
    tags: ["storage", "baas"],
    synergy: [{ with: "supabase", bonus: 3, reason: "Storage is included." }],
    rules: [
      rule(
        { field: "media", anyOf: ["docs", "video"] },
        2,
        "You need uploads.",
      ),
      rule({ field: "media", is: "none" }, "exclude", "No uploads."),
      rule(
        { field: "ops", anyOf: ["none", "light"] },
        1,
        "Storage is included instead of a second vendor.",
      ),
    ],
    scaling: scaling(
      "One bucket and RLS.",
      "Image transforms; CDN in front.",
      "Move huge video libraries to a media CDN.",
    ),
    pros: ["RLS.", "Included."],
    cons: ["Not a media platform."],
    meta: meta(3, 3, true, ["https://supabase.com/docs/guides/storage"]),
  },
  {
    id: "cloudinary",
    layer: "storage",
    name: "Cloudinary",
    summary:
      "Image/video pipeline: upload, transform, CDN. Buy this when media is the product surface.",
    plainSummary:
      "A specialist for images (resize, crop, CDN) so you do not build that yourself.",
    tags: ["storage", "low-ops"],
    rules: [
      rule({ field: "media", is: "docs" }, 2, "On-the-fly image transforms."),
      rule(
        { field: "media", is: "video" },
        1,
        "Video is possible; Mux may fit better.",
      ),
      rule({ field: "media", is: "none" }, "exclude", "No uploads."),
    ],
    scaling: scaling(
      "Unsigned or signed uploads.",
      "Eager transforms and named presets.",
      "Watch transformation cost at huge media volume.",
    ),
    pros: ["Transforms.", "CDN."],
    cons: ["Usage pricing."],
    meta: meta(2, 3, false, ["https://cloudinary.com/documentation"]),
  },
  {
    id: "mux",
    layer: "storage",
    name: "Mux",
    summary:
      "Managed video encode and streaming. Right when video is a product feature.",
    plainSummary: "A specialist that prepares and streams video for you.",
    tags: ["storage", "low-ops"],
    rules: [
      rule({ field: "media", is: "video" }, 3, "Mux is a video platform."),
      rule(
        { field: "integrations", includes: "video" },
        3,
        "You asked for video streaming.",
      ),
      rule({ field: "media", is: "none" }, "exclude", "No uploads."),
      rule({ field: "media", is: "docs" }, -2, "Overkill for images/PDFs."),
    ],
    scaling: scaling(
      "Direct uploads and Mux Player.",
      "Signed playback and webhooks.",
      "This is a known streaming shape; origin is Mux’s problem.",
    ),
    pros: ["Encoding.", "Playback."],
    cons: ["Cost.", "Another vendor."],
    meta: meta(2, 3, false, ["https://docs.mux.com/"]),
  },
];
