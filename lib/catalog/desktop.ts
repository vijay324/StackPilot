import type { Component } from "@/lib/types";
import { meta, rule, scaling, tsLang } from "./helpers";

export const DESKTOP_FRONTEND: Component[] = [
  {
    id: "electron",
    layer: "desktopFrontend",
    name: "Electron",
    summary:
      "Chromium + Node desktop apps. Huge ecosystem; heavier memory use. Default when the UI is already web.",
    plainSummary:
      "Turn a website into a Windows, Mac, and Linux app people install — widely used, a bit heavy on memory.",
    tags: ["web-wrapper", "typescript"],
    rules: [
      rule(
        { field: "product", is: "desktop" },
        3,
        "Electron is the common web-to-desktop path.",
      ),
      rule(tsLang, 2, "Reuse web TypeScript and UI."),
      rule(
        { field: "platforms", anyOf: ["windows", "macos", "linux"] },
        2,
        "Electron ships all three desktop OSes.",
      ),
      rule(
        { field: "nativeDepth", is: "heavy" },
        -1,
        "Deep OS integration is clumsier than native toolkits.",
      ),
    ],
    scaling: scaling(
      "One Electron shell around the web app.",
      "Auto-update via a provider; watch memory on low-end PCs.",
      "Keep Electron if the UI stays web; native rewrite only for OS-deep products.",
    ),
    pros: ["Reuse web skills.", "Mature auto-update story."],
    cons: ["RAM cost of Chromium."],
    meta: meta(3, 3, true, ["https://www.electronjs.org/docs/latest"]),
  },
  {
    id: "tauri",
    layer: "desktopFrontend",
    name: "Tauri",
    summary:
      "System webview plus a Rust core. Much smaller binaries than Electron, with a steeper native curve.",
    plainSummary:
      "A lighter installable desktop app that still uses web screens, with a small download size.",
    tags: ["web-wrapper", "rust"],
    rules: [
      rule(
        { field: "product", is: "desktop" },
        3,
        "Tauri is a modern lightweight desktop shell.",
      ),
      rule(
        { field: "languages", includes: "rust" },
        2,
        "A Rust core matches the team.",
      ),
      rule(
        { field: "languages", includes: "typescript" },
        1,
        "The UI can stay web.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        -1,
        "Rust + webview is more moving parts than Electron.",
      ),
    ],
    scaling: scaling(
      "One Tauri app and a small API.",
      "Code-sign and updater; keep the webview current.",
      "Native modules in Rust for hot paths.",
    ),
    pros: ["Smaller than Electron.", "Rust systems core."],
    cons: ["Webview differences per OS."],
    meta: meta(2, 3, true, ["https://v2.tauri.app/"]),
  },
  {
    id: "flutter-desktop",
    layer: "desktopFrontend",
    name: "Flutter desktop",
    summary:
      "Same Flutter UI on Windows, macOS, and Linux. Makes sense when mobile is already Flutter.",
    plainSummary: "The same Flutter app, also installed on computers.",
    tags: ["cross-platform", "dart"],
    synergy: [
      {
        with: "flutter",
        bonus: 3,
        reason: "One Flutter codebase can target mobile and desktop.",
      },
    ],
    rules: [
      rule(
        { field: "product", is: "desktop" },
        2,
        "Flutter can target desktop OS windows.",
      ),
      rule(
        { field: "languages", includes: "dart" },
        3,
        "Dart/Flutter skills reuse.",
      ),
      rule(
        { field: "product", is: "web-mobile" },
        1,
        "You may already be on Flutter for phones.",
      ),
    ],
    scaling: scaling(
      "Enable desktop devices in the Flutter project.",
      "Per-OS packaging (MSIX, DMG, AppImage).",
      "Keep Flutter UI; native plugins for OS-deep features.",
    ),
    pros: ["Shared UI with mobile Flutter."],
    cons: ["Desktop platform conventions take extra work."],
    meta: meta(2, 2, true, [
      "https://docs.flutter.dev/platform-integration/desktop",
    ]),
  },
  {
    id: "dotnet-desktop",
    layer: "desktopFrontend",
    name: ".NET (WPF / MAUI)",
    summary:
      "Windows-first desktop in C#. WPF for rich Windows; MAUI when you also want Mac.",
    plainSummary:
      "Windows (and optionally Mac) software in C# — typical for Microsoft-heavy companies.",
    tags: ["dotnet", "native"],
    synergy: [
      { with: "aspnet", bonus: 2, reason: "Share C# with the server." },
    ],
    rules: [
      rule(
        { field: "languages", includes: "csharp" },
        3,
        "C# is the language.",
      ),
      rule(
        { field: "platforms", includes: "windows" },
        3,
        "WPF/WinUI is the native Windows path.",
      ),
      rule(
        { field: "existingCloud", includes: "microsoft" },
        2,
        "Visual Studio and Azure AD fit.",
      ),
      rule(
        { field: "product", is: "desktop" },
        2,
        ".NET is a first-class desktop stack.",
      ),
    ],
    scaling: scaling(
      "One .NET desktop project.",
      "ClickOnce or MSIX distribution; Azure AD if needed.",
      "Keep the rich client; scale services on Azure.",
    ),
    pros: ["Native Windows UX.", "Strong enterprise identity."],
    cons: ["Weaker Linux story."],
    meta: meta(2, 3, true, ["https://learn.microsoft.com/dotnet/desktop/wpf/"]),
  },
  {
    id: "qt",
    layer: "desktopFrontend",
    name: "Qt",
    summary:
      "C++/QML cross-platform native UI. Right for specialized, long-lived desktop tools — not consumer SaaS.",
    plainSummary:
      "Serious desktop software for Windows, Mac, and Linux when you need native speed and control.",
    tags: ["native", "hyperscale"],
    rules: [
      rule(
        { field: "product", is: "desktop" },
        2,
        "Qt is a classic native desktop toolkit.",
      ),
      rule(
        { field: "nativeDepth", is: "heavy" },
        2,
        "Hardware-near tools fit Qt.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        -3,
        "Qt is the wrong first framework for a beginner web product.",
      ),
      rule(
        { field: "timeline", is: "days" },
        -2,
        "Qt is not a weekend prototype stack for SaaS.",
      ),
    ],
    scaling: scaling(
      "One Qt project per OS with a shared QML UI.",
      "Commercial license if required; CI for three OS installers.",
      "Keep the native client; backend scale is independent.",
    ),
    pros: ["True native performance.", "Mature tooling."],
    cons: ["Licensing and C++ hiring."],
    meta: meta(1, 3, true, ["https://doc.qt.io/"]),
  },
  {
    id: "swift-macos",
    layer: "desktopFrontend",
    name: "Swift (macOS)",
    summary:
      "Native Mac app in SwiftUI. Correct when macOS is the only desktop target.",
    plainSummary:
      "A Mac app built the Apple way — best when you only need Mac, not Windows.",
    tags: ["native", "ios"],
    rules: [
      rule(
        { field: "platforms", includes: "macos" },
        3,
        "SwiftUI is native macOS.",
      ),
      rule(
        { not: { field: "platforms", includes: "macos" } },
        "exclude",
        "No macOS target.",
      ),
      rule(
        { field: "platforms", includes: "windows" },
        -3,
        "Swift does not ship Windows.",
      ),
      rule(
        { field: "languages", includes: "swift" },
        3,
        "Swift skills reuse with iOS.",
      ),
    ],
    scaling: scaling(
      "One Mac app and optional iOS sibling.",
      "App Store or Developer ID notarization.",
      "Keep native clients; scale the backend separately.",
    ),
    pros: ["Best Mac integration."],
    cons: ["No Windows from this codebase."],
    meta: meta(2, 3, true, ["https://developer.apple.com/macos/"]),
  },
];
