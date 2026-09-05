import type { Component } from "@/lib/types";
import { freeBudget, meta, rule, scaling, tsLang } from "./helpers";

export const MOBILE_FRONTEND: Component[] = [
  {
    id: "expo",
    layer: "mobileFrontend",
    name: "React Native (Expo)",
    summary:
      "JavaScript/TypeScript mobile with one codebase for iOS and Android. Expo EAS makes store builds realistic for a small team.",
    plainSummary:
      "One project that becomes an iPhone and Android app, using the same language as many websites.",
    tags: ["typescript", "cross-platform", "low-ops"],
    synergy: [
      {
        with: "expo-eas",
        bonus: 3,
        reason: "EAS is the Expo build and submit pipeline.",
      },
      {
        with: "nextjs",
        bonus: 1,
        reason: "You can share TypeScript types with a Next.js web app.",
      },
      {
        with: "supabase",
        bonus: 2,
        reason: "Supabase client libraries are solid on Expo.",
      },
    ],
    rules: [
      rule(
        { field: "product", anyOf: ["mobile", "web-mobile"] },
        3,
        "Expo is a default cross-platform mobile choice.",
      ),
      rule(
        { field: "platforms", includes: "ios" },
        1,
        "iOS is a first-class Expo target.",
      ),
      rule(
        { field: "platforms", includes: "android" },
        1,
        "Android is a first-class Expo target.",
      ),
      rule(tsLang, 3, "The team can reuse TypeScript from the web."),
      rule(
        { field: "nativeDepth", is: "standard" },
        3,
        "Standard screens are Expo’s happy path.",
      ),
      rule(
        { field: "nativeDepth", is: "device" },
        2,
        "Camera, maps, and notifications are well covered.",
      ),
      rule(
        { field: "nativeDepth", is: "heavy" },
        -2,
        "Bluetooth, AR, or high-FPS work often needs native modules.",
      ),
      rule(
        { field: "offline", is: "sync" },
        1,
        "Local databases and background sync are possible, with care.",
      ),
      rule(
        {
          field: "team",
          anyOf: ["small", "solo-learning", "solo-experienced"],
        },
        2,
        "Expo removes most native toolchain pain for a small team.",
      ),
      rule(
        { all: [{ field: "platforms", noneOf: ["ios", "android"] }] },
        "exclude",
        "No mobile OS was selected.",
      ),
    ],
    scaling: scaling(
      "Expo app plus one backend project.",
      "EAS for CI, and tune native modules only where needed.",
      "Keep RN for clients; split backend reads and notifications.",
    ),
    pros: ["Shared TS with web.", "OTA updates via EAS."],
    cons: ["Performance-sensitive UI may still need native."],
    meta: meta(3, 3, true, ["https://docs.expo.dev/"]),
  },
  {
    id: "flutter",
    layer: "mobileFrontend",
    name: "Flutter",
    summary:
      "Dart UI toolkit with excellent consistency across iOS, Android, and optionally desktop/web.",
    plainSummary:
      "One codebase that looks the same on iPhone and Android, including custom visual design.",
    tags: ["cross-platform", "dart"],
    synergy: [
      {
        with: "firebase",
        bonus: 2,
        reason: "FlutterFire is a mature Firebase pairing.",
      },
      {
        with: "codemagic",
        bonus: 1,
        reason: "Codemagic is a common Flutter CI.",
      },
    ],
    rules: [
      rule(
        { field: "product", anyOf: ["mobile", "web-mobile"] },
        3,
        "Flutter is a strong cross-platform mobile toolkit.",
      ),
      rule(
        { field: "languages", includes: "dart" },
        3,
        "The team already writes Dart.",
      ),
      rule(
        { field: "nativeDepth", is: "standard" },
        2,
        "Custom UI is Flutter’s strength.",
      ),
      rule(
        { field: "nativeDepth", is: "heavy" },
        -1,
        "Heavy platform APIs still need native channels.",
      ),
      rule(
        tsLang,
        -1,
        "A TypeScript team usually prefers Expo unless UI fidelity demands Flutter.",
      ),
      rule(
        { all: [{ field: "platforms", noneOf: ["ios", "android"] }] },
        "exclude",
        "No mobile OS was selected.",
      ),
    ],
    scaling: scaling(
      "One Flutter app and a BaaS or simple API.",
      "Split flavors, and add CI for Play and App Store.",
      "Keep Flutter for clients; scale the backend independently.",
    ),
    pros: ["Pixel-consistent UI.", "Good performance for custom graphics."],
    cons: ["Dart is a new language for most JS/Python teams."],
    meta: meta(2, 3, true, ["https://docs.flutter.dev/"]),
  },
  {
    id: "swiftui",
    layer: "mobileFrontend",
    name: "SwiftUI (native iOS)",
    summary:
      "Apple’s native UI. Correct when iOS is the product and you need deep platform APIs.",
    plainSummary:
      "An iPhone and iPad app built the way Apple intends — best when you only need Apple devices.",
    tags: ["native", "ios"],
    synergy: [
      {
        with: "testflight",
        bonus: 2,
        reason: "TestFlight is the native iOS distribution path.",
      },
    ],
    rules: [
      rule(
        { field: "platforms", includes: "ios" },
        2,
        "SwiftUI is the native iOS UI.",
      ),
      rule(
        {
          all: [
            { field: "platforms", includes: "ios" },
            { not: { field: "platforms", includes: "android" } },
          ],
        },
        3,
        "iOS-only products should be native.",
      ),
      rule(
        { field: "nativeDepth", is: "heavy" },
        3,
        "Bluetooth, ARKit, background modes, and high-FPS UI belong in native.",
      ),
      rule(
        { field: "languages", includes: "swift" },
        3,
        "The team already writes Swift.",
      ),
      rule(
        { field: "platforms", includes: "android" },
        -2,
        "SwiftUI does not ship an Android client.",
      ),
      rule(
        { not: { field: "platforms", includes: "ios" } },
        "exclude",
        "SwiftUI cannot ship without iOS.",
      ),
    ],
    scaling: scaling(
      "One Xcode app and TestFlight.",
      "Modularize features; add a dedicated API.",
      "Keep native clients; scale the backend and edge independently.",
    ),
    pros: ["Best iOS integration.", "Highest performance ceiling."],
    cons: ["No Android from this codebase.", "Apple-only hiring."],
    meta: meta(2, 3, true, ["https://developer.apple.com/swiftui/"]),
  },
  {
    id: "compose",
    layer: "mobileFrontend",
    name: "Jetpack Compose (native Android)",
    summary:
      "Google’s native Kotlin UI. Correct when Android is the product or you need deep platform APIs.",
    plainSummary:
      "An Android app built with Google’s current toolkit — best when Android is the main device.",
    tags: ["native", "android"],
    rules: [
      rule(
        { field: "platforms", includes: "android" },
        2,
        "Compose is the native Android UI.",
      ),
      rule(
        {
          all: [
            { field: "platforms", includes: "android" },
            { not: { field: "platforms", includes: "ios" } },
          ],
        },
        3,
        "Android-only products should be native.",
      ),
      rule(
        { field: "nativeDepth", is: "heavy" },
        3,
        "Deep Android APIs are easier in Kotlin.",
      ),
      rule(
        { field: "languages", includes: "java" },
        3,
        "Kotlin/Java skills transfer.",
      ),
      rule(
        { not: { field: "platforms", includes: "android" } },
        "exclude",
        "Compose cannot ship without Android.",
      ),
    ],
    scaling: scaling(
      "One Android app on Play Console.",
      "Feature modules and a stable API.",
      "Keep native clients; scale backend separately.",
    ),
    pros: ["Best Android integration.", "Modern Kotlin UI."],
    cons: ["No iOS from this codebase."],
    meta: meta(2, 3, true, ["https://developer.android.com/compose"]),
  },
  {
    id: "kmp",
    layer: "mobileFrontend",
    name: "Kotlin Multiplatform",
    summary:
      "Share business logic in Kotlin while keeping native UIs. For teams that need iOS and Android without a web-view compromise.",
    plainSummary:
      "One shared engine for iPhone and Android, with each platform still looking native.",
    tags: ["cross-platform", "native"],
    rules: [
      rule(
        { field: "product", anyOf: ["mobile", "web-mobile"] },
        1,
        "KMP is a serious two-OS strategy.",
      ),
      rule(
        { field: "languages", includes: "java" },
        2,
        "Kotlin teams can share domain logic.",
      ),
      rule({ field: "nativeDepth", is: "heavy" }, 2, "Native UIs stay native."),
      rule(
        { field: "team", is: "solo-learning" },
        -3,
        "KMP is too much machinery for a first app.",
      ),
      rule(
        { all: [{ field: "platforms", noneOf: ["ios", "android"] }] },
        "exclude",
        "No mobile OS was selected.",
      ),
    ],
    scaling: scaling(
      "Shared module plus two thin UIs.",
      "Stable Gradle/Xcode pipeline and CI.",
      "Keep shared domain; scale backends independently.",
    ),
    pros: ["Native UI per OS.", "Shared domain logic."],
    cons: ["Two UI codebases to staff."],
    meta: meta(2, 2, true, ["https://kotlinlang.org/docs/multiplatform.html"]),
  },
  {
    id: "maui",
    layer: "mobileFrontend",
    name: ".NET MAUI",
    summary:
      "C# cross-platform UI for Microsoft shops that already live in Visual Studio and Azure.",
    plainSummary:
      "iPhone and Android apps written in C# — sensible if the company is already a Microsoft shop.",
    tags: ["dotnet", "cross-platform"],
    synergy: [
      { with: "aspnet", bonus: 2, reason: "Share C# models with ASP.NET." },
    ],
    rules: [
      rule(
        { field: "languages", includes: "csharp" },
        3,
        "C# is MAUI’s language.",
      ),
      rule(
        { field: "existingCloud", includes: "microsoft" },
        2,
        "A Microsoft shop can stay in one toolchain.",
      ),
      rule(
        { field: "product", anyOf: ["mobile", "web-mobile"] },
        1,
        "MAUI targets mobile (and desktop).",
      ),
      rule(tsLang, -2, "A JS team should not start on MAUI."),
      rule(
        { all: [{ field: "platforms", noneOf: ["ios", "android"] }] },
        "exclude",
        "No mobile OS was selected.",
      ),
    ],
    scaling: scaling(
      "One MAUI project and an ASP.NET API.",
      "CI on Azure DevOps or GitHub Actions.",
      "Keep MAUI clients; scale Azure APIs.",
    ),
    pros: ["C# everywhere.", "Visual Studio tooling."],
    cons: ["Smaller mobile community than RN/Flutter."],
    meta: meta(2, 2, true, ["https://learn.microsoft.com/dotnet/maui/"]),
  },
  {
    id: "capacitor",
    layer: "mobileFrontend",
    name: "Capacitor (web wrapper)",
    summary:
      "Wrap a web app as an iOS/Android shell. Fastest path when the product is already a web app and native depth is low.",
    plainSummary:
      "Put your website inside an iPhone and Android app wrapper — fastest if the web app already exists.",
    tags: ["web-wrapper", "low-ops"],
    rules: [
      rule(
        { field: "product", is: "web-mobile" },
        2,
        "You already have a web UI to wrap.",
      ),
      rule(
        { field: "nativeDepth", is: "standard" },
        2,
        "A wrapper is enough for standard screens.",
      ),
      rule(
        { field: "nativeDepth", is: "heavy" },
        -3,
        "Heavy device features do not belong in a WebView.",
      ),
      rule(freeBudget, 1, "You reuse the web codebase."),
      rule(
        { all: [{ field: "platforms", noneOf: ["ios", "android"] }] },
        "exclude",
        "No mobile OS was selected.",
      ),
    ],
    scaling: scaling(
      "Wrap the web app and submit via EAS or Xcode/Android Studio.",
      "Replace hot screens with native plugins as needed.",
      "If usage is mobile-first, rewrite those screens in RN or native.",
    ),
    pros: ["Reuse the web app.", "Fast store presence."],
    cons: ["WebView performance and platform feel."],
    meta: meta(2, 3, true, ["https://capacitorjs.com/docs"]),
  },
  {
    id: "pwa",
    layer: "mobileFrontend",
    name: "Progressive Web App",
    summary:
      "Installable web app. Skip stores when you can. Weak for iOS push and deep hardware.",
    plainSummary:
      "A website people can install on their phone — no App Store required, with some iPhone limits.",
    tags: ["web-wrapper", "low-ops"],
    rules: [
      rule(
        { field: "product", anyOf: ["webapp", "web-mobile"] },
        1,
        "A PWA extends a web app onto phones.",
      ),
      rule(
        { field: "nativeDepth", is: "standard" },
        1,
        "Standard screens can be a PWA.",
      ),
      rule(
        { field: "nativeDepth", is: "heavy" },
        -3,
        "PWAs cannot reach deep hardware.",
      ),
      rule(
        { field: "timeline", is: "days" },
        2,
        "You ship without store review.",
      ),
      rule(
        { field: "platforms", includes: "ios" },
        -1,
        "iOS PWA capabilities are still limited.",
      ),
    ],
    scaling: scaling(
      "Service worker plus HTTPS hosting.",
      "Improve offline caches; still plan a native client if iOS push is required.",
      "Keep the PWA for light users; native for core mobile usage.",
    ),
    pros: ["No store gate.", "One web codebase."],
    cons: ["iOS gaps.", "Discoverability on stores."],
    meta: meta(3, 3, true, ["https://web.dev/progressive-web-apps/"]),
  },
];
