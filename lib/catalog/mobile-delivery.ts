import type { Component } from "@/lib/types";
import { meta, rule, scaling } from "./helpers";

export const MOBILE_DELIVERY: Component[] = [
  {
    id: "expo-eas",
    layer: "mobileDelivery",
    name: "Expo EAS",
    summary:
      "Cloud builds and store submit for Expo apps. The default if the client is Expo.",
    plainSummary:
      "A service that builds and uploads your Expo app to the App Store and Play Store.",
    tags: ["mobile"],
    synergy: [
      { with: "expo", bonus: 3, reason: "EAS is Expo’s build pipeline." },
    ],
    rules: [
      rule(
        { field: "product", anyOf: ["mobile", "web-mobile"] },
        2,
        "You need store builds.",
      ),
      rule(
        {
          field: "team",
          anyOf: ["solo-learning", "solo-experienced", "small"],
        },
        2,
        "EAS removes local native toolchains.",
      ),
      rule(
        { field: "timeline", anyOf: ["days", "1-3-months"] },
        1,
        "Cloud builds shorten the first store submission.",
      ),
    ],
    scaling: scaling(
      "EAS Build and Submit.",
      "EAS Update for OTA JS.",
      "Keep EAS; add native CI only for custom native modules.",
    ),
    pros: ["No local Xcode/Android Studio required for CI."],
    cons: ["Expo-centric."],
    meta: meta(3, 3, false, ["https://docs.expo.dev/eas/"]),
  },
  {
    id: "fastlane",
    layer: "mobileDelivery",
    name: "Fastlane",
    summary:
      "Scripted store screenshots, signing, and upload. Default for native iOS/Android.",
    plainSummary:
      "Scripts that package and upload native iPhone and Android apps.",
    tags: ["mobile"],
    synergy: [
      {
        with: "swiftui",
        bonus: 2,
        reason: "Fastlane is the usual native iOS CI.",
      },
      {
        with: "compose",
        bonus: 2,
        reason: "Fastlane is common for Play uploads.",
      },
    ],
    rules: [
      rule(
        { field: "nativeDepth", is: "heavy" },
        2,
        "Native apps need a native pipeline.",
      ),
      rule(
        { field: "languages", anyOf: ["swift", "java"] },
        2,
        "Native toolchains.",
      ),
      rule(
        { field: "product", anyOf: ["mobile", "web-mobile"] },
        1,
        "You still need store automation.",
      ),
    ],
    scaling: scaling(
      "Fastlane match/gym/supply on CI.",
      "More lanes per flavor.",
      "This remains the store automation layer.",
    ),
    pros: ["Battle-tested.", "Store APIs."],
    cons: ["Signing still hurts."],
    meta: meta(3, 3, true, ["https://docs.fastlane.tools/"]),
  },
  {
    id: "codemagic",
    layer: "mobileDelivery",
    name: "Codemagic",
    summary:
      "CI aimed at Flutter (and other mobile). Useful when you do not want to maintain Mac runners.",
    plainSummary: "A cloud build service popular with Flutter teams.",
    tags: ["mobile"],
    synergy: [
      {
        with: "flutter",
        bonus: 2,
        reason: "Codemagic is a common Flutter CI.",
      },
    ],
    rules: [
      rule({ field: "languages", includes: "dart" }, 2, "Flutter CI."),
      rule(
        { field: "product", anyOf: ["mobile", "web-mobile"] },
        1,
        "Store builds.",
      ),
      rule(
        { field: "ops", anyOf: ["none", "light"] },
        1,
        "You should not maintain your own Mac builders.",
      ),
    ],
    scaling: scaling(
      "Workflows per OS.",
      "Signing and store connect keys in the vault.",
      "Keep a mobile CI; the backend scales separately.",
    ),
    pros: ["Mac builders.", "Flutter DX."],
    cons: ["Another CI vendor."],
    meta: meta(2, 3, false, ["https://docs.codemagic.io/"]),
  },
  {
    id: "testflight",
    layer: "mobileDelivery",
    name: "TestFlight / Play Console",
    summary:
      "The stores themselves. Always in the path; listed so native-only teams do not miss distribution.",
    plainSummary:
      "Apple’s and Google’s official ways to test and ship the app.",
    tags: ["mobile"],
    synergy: [
      {
        with: "swiftui",
        bonus: 2,
        reason: "TestFlight is the iOS distribution path.",
      },
    ],
    rules: [
      rule(
        { field: "platforms", includes: "ios" },
        2,
        "TestFlight is required for iOS testing.",
      ),
      rule(
        { field: "platforms", includes: "android" },
        1,
        "Play Console is required for Android.",
      ),
      rule(
        { field: "product", anyOf: ["mobile", "web-mobile"] },
        1,
        "Stores are the distribution channel.",
      ),
    ],
    scaling: scaling(
      "Internal testing tracks.",
      "Staged rollouts.",
      "This remains the distribution plane forever.",
    ),
    pros: ["Official.", "Review and rollout."],
    cons: ["Review gates."],
    meta: meta(3, 3, false, [
      "https://developer.apple.com/testflight/",
      "https://support.google.com/googleplay/android-developer/",
    ]),
  },
];

