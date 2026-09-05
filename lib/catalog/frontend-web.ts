import type { Component } from "@/lib/types";
import {
  freeBudget,
  lowOps,
  meta,
  rule,
  scaling,
  tinyTeam,
  tsLang,
  webProduct,
} from "./helpers";

export const WEB_FRONTEND: Component[] = [
  {
    id: "nextjs",
    layer: "webFrontend",
    name: "Next.js",
    summary:
      "React framework with server rendering, Route Handlers, and a huge hiring pool — the default full-stack TypeScript web UI.",
    plainSummary:
      "A proven way to build websites and web apps in one project, with pages that search engines can read.",
    tags: ["react", "ssr", "typescript", "low-ops"],
    synergy: [
      {
        with: "vercel",
        bonus: 3,
        reason: "Next.js and Vercel are built to deploy together.",
      },
      {
        with: "next-builtin",
        bonus: 3,
        reason: "The App Router can host the API in the same app.",
      },
    ],
    rules: [
      rule(webProduct, 2, "Next.js is a strong default for browser products."),
      rule(
        { field: "product", is: "website" },
        2,
        "Server-rendered pages are a natural fit for marketing and content sites.",
      ),
      rule(
        { field: "product", is: "webapp" },
        3,
        "Next.js is a well-trodden path for signed-in SaaS and dashboards.",
      ),
      rule(
        { field: "seo", is: "must" },
        3,
        "Server rendering and metadata APIs make pages crawlable.",
      ),
      rule(
        { field: "webKind", anyOf: ["logged-in", "both"] },
        2,
        "Server Components and Route Handlers cover app shells without a separate API repo.",
      ),
      rule(
        tsLang,
        3,
        "The team already writes TypeScript, which is Next.js’s native language.",
      ),
      rule(
        tinyTeam,
        2,
        "One framework for UI and API reduces coordination for a small team.",
      ),
      rule(
        { field: "realtime", is: "multiplayer" },
        -2,
        "Long-lived game or video sockets fight the serverless request model.",
      ),
      rule(
        {
          all: [
            {
              field: "languages",
              anyOf: ["python", "php", "ruby", "csharp", "java"],
            },
            { not: { field: "languages", includes: "typescript" } },
          ],
        },
        -3,
        "A non-JS team pays a language tax to adopt React.",
      ),
    ],
    scaling: scaling(
      "One Next.js app with Server Actions or Route Handlers is enough.",
      "Cache reads at the edge, add a queue for background work, and split a few hot API routes.",
      "Keep Next.js as the web shell; extract high-QPS APIs and stateful sockets off the web tier.",
    ),
    pros: [
      "One language for UI and server.",
      "Huge ecosystem, docs, and hiring pool.",
      "SEO and authenticated apps in the same codebase.",
    ],
    cons: [
      "Serverless limits show up for chatty, long-lived workloads.",
      "Easy to accidentally ship a too-heavy client bundle.",
    ],
    meta: meta(3, 3, true, ["https://nextjs.org/docs"]),
  },
  {
    id: "react-vite",
    layer: "webFrontend",
    name: "React + Vite (SPA)",
    summary:
      "Client-rendered React with Vite. Fast local DX when SEO does not matter and an API already exists.",
    plainSummary:
      "A signed-in web app that runs in the browser and talks to a separate backend.",
    tags: ["react", "spa", "typescript"],
    rules: [
      rule(
        { field: "webKind", is: "logged-in" },
        2,
        "A SPA is fine when almost every screen is behind a login.",
      ),
      rule(
        { field: "seo", is: "none" },
        3,
        "Client rendering is acceptable when search engines do not need the pages.",
      ),
      rule(
        { field: "seo", is: "must" },
        -3,
        "A Vite SPA does not ship crawlable HTML without extra SSR work.",
      ),
      rule(
        { field: "product", is: "website" },
        -2,
        "Marketing sites need server-rendered HTML more than a SPA.",
      ),
      rule(tsLang, 2, "React + TypeScript is a familiar pairing."),
      rule(
        { field: "product", is: "api" },
        "exclude",
        "There is no web UI to render.",
      ),
    ],
    scaling: scaling(
      "Static hosting plus an API is enough.",
      "Code-split routes and put a CDN in front of the JS assets.",
      "Keep the SPA as a shell; move SEO surfaces to a server-rendered site if you ever need them.",
    ),
    pros: ["Excellent local tooling.", "Clear split from the API."],
    cons: ["Weak SEO story.", "You own the API and auth wiring."],
    meta: meta(3, 3, true, ["https://vitejs.dev/guide/"]),
  },
  {
    id: "react-router",
    layer: "webFrontend",
    name: "React Router / Remix",
    summary:
      "Web-standard routing, nested loaders, and progressive enhancement — strong for form-heavy products on long-lived Node hosts.",
    plainSummary:
      "A React website that loads data on the server and works even when JavaScript is slow.",
    tags: ["react", "ssr", "typescript"],
    synergy: [
      {
        with: "fly",
        bonus: 2,
        reason: "Remix-style apps pair well with long-lived Node on Fly.io.",
      },
    ],
    rules: [
      rule(
        webProduct,
        2,
        "React Router’s framework mode is built for web apps with real URLs.",
      ),
      rule(
        { field: "webKind", anyOf: ["logged-in", "both"] },
        2,
        "Loaders and actions fit form-and-mutation products.",
      ),
      rule(
        { field: "seo", is: "must" },
        2,
        "Server rendering gives crawlers HTML.",
      ),
      rule(tsLang, 2, "TypeScript is first-class."),
      rule(
        { field: "deployPreference", is: "serverless" },
        -1,
        "The sweet spot is a persistent Node server, not only functions.",
      ),
    ],
    scaling: scaling(
      "One Node app and a SQL database.",
      "Multi-region app instances and a queue for email and jobs.",
      "Keep the web tier; extract write-heavy domains into services.",
    ),
    pros: ["Progressive enhancement.", "Excellent nested routing."],
    cons: ["Smaller default platform story than Next.js on Vercel."],
    meta: meta(3, 3, true, ["https://reactrouter.com/"]),
  },
  {
    id: "nuxt",
    layer: "webFrontend",
    name: "Nuxt (Vue)",
    summary:
      "Vue’s full-stack framework with SSR, file routing, and Nitro — the right call when the team already thinks in Vue.",
    plainSummary:
      "A Vue-based way to build websites and web apps with pages search engines can read.",
    tags: ["vue", "ssr"],
    rules: [
      rule(webProduct, 2, "Nuxt covers marketing sites and app shells in Vue."),
      rule(
        { field: "seo", is: "must" },
        2,
        "SSR and nitro presets make crawlable pages.",
      ),
      rule(
        { field: "languages", includes: "typescript" },
        1,
        "Vue 3 + TS is productive, though React still hires easier in many markets.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        1,
        "Vue’s template model is approachable.",
      ),
      rule(
        { field: "product", is: "api" },
        "exclude",
        "Nuxt is a UI framework, not an API-only runtime.",
      ),
    ],
    scaling: scaling(
      "One Nuxt app on a Node or serverless host.",
      "Enable route rules, CDN caching, and a separate worker.",
      "Keep Nuxt for the web; move hot APIs out.",
    ),
    pros: ["Approachable Vue model.", "Flexible Nitro deploy targets."],
    cons: ["Smaller hiring pool than React in many regions."],
    meta: meta(2, 3, true, ["https://nuxt.com/docs"]),
  },
  {
    id: "sveltekit",
    layer: "webFrontend",
    name: "SvelteKit",
    summary:
      "Lean web framework with little client JavaScript. Excellent performance; smaller hiring pool than React.",
    plainSummary:
      "A fast, lightweight way to build websites when you want less complexity in the browser.",
    tags: ["ssr", "low-ops"],
    synergy: [
      {
        with: "vercel",
        bonus: 1,
        reason: "SvelteKit adapters deploy cleanly to Vercel.",
      },
      {
        with: "sveltekit-builtin",
        bonus: 3,
        reason: "SvelteKit can host form actions and APIs in-process.",
      },
    ],
    rules: [
      rule(
        { field: "product", is: "website" },
        3,
        "SvelteKit shines for content and marketing with a small JS budget.",
      ),
      rule({ field: "seo", is: "must" }, 2, "Server rendering is the default."),
      rule(tinyTeam, 2, "A small mental model helps a solo builder."),
      rule(
        { field: "team", is: "large" },
        -1,
        "Hiring Svelte specialists is harder than hiring React.",
      ),
      rule(webProduct, 2, "SvelteKit is a complete web UI framework."),
    ],
    scaling: scaling(
      "SvelteKit adapter plus a managed database.",
      "Cache headers, a CDN, and keep most pages server-rendered.",
      "Keep SvelteKit as the web tier; extract hot paths.",
    ),
    pros: ["Tiny client bundles.", "Pleasant programming model."],
    cons: ["Smaller ecosystem and hiring pool than React."],
    meta: meta(2, 3, true, ["https://svelte.dev/docs/kit"]),
  },
  {
    id: "angular",
    layer: "webFrontend",
    name: "Angular",
    summary:
      "Batteries-included TypeScript UI for large teams that want modules, DI, and a long support window.",
    plainSummary:
      "A structured way to build large web apps when many engineers will work in the same codebase.",
    tags: ["typescript"],
    synergy: [
      {
        with: "nestjs",
        bonus: 1,
        reason: "Angular-style modules feel familiar next to NestJS.",
      },
    ],
    rules: [
      rule(
        { field: "team", anyOf: ["large"] },
        3,
        "Angular’s structure pays off when many engineers share a codebase.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        -2,
        "The framework is heavy for a first product.",
      ),
      rule(
        { field: "webKind", is: "logged-in" },
        2,
        "Enterprise portals are a classic Angular fit.",
      ),
      rule(
        { field: "seo", is: "must" },
        1,
        "SSR exists (Angular Universal) but is more work than Next.js.",
      ),
      rule(tsLang, 2, "Angular is TypeScript-first."),
    ],
    scaling: scaling(
      "One Angular app talking to a typed API.",
      "Lazy-loaded feature modules and a CDN.",
      "Microfrontends only if org boundaries demand them.",
    ),
    pros: ["Opinionated structure.", "Long-term vendor support."],
    cons: ["Heavier than Next/Svelte for small teams."],
    meta: meta(3, 3, true, ["https://angular.dev/"]),
  },
  {
    id: "astro",
    layer: "webFrontend",
    name: "Astro",
    summary:
      "Content-first islands architecture. Ships almost no JavaScript by default — ideal for marketing, docs, and blogs.",
    plainSummary:
      "The simplest way to ship a fast public website that search engines like, without a heavy app framework.",
    tags: ["ssr", "content", "low-ops"],
    synergy: [
      {
        with: "vercel",
        bonus: 2,
        reason:
          "Astro deploys to Vercel (and Netlify, Cloudflare) with a free tier.",
      },
      {
        with: "netlify",
        bonus: 2,
        reason: "Astro on Netlify is a common zero-ops marketing stack.",
      },
    ],
    rules: [
      rule(
        { field: "product", is: "website" },
        3,
        "Astro is built for content sites, not application shells.",
      ),
      rule(
        { field: "seo", is: "must" },
        3,
        "Zero-JS-by-default HTML is excellent for search.",
      ),
      rule(
        { field: "webKind", is: "public" },
        3,
        "Public pages are the happy path.",
      ),
      rule(
        freeBudget,
        2,
        "Static or lightly dynamic hosting stays inside free tiers.",
      ),
      rule(lowOps, 2, "You can publish without running an app server."),
      rule(
        { field: "product", anyOf: ["webapp", "internal"] },
        -2,
        "Signed-in app UX is clumsier than Next.js or SvelteKit.",
      ),
      rule(
        { field: "auth", noneOf: ["none"] },
        -1,
        "Auth-heavy products outgrow a content framework.",
      ),
      rule(
        { field: "product", is: "api" },
        "exclude",
        "Astro is not an API runtime.",
      ),
    ],
    scaling: scaling(
      "Static output on a CDN. Done.",
      "Use server islands for a few dynamic routes; keep the rest static.",
      "Keep Astro for content; put the product app on a dedicated framework.",
    ),
    pros: ["Outstanding performance.", "Bring-your-own UI islands."],
    cons: ["Not a full application framework."],
    meta: meta(2, 3, true, ["https://docs.astro.build/"]),
  },
  {
    id: "htmx",
    layer: "webFrontend",
    name: "Server templates + HTMX",
    summary:
      "HTML over the wire from Django, Rails, Laravel, or Go templates. Minimal client JS for CRUD products.",
    plainSummary:
      "Ordinary web pages that update in place, without building a separate JavaScript app.",
    tags: ["ssr", "html"],
    synergy: [
      {
        with: "django",
        bonus: 2,
        reason: "Django templates + HTMX is a productive CRUD pairing.",
      },
      {
        with: "rails",
        bonus: 2,
        reason: "Hotwire/HTMX-style HTML is a Rails native strength.",
      },
      {
        with: "laravel",
        bonus: 2,
        reason: "Livewire/HTMX fits Laravel’s server-rendered model.",
      },
    ],
    rules: [
      rule(
        { field: "product", anyOf: ["internal", "webapp"] },
        2,
        "CRUD and admin tools do not need a SPA.",
      ),
      rule(
        { field: "webKind", is: "editor" },
        -2,
        "Dense editors still want a client framework.",
      ),
      rule(
        { field: "languages", anyOf: ["python", "ruby", "php", "go"] },
        2,
        "Server HTML matches a non-JS backend language.",
      ),
      rule(
        tsLang,
        -1,
        "A TypeScript-first team usually prefers React or Svelte.",
      ),
      rule({ field: "seo", is: "must" }, 2, "Real HTML is crawlable."),
    ],
    scaling: scaling(
      "One monolith rendering HTML.",
      "Fragment caching and a CDN for public pages.",
      "Keep HTML for admin; extract public or high-QPS APIs.",
    ),
    pros: ["Tiny frontend.", "One language on the server."],
    cons: ["Interactive editors are a stretch."],
    meta: meta(2, 3, true, ["https://htmx.org/docs/"]),
  },
  {
    id: "phoenix-liveview",
    layer: "webFrontend",
    name: "Phoenix LiveView",
    summary:
      "Server-rendered realtime UI on the BEAM. Collaboration and live dashboards without a SPA.",
    plainSummary:
      "Live web screens that update instantly, without building a separate mobile-style frontend.",
    tags: ["ssr", "realtime", "hyperscale"],
    synergy: [
      { with: "phoenix", bonus: 3, reason: "LiveView is the Phoenix UI." },
      {
        with: "phoenix-channels",
        bonus: 2,
        reason: "Channels and LiveView share the BEAM runtime.",
      },
      {
        with: "fly",
        bonus: 2,
        reason: "Fly clustering matches Phoenix’s strengths.",
      },
    ],
    rules: [
      rule(
        { field: "realtime", anyOf: ["live", "collab"] },
        3,
        "LiveView makes live UI the happy path.",
      ),
      rule(
        { field: "product", is: "realtime" },
        3,
        "Collaboration products are a classic LiveView fit.",
      ),
      rule(
        { field: "languages", includes: "elixir" },
        3,
        "The team already knows Elixir.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        -2,
        "Elixir is an upfront language tax for a beginner.",
      ),
      rule(
        { field: "product", is: "mobile" },
        "exclude",
        "LiveView is not a native mobile client.",
      ),
    ],
    scaling: scaling(
      "Single Fly machine and LiveView as the UI.",
      "Multi-region PubSub and presence.",
      "Partition PubSub and isolate extremely hot sockets.",
    ),
    pros: ["Realtime without a SPA.", "BEAM connection density."],
    cons: ["Narrower hiring than JavaScript."],
    meta: meta(1, 3, true, ["https://hexdocs.pm/phoenix_live_view"]),
  },
  {
    id: "blazor",
    layer: "webFrontend",
    name: "Blazor",
    summary:
      ".NET web UI for teams already in C#. Server or WebAssembly hosting on Azure.",
    plainSummary:
      "A way to build web screens in C# when the rest of the company already uses Microsoft tools.",
    tags: ["dotnet"],
    synergy: [
      {
        with: "aspnet",
        bonus: 3,
        reason: "Blazor and ASP.NET share the .NET stack.",
      },
      {
        with: "azure-app",
        bonus: 2,
        reason: "Azure App Service is the default Blazor host.",
      },
    ],
    rules: [
      rule(
        { field: "languages", includes: "csharp" },
        3,
        "C# teams can share models with the API.",
      ),
      rule(
        { field: "existingCloud", includes: "microsoft" },
        3,
        "A Microsoft shop should not start in React by default.",
      ),
      rule(
        { field: "existingCloud", includes: "azure" },
        2,
        "Blazor on Azure is a supported path.",
      ),
      rule(
        { field: "languages", includes: "typescript" },
        -1,
        "A JS team gains little by switching to Blazor.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        -1,
        "Beginners usually find JS web stacks easier to hire help for.",
      ),
    ],
    scaling: scaling(
      "Blazor Server or WASM on App Service.",
      "Redis backplane for circuit state; scale-out App Service.",
      "Keep Blazor for internal UI; extract public high-scale APIs.",
    ),
    pros: ["One language with the API.", "First-class Azure."],
    cons: ["Weaker ecosystem than React for consumer SaaS."],
    meta: meta(2, 3, true, ["https://learn.microsoft.com/aspnet/core/blazor/"]),
  },
];