export const OBSERVABILITY: Component[] = [
  {
    id: "sentry",
    layer: "observability",
    name: "Sentry",
    summary:
      "Error tracking with strong frontend and mobile SDKs. The usual first observability purchase.",
    plainSummary:
      "A service that tells you when the app crashes, with a trail of what the user did.",
    tags: ["observability", "low-ops"],
    rules: [
      rule(
        { field: "observability", includes: "errors" },
        3,
        "Sentry is error tracking.",
      ),
      rule(
        { field: "role", anyOf: ["developer", "lead"] },
        1,
        "Developers asked for production signal.",
      ),
      rule({ field: "observability", includes: "none" }, "exclude", "Not now."),
    ],
    scaling: scaling(
      "One project per app.",
      "Release health and performance.",
      "Keep Sentry for errors; traces may move to OTel/Datadog.",
    ),
    pros: ["DX.", "Session context."],
    cons: ["Event volume pricing."],
    meta: meta(3, 3, true, ["https://docs.sentry.io/"]),
  },
  {
    id: "otel",
    layer: "observability",
    name: "OpenTelemetry + Grafana",
    summary:
      "Vendor-neutral traces/metrics. Right when you want portable telemetry into Grafana/Tempo/Prometheus.",
    plainSummary:
      "An open way to collect performance data you can move between vendors.",
    tags: ["observability"],
    rules: [
      rule(
        { field: "observability", includes: "metrics" },
        3,
        "Metrics and tracing were requested.",
      ),
      rule(
        { field: "lockIn", is: "portable" },
        2,
        "OTel is the portable path.",
      ),
      rule(
        { field: "ops", is: "none" },
        -2,
        "You still need a place to store telemetry.",
      ),
    ],
    scaling: scaling(
      "Auto-instrumentation into Grafana Cloud.",
      "Tail sampling.",
      "This is a known hyperscale telemetry shape.",
    ),
    pros: ["Portable.", "Open."],
    cons: ["You assemble the backend."],
    meta: meta(2, 3, true, ["https://opentelemetry.io/docs/"]),
  },
  {
    id: "datadog",
    layer: "observability",
    name: "Datadog",
    summary:
      "Full-stack monitoring for enterprises already willing to pay for a single pane.",
    plainSummary:
      "An all-in-one monitoring product used by many larger companies.",
    tags: ["observability", "lock-in"],
    rules: [
      rule(
        { field: "observability", includes: "metrics" },
        2,
        "APM and metrics.",
      ),
      rule(
        { field: "budget", is: "enterprise" },
        3,
        "Datadog is priced for enterprise.",
      ),
      rule(
        { field: "budget", anyOf: ["zero", "under-50"] },
        -3,
        "You will hate the bill.",
      ),
      rule({ field: "observability", includes: "none" }, "exclude", "Not now."),
    ],
    scaling: scaling(
      "Agent on one service.",
      "Unified APM, logs, and RUM.",
      "This already scales; cost governance becomes the work.",
    ),
    pros: ["One product.", "Integrations."],
    cons: ["Cost.", "Lock-in."],
    meta: meta(3, 3, false, ["https://docs.datadoghq.com/"]),
  },
];
