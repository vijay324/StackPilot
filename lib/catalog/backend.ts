import type { Component } from "@/lib/types";
import {
  brochureNoAuth,
  dedicatedOps,
  enterpriseBudget,
  experiencedTeam,
  freeBudget,
  hipaa,
  lowOps,
  meta,
  rule,
  scaling,
  tinyTeam,
  tsLang,
} from "./helpers";

export const BACKENDS: Component[] = [
  {
    id: "static",
    layer: "backend",
    name: "Static hosting (no app server)",
    summary:
      "HTML, CSS, and JS on a CDN. Correct for marketing sites with no accounts, no payments, and no custom API.",
    plainSummary:
      "Just files on the internet — the right call for a simple public website.",
    tags: ["low-ops", "builtin"],
    synergy: [
      {
        with: "astro",
        bonus: 3,
        reason: "Astro can ship a static site with no server.",
      },
      {
        with: "netlify",
        bonus: 2,
        reason: "Netlify is a classic static host.",
      },
      { with: "vercel", bonus: 1, reason: "Vercel hosts static output too." },
    ],
    rules: [
      rule(
        { field: "product", is: "website" },
        3,
        "A public website often needs no custom server.",
      ),
      rule(
        { field: "auth", is: "none" },
        3,
        "No accounts means no session API.",
      ),
      rule({ field: "payments", is: "none" }, 2, "No checkout to run."),
      rule(
        {
          field: "product",
          anyOf: ["webapp", "api", "mobile", "store", "internal"],
        },
        "exclude",
        "This product needs an application server.",
      ),
      rule({ field: "auth", noneOf: ["none"] }, -3, "Login needs a backend."),
    ],
    scaling: scaling(
      "Static files on a CDN.",
      "Add serverless functions only for forms or previews.",
      "If it becomes a product, introduce a real backend — do not fake a SaaS on static files.",
    ),
    pros: ["Cheapest.", "Hard to break."],
    cons: ["No application logic."],
    meta: meta(3, 3, true, [
      "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Tools_and_setup/Upload_files_to_a_web_server",
    ]),
  },
  {
    id: "next-builtin",
    layer: "backend",
    name: "Next.js Route Handlers",
    summary:
      "Keep the API in the Next.js app. Best for solo/small TypeScript products that are not a standalone service.",
    plainSummary:
      "The website and the server live in one project — simplest when a small team is building a web app.",
    tags: ["typescript", "low-ops", "builtin"],
    synergy: [
      {
        with: "nextjs",
        bonus: 3,
        reason: "Route Handlers and Server Actions are the Next.js backend.",
      },
      {
        with: "vercel",
        bonus: 2,
        reason: "Functions deploy with the Next.js app on Vercel.",
      },
    ],
    rules: [
      rule(
        {
          field: "product",
          anyOf: ["website", "webapp", "store", "internal", "ai", "web-mobile"],
        },
        3,
        "A Next.js app can own its API.",
      ),
      rule(
        { field: "product", is: "api" },
        -2,
        "A standalone API is clearer as Fastify, Nest, or Go.",
      ),
      rule(tsLang, 2, "TypeScript end-to-end."),
      rule(
        {
          all: [
            { field: "languages", includes: "python" },
            { not: { field: "languages", includes: "typescript" } },
          ],
        },
        -3,
        "A Python-only team should not bury the API inside Next.js.",
      ),
      rule(tinyTeam, 3, "One deployable for a solo or tiny team."),
      rule(lowOps, 2, "No extra service to operate."),
      rule(
        { field: "realtime", is: "multiplayer" },
        -3,
        "Multiplayer sockets do not belong on request/response functions.",
      ),
      rule(
        { field: "scaleAmbition", is: "billion" },
        -1,
        "You will extract services before a billion users anyway.",
      ),
    ],
    scaling: scaling(
      "Route Handlers or Server Actions against a managed Postgres.",
      "Move background work to a queue; keep HTTP in Next.js.",
      "Extract high-QPS APIs; keep Next.js as BFF.",
    ),
    pros: ["Zero extra repos.", "Types shared with the UI."],
    cons: ["Not a public API platform by itself."],
    meta: meta(3, 3, true, [
      "https://nextjs.org/docs/app/building-your-application/routing/route-handlers",
    ]),
  },
  {
    id: "sveltekit-builtin",
    layer: "backend",
    name: "SvelteKit server",
    summary: "Form actions and +server routes inside SvelteKit.",
    plainSummary:
      "The Svelte website can also be the server, without a second project.",
    tags: ["low-ops", "builtin"],
    synergy: [
      {
        with: "sveltekit",
        bonus: 3,
        reason: "SvelteKit server routes are the in-process backend.",
      },
    ],
    rules: [
      rule(
        { field: "product", anyOf: ["website", "webapp", "internal"] },
        2,
        "SvelteKit can host the API.",
      ),
      rule(tinyTeam, 2, "One app to deploy."),
      rule(
        { field: "product", is: "api" },
        -2,
        "Use a dedicated API framework instead.",
      ),
    ],
    scaling: scaling(
      "Hooks and +server routes.",
      "Extract workers when jobs grow.",
      "Keep SvelteKit as BFF; dedicated APIs for hot paths.",
    ),
    pros: ["One project."],
    cons: ["Smaller ecosystem than Next.js."],
    meta: meta(2, 3, true, ["https://svelte.dev/docs/kit/server-only-modules"]),
  },
  {
    id: "hono",
    layer: "backend",
    name: "Hono / Fastify / Express",
    summary:
      "Lightweight TypeScript HTTP APIs. Hono on Workers, Fastify on Node, Express when you need the oldest ecosystem.",
    plainSummary:
      "A small TypeScript server that other apps and websites can call.",
    tags: ["typescript", "low-ops"],
    rules: [
      rule(
        { field: "product", is: "api" },
        3,
        "A focused HTTP framework is the right shape for an API product.",
      ),
      rule(tsLang, 3, "TypeScript HTTP is the team’s language."),
      rule(
        { field: "product", anyOf: ["webapp", "mobile", "web-mobile"] },
        1,
        "A separate API is reasonable next to a JS client.",
      ),
      rule(
        { field: "deployPreference", is: "serverless" },
        2,
        "Hono in particular fits Workers and Lambda.",
      ),
      rule(
        { field: "team", is: "large" },
        -1,
        "Large orgs often want Nest-style structure.",
      ),
    ],
    scaling: scaling(
      "One Fastify/Hono process or Worker.",
      "Horizontal copies plus a queue.",
      "Split by domain; keep a gateway in front.",
    ),
    pros: ["Tiny and fast.", "Runs on Node, Bun, or Workers."],
    cons: ["You assemble structure yourself."],
    meta: meta(3, 3, true, ["https://hono.dev/docs/", "https://fastify.dev/"]),
  },
  {
    id: "nestjs",
    layer: "backend",
    name: "NestJS",
    summary:
      "Structured Node.js with modules, DI, and OpenAPI. Fits small-to-large TS teams that want boundaries.",
    plainSummary:
      "A more organized TypeScript server — useful when several people will work on the same API.",
    tags: ["typescript"],
    rules: [
      rule(
        { field: "product", is: "api" },
        3,
        "NestJS is an API-first framework.",
      ),
      rule(tsLang, 3, "TypeScript-native."),
      rule(
        { field: "team", anyOf: ["small", "large"] },
        2,
        "Modules help a team split work.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        -2,
        "Boilerplate is heavy for a first backend.",
      ),
      rule(
        { field: "realtime", anyOf: ["live", "collab"] },
        1,
        "Gateways exist, though Phoenix/Go may fit better at huge fan-out.",
      ),
    ],
    scaling: scaling(
      "One Nest app on a VM or Fargate.",
      "Horizontal tasks, queues, and an API gateway.",
      "Break modules into services on ECS or EKS.",
    ),
    pros: ["Clear module boundaries.", "OpenAPI out of the box."],
    cons: ["Heavy for a weekend product."],
    meta: meta(3, 3, true, ["https://docs.nestjs.com/"]),
  },
  {
    id: "django",
    layer: "backend",
    name: "Django",
    summary:
      "Batteries-included Python: ORM, admin, auth, migrations. Excellent CRUD and internal tools; Python path into data/ML.",
    plainSummary:
      "A Python toolkit that includes login, an admin panel, and a database layer — fast for forms and internal tools.",
    tags: ["python", "batteries"],
    synergy: [
      {
        with: "postgres",
        bonus: 2,
        reason: "Django’s ORM is at its best on Postgres.",
      },
      {
        with: "htmx",
        bonus: 2,
        reason: "Templates + HTMX keep the stack in Python.",
      },
      {
        with: "celery",
        bonus: 2,
        reason: "Celery is the usual Django job runner.",
      },
    ],
    rules: [
      rule(
        { field: "languages", includes: "python" },
        3,
        "Django is the batteries-included Python web stack.",
      ),
      rule(
        { field: "product", anyOf: ["webapp", "internal", "store"] },
        3,
        "CRUD products are Django’s home turf.",
      ),
      rule(
        { field: "product", is: "api" },
        2,
        "Django REST Framework is a known API path.",
      ),
      rule(
        { field: "product", is: "analytics" },
        1,
        "Python helps when data work is next door.",
      ),
      rule(
        { field: "deployPreference", is: "serverless" },
        -2,
        "Django prefers a long-lived process, not a pure function host.",
      ),
      rule(tinyTeam, 2, "Admin and auth ship in the box."),
    ],
    scaling: scaling(
      "One Django app, Postgres, and the built-in admin.",
      "Redis cache, Celery workers, and a CDN for media.",
      "Split read-heavy apps; move hot paths to async services if needed.",
    ),
    pros: ["Admin included.", "Migrations and auth included."],
    cons: ["Weaker default for rich SPAs.", "WebSockets add parts."],
    meta: meta(3, 3, true, ["https://docs.djangoproject.com/"]),
  },
  {
    id: "fastapi",
    layer: "backend",
    name: "FastAPI",
    summary:
      "Typed Python APIs with automatic OpenAPI. Strong for backends, ML-adjacent products, and function deploys.",
    plainSummary:
      "A modern Python API that documents itself — a good match if you also work with data or AI.",
    tags: ["python", "low-ops"],
    rules: [
      rule(
        { field: "product", is: "api" },
        3,
        "FastAPI is built for HTTP APIs.",
      ),
      rule(
        { field: "languages", includes: "python" },
        3,
        "Python is the team language.",
      ),
      rule(
        { field: "ai", anyOf: ["api", "rag", "train"] },
        2,
        "Python ML libraries live next to the API.",
      ),
      rule(
        { field: "product", is: "analytics" },
        2,
        "Python data libraries are adjacent.",
      ),
      rule(
        { field: "deployPreference", is: "serverless" },
        2,
        "Mangum/Lambda or Cloud Run fit well.",
      ),
      rule(
        { field: "realtime", is: "multiplayer" },
        -2,
        "Long-lived sockets fight a function model.",
      ),
    ],
    scaling: scaling(
      "One FastAPI service and a serverless Postgres.",
      "Provisioned concurrency or containers for hot routes.",
      "Run FastAPI on Kubernetes/ECS for steady traffic; functions for spikes.",
    ),
    pros: ["OpenAPI for free.", "Python data/ML in-process."],
    cons: ["You still need a separate frontend for a full product."],
    meta: meta(3, 3, true, ["https://fastapi.tiangolo.com/"]),
  },
  {
    id: "rails",
    layer: "backend",
    name: "Ruby on Rails",
    summary:
      "Convention-heavy full-stack Ruby. Unmatched speed for CRUD, marketplaces, and product teams that want a framework.",
    plainSummary:
      "A well-known way to build web products quickly, with login, jobs, and payments libraries ready to go.",
    tags: ["ruby", "batteries"],
    synergy: [
      {
        with: "postgres",
        bonus: 2,
        reason: "Postgres is the default Rails database.",
      },
      { with: "sidekiq", bonus: 3, reason: "Sidekiq is the Rails job runner." },
    ],
    rules: [
      rule(
        { field: "languages", includes: "ruby" },
        3,
        "Rails is the Ruby product framework.",
      ),
      rule(
        { field: "product", anyOf: ["webapp", "store", "internal"] },
        3,
        "Marketplaces and CRUD are a Rails strength.",
      ),
      rule(
        { field: "timeline", anyOf: ["days", "1-3-months"] },
        2,
        "Rails still ships features fast.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        1,
        "Conventions help, if you accept Ruby.",
      ),
      rule(tsLang, -1, "A JS-only team rarely starts on Rails."),
    ],
    scaling: scaling(
      "One Rails app, Sidekiq, Postgres.",
      "More web/worker processes, Redis, CDN.",
      "Keep a modular monolith; extract only the hottest domains.",
    ),
    pros: ["Productive conventions.", "Mature gems."],
    cons: ["Hiring is more specialized than JS/Python."],
    meta: meta(2, 3, true, ["https://guides.rubyonrails.org/"]),
  },
  {
    id: "laravel",
    layer: "backend",
    name: "Laravel",
    summary:
      "PHP’s most productive framework: queues, auth, Eloquent, first-party deploy path.",
    plainSummary:
      "A popular PHP toolkit for websites and apps, with login and background jobs included.",
    tags: ["php", "batteries"],
    synergy: [
      { with: "mysql", bonus: 2, reason: "Laravel’s default path is MySQL." },
      { with: "postgres", bonus: 1, reason: "Postgres is fully supported." },
    ],
    rules: [
      rule(
        { field: "languages", includes: "php" },
        3,
        "Laravel is the productive PHP framework.",
      ),
      rule(
        { field: "product", anyOf: ["webapp", "store", "website", "internal"] },
        2,
        "Laravel covers most product shapes.",
      ),
      rule(
        { field: "realtime", anyOf: ["live", "notify"] },
        1,
        "Echo/Reverb cover many live features.",
      ),
      rule(
        { field: "team", is: "agency" },
        2,
        "Agencies often already staff PHP.",
      ),
    ],
    scaling: scaling(
      "Laravel Cloud/Forge plus one MySQL.",
      "Octane or more workers, Redis, Horizon, replicas.",
      "Keep Laravel as the modular monolith; extract APIs that need another runtime.",
    ),
    pros: ["First-party queues and auth.", "Huge agency ecosystem."],
    cons: ["Not the default for mobile-first or streaming data."],
    meta: meta(3, 3, true, ["https://laravel.com/docs"]),
  },
  {
    id: "go",
    layer: "backend",
    name: "Go",
    summary:
      "High-throughput services with explicit infrastructure. Default when you already know you will operate at scale.",
    plainSummary:
      "A fast, efficient server language used for large APIs — more setup, more headroom.",
    tags: ["hyperscale", "high-ops"],
    synergy: [
      {
        with: "kubernetes",
        bonus: 2,
        reason: "Go services on Kubernetes are a known hyperscale shape.",
      },
      {
        with: "redis",
        bonus: 2,
        reason: "Redis covers cache, pub/sub, and some queues next to Go.",
      },
    ],
    rules: [
      rule(
        { field: "product", is: "api" },
        3,
        "Go is an excellent API/runtime language.",
      ),
      rule(
        { field: "languages", includes: "go" },
        3,
        "The team already writes Go.",
      ),
      rule(
        { field: "scaleAmbition", anyOf: ["global", "billion"] },
        3,
        "Go is a proven 1B-request path.",
      ),
      rule(
        { field: "scaleYear1", anyOf: ["100k-1m", "1m-plus"] },
        2,
        "Efficiency matters once traffic is real.",
      ),
      rule(
        { field: "realtime", anyOf: ["live", "collab", "multiplayer"] },
        3,
        "Goroutines handle huge connection counts.",
      ),
      rule(
        { field: "realtime", is: "multiplayer" },
        3,
        "Low-latency sockets are a Go strength.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        -3,
        "Go plus ops is the slowest time-to-first-feature for a beginner.",
      ),
      rule(
        { field: "ops", is: "none" },
        -2,
        "You are buying an ops practice, not just a language.",
      ),
      rule(
        lowOps,
        -2,
        "Go is the wrong default when nobody will operate servers.",
      ),
      rule(
        experiencedTeam,
        2,
        "Experienced teams can afford explicit infrastructure.",
      ),
    ],
    scaling: scaling(
      "A single Go binary and managed Postgres/Redis is enough at 10K.",
      "Introduce Kubernetes, HPAs, and Redis Cluster.",
      "Multi-cluster, sharded data, and dedicated realtime/edge tiers.",
    ),
    pros: ["Efficiency and concurrency.", "Simple deploys as one binary."],
    cons: ["Slowest beginner path.", "You own more infrastructure."],
    meta: meta(3, 3, true, ["https://go.dev/doc/"]),
  },
  {
    id: "spring",
    layer: "backend",
    name: "Spring Boot",
    summary:
      "Enterprise Java APIs with unmatched library depth, observability, and a clear path onto Kubernetes.",
    plainSummary:
      "The standard Java way to build serious company APIs — heavier to start, very strong in large organizations.",
    tags: ["java", "hyperscale", "high-ops"],
    synergy: [
      {
        with: "kubernetes",
        bonus: 2,
        reason: "Spring on Kubernetes is a common enterprise shape.",
      },
      {
        with: "postgres",
        bonus: 1,
        reason: "JPA/Hibernate on Postgres is well understood.",
      },
    ],
    rules: [
      rule(
        { field: "product", is: "api" },
        3,
        "Spring Boot is an API workhorse.",
      ),
      rule(
        { field: "languages", includes: "java" },
        3,
        "Java/Kotlin teams should start here.",
      ),
      rule(
        { field: "scaleAmbition", anyOf: ["global", "billion"] },
        2,
        "This is a proven hyperscale JVM path.",
      ),
      rule(enterpriseBudget, 2, "The cost model matches enterprise ops."),
      rule(
        { field: "team", is: "solo-learning" },
        -3,
        "Too heavy for a weekend product.",
      ),
      rule(freeBudget, -2, "JVM memory and ops cost fight a $0 budget."),
      rule(
        { field: "compliance", anyOf: ["hipaa", "soc2", "pci"] },
        2,
        "The ecosystem is used in regulated systems.",
      ),
      rule(dedicatedOps, 2, "Spring + K8s fits a platform team."),
    ],
    scaling: scaling(
      "One Spring Boot app on a VM or Cloud Run.",
      "K8s, pooling, Redis, and a broker.",
      "Domain services, CQRS where needed, multi-region databases.",
    ),
    pros: [
      "Battle-tested transactional systems.",
      "Huge enterprise hiring pool.",
    ],
    cons: [
      "Heavy for a prototype.",
      "Larger memory footprint than Go or Node.",
    ],
    meta: meta(3, 3, true, ["https://docs.spring.io/spring-boot/"]),
  },
  {
    id: "aspnet",
    layer: "backend",
    name: "ASP.NET Core",
    summary:
      "High-performance .NET APIs with first-class Azure integration and SignalR for many realtime cases.",
    plainSummary:
      "Microsoft’s web and API platform — the natural choice if you already use Azure or C#.",
    tags: ["dotnet", "hyperscale"],
    synergy: [
      {
        with: "azure-app",
        bonus: 3,
        reason: "App Service and Container Apps are the Azure-native hosts.",
      },
      {
        with: "azure-sql",
        bonus: 2,
        reason: "SQL Server/Azure SQL is the default Microsoft data plane.",
      },
      { with: "blazor", bonus: 2, reason: "One .NET stack for UI and API." },
    ],
    rules: [
      rule(
        { field: "languages", includes: "csharp" },
        3,
        "C# is ASP.NET’s language.",
      ),
      rule(
        { field: "existingCloud", anyOf: ["azure", "microsoft"] },
        3,
        "Stay in the Microsoft cloud.",
      ),
      rule(
        { field: "product", anyOf: ["api", "webapp", "internal"] },
        3,
        "ASP.NET covers APIs and web.",
      ),
      rule(
        { field: "realtime", anyOf: ["live", "collab"] },
        2,
        "SignalR covers many live needs.",
      ),
      rule(
        { field: "scaleAmbition", anyOf: ["global", "billion"] },
        2,
        "Modern .NET is fast enough for huge scale.",
      ),
    ],
    scaling: scaling(
      "App Service or Container Apps plus Azure SQL.",
      "Autoscale, Redis, and SQL replicas or Hyperscale.",
      "Regional stamps, Front Door, and data partitioning.",
    ),
    pros: ["Excellent performance.", "Azure identity and functions."],
    cons: ["Less common among early-stage JS startups."],
    meta: meta(3, 3, true, ["https://learn.microsoft.com/aspnet/core/"]),
  },
  {
    id: "phoenix",
    layer: "backend",
    name: "Phoenix",
    summary:
      "Elixir web/API framework. Channels make realtime the happy path; BEAM handles huge connection counts.",
    plainSummary:
      "A server that is unusually good at chat, live dashboards, and many people connected at once.",
    tags: ["elixir", "realtime", "hyperscale"],
    synergy: [
      {
        with: "phoenix-liveview",
        bonus: 3,
        reason: "LiveView is Phoenix’s UI.",
      },
      {
        with: "phoenix-channels",
        bonus: 3,
        reason: "Channels are built into Phoenix.",
      },
      {
        with: "fly",
        bonus: 2,
        reason: "Fly global clustering matches Phoenix.",
      },
    ],
    rules: [
      rule(
        { field: "languages", includes: "elixir" },
        3,
        "Phoenix is the Elixir web framework.",
      ),
      rule(
        { field: "realtime", anyOf: ["live", "collab", "multiplayer"] },
        3,
        "Channels and presence are first-class.",
      ),
      rule(
        { field: "product", is: "realtime" },
        3,
        "Collaboration is a Phoenix specialty.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        -2,
        "Elixir is an upfront tax.",
      ),
      rule(
        { field: "product", is: "mobile" },
        -1,
        "You still need a native or RN client.",
      ),
    ],
    scaling: scaling(
      "One Phoenix app and Postgres on Fly.",
      "Multi-region clustering and presence.",
      "Partition PubSub; isolate extremely hot sockets.",
    ),
    pros: ["Realtime happy path.", "Connection density."],
    cons: ["Narrower hiring."],
    meta: meta(1, 3, true, ["https://hexdocs.pm/phoenix/"]),
  },
  {
    id: "axum",
    layer: "backend",
    name: "Rust (Axum)",
    summary:
      "Typed, fast HTTP in Rust. Right when the team already writes Rust or latency/safety dominate.",
    plainSummary:
      "A very fast, very strict server language — powerful, and harder to learn.",
    tags: ["rust", "hyperscale", "high-ops"],
    rules: [
      rule(
        { field: "languages", includes: "rust" },
        3,
        "Axum is a leading Rust HTTP framework.",
      ),
      rule(
        { field: "product", is: "api" },
        2,
        "Rust fits performance-sensitive APIs.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        -3,
        "Rust is the wrong first backend language.",
      ),
      rule(
        { field: "timeline", is: "days" },
        -2,
        "Compile times and learning curve fight a prototype.",
      ),
    ],
    scaling: scaling(
      "One Axum binary on a VM or Fly.",
      "Horizontal copies; keep it simple.",
      "This runtime already has headroom; scale data and ops next.",
    ),
    pros: ["Performance and safety."],
    cons: ["Hiring and compile-time cost."],
    meta: meta(1, 3, true, ["https://docs.rs/axum/"]),
  },
  {
    id: "supabase",
    layer: "backend",
    name: "Supabase",
    summary:
      "Postgres, auth, storage, and realtime as a managed backend. Fastest path for solo builders who may need SQL and live updates.",
    plainSummary:
      "A hosted backend that includes a database, login, files, and live updates — you write less server code.",
    tags: ["baas", "low-ops", "lock-in"],
    synergy: [
      { with: "postgres", bonus: 3, reason: "Supabase is Postgres." },
      { with: "supabase-auth", bonus: 3, reason: "Auth is included." },
      {
        with: "supabase-realtime",
        bonus: 3,
        reason: "Realtime subscriptions are included.",
      },
      { with: "supabase-storage", bonus: 3, reason: "Storage is included." },
      {
        with: "expo",
        bonus: 2,
        reason: "Official client libraries on React Native.",
      },
    ],
    rules: [
      rule(tinyTeam, 3, "A BaaS removes most backend work for a small team."),
      rule(
        {
          all: [
            { field: "product", is: "website" },
            { field: "auth", is: "none" },
          ],
        },
        "exclude",
        "A public brochure site does not need a hosted application backend.",
      ),
      rule(lowOps, 3, "No servers to run."),
      rule(freeBudget, 3, "The free/pro tier is enough to validate an idea."),
      rule(
        { field: "dataShape", anyOf: ["relational", "unsure"] },
        3,
        "You get a real Postgres.",
      ),
      rule(
        { field: "realtime", anyOf: ["live", "collab"] },
        2,
        "Realtime is included, though not a full multiplayer stack.",
      ),
      rule(
        { field: "lockIn", is: "ok" },
        2,
        "You accepted a vendor-managed backend.",
      ),
      rule(
        { field: "lockIn", is: "portable" },
        -2,
        "Auth and realtime couple you to the vendor.",
      ),
      rule(
        { field: "deployPreference", is: "self-hosted" },
        -1,
        "Self-hosting Supabase is possible but not why people pick it.",
      ),
      rule(hipaa, -3, "Hobby-tier BaaS is the wrong control plane for HIPAA."),
      rule(
        { field: "compliance", includes: "hipaa" },
        "exclude",
        "Do not start a HIPAA product on a hobby BaaS.",
      ),
      rule(
        { field: "realtime", is: "multiplayer" },
        -2,
        "Supabase realtime is not a game or WebRTC stack.",
      ),
      rule(
        { field: "scaleAmbition", is: "billion" },
        -2,
        "You will outgrow a single BaaS control plane.",
      ),
      rule(
        { field: "ops", is: "dedicated" },
        -1,
        "A platform team usually wants cloud primitives, not a BaaS.",
      ),
    ],
    scaling: scaling(
      "One Supabase project; clients talk to it directly with row-level security.",
      "Tune indexes and RLS, enable replicas, move heavy jobs off the database.",
      "Keep Postgres as system of record; add caches, search, and dedicated gateways.",
    ),
    pros: [
      "Auth, files, Postgres, realtime in one vendor.",
      "Can self-host later.",
    ],
    cons: ["Vendor coupling.", "RLS takes discipline."],
    meta: meta(3, 3, true, ["https://supabase.com/docs"]),
  },
  {
    id: "firebase",
    layer: "backend",
    name: "Firebase",
    summary:
      "Google BaaS: Auth, Firestore/RTDB, Functions. Live data is the default. Document model; hard to self-host.",
    plainSummary:
      "A Google-hosted backend with login and a live document database — very fast to start, harder to leave.",
    tags: ["baas", "low-ops", "lock-in", "hobby"],
    synergy: [
      {
        with: "firestore",
        bonus: 3,
        reason: "Firestore is the Firebase document store.",
      },
      { with: "firebase-auth", bonus: 3, reason: "Auth is included." },
      {
        with: "firebase-rtdb",
        bonus: 3,
        reason: "RTDB is the original live Firebase database.",
      },
      { with: "flutter", bonus: 2, reason: "FlutterFire is a mature pairing." },
    ],
    rules: [
      rule(
        brochureNoAuth,
        "exclude",
        "A public brochure site does not need a hosted application backend.",
      ),
      rule(
        { field: "product", anyOf: ["mobile", "web-mobile"] },
        3,
        "Firebase is a default mobile BaaS.",
      ),
      rule(
        { field: "dataShape", is: "document" },
        3,
        "Firestore is a document store.",
      ),
      rule(
        { field: "dataShape", is: "relational" },
        -2,
        "Relational domains fight Firestore.",
      ),
      rule(
        { field: "realtime", anyOf: ["live", "collab"] },
        3,
        "Live documents are the default.",
      ),
      rule(tinyTeam, 3, "Almost no backend code."),
      rule(freeBudget, 3, "Spark plan validates an idea."),
      rule({ field: "lockIn", is: "ok" }, 2, "You accepted Google lock-in."),
      rule(
        { field: "lockIn", is: "portable" },
        -3,
        "Firebase is hard to move off later.",
      ),
      rule(
        { field: "deployPreference", is: "self-hosted" },
        "exclude",
        "Firebase is not a self-hosted control plane.",
      ),
      rule(
        hipaa,
        "exclude",
        "Hobby Firebase is the wrong starting point for HIPAA.",
      ),
      rule(
        { field: "compliance", includes: "pci" },
        -2,
        "Do not casually store cards in Firestore.",
      ),
    ],
    scaling: scaling(
      "Auth + Firestore + Cloud Functions.",
      "Denormalize reads, watch billing, introduce Cloud Run for heavy functions.",
      "Keep Firebase for client sync if it still fits; move the system of record out.",
    ),
    pros: ["Live data default.", "Generous start."],
    cons: ["Document model vs relational domains.", "Bill shock and lock-in."],
    meta: meta(3, 3, false, ["https://firebase.google.com/docs"]),
  },
  {
    id: "convex",
    layer: "backend",
    name: "Convex",
    summary:
      "Reactive TypeScript backend with a transactional document store. Excellent for collaborative web apps; vendor-hosted.",
    plainSummary:
      "A hosted backend where the web app stays in sync automatically — great for live collaborative tools.",
    tags: ["baas", "low-ops", "lock-in", "typescript"],
    rules: [
      rule(
        brochureNoAuth,
        "exclude",
        "A public brochure site does not need a hosted application backend.",
      ),
      rule(tsLang, 2, "Convex is TypeScript-native."),
      rule(
        { field: "realtime", anyOf: ["live", "collab"] },
        3,
        "Reactive queries are the point.",
      ),
      rule(
        { field: "product", is: "realtime" },
        2,
        "Collaborative apps are a Convex sweet spot.",
      ),
      rule(tinyTeam, 2, "You write little traditional API code."),
      rule(
        { field: "deployPreference", is: "self-hosted" },
        "exclude",
        "Convex is not a self-hosted option.",
      ),
      rule(hipaa, "exclude", "Do not start HIPAA on a hobby BaaS."),
    ],
    scaling: scaling(
      "One Convex project from the Next/Vite app.",
      "Keep functions small; watch write volume.",
      "Extract hot search or analytics; keep Convex for interactive state if it still fits.",
    ),
    pros: ["Reactive by default.", "End-to-end TS."],
    cons: ["Vendor hosted.", "Younger ecosystem."],
    meta: meta(2, 2, false, ["https://docs.convex.dev/"]),
  },
  {
    id: "appwrite",
    layer: "backend",
    name: "Appwrite",
    summary:
      "Open-source BaaS you can self-host. Auth, DB, storage, functions — a portable alternative to Firebase.",
    plainSummary:
      "A login-and-database kit you can host yourself, if you do not want to be stuck with one vendor.",
    tags: ["baas", "low-ops"],
    rules: [
      rule(
        brochureNoAuth,
        "exclude",
        "A public brochure site does not need a hosted application backend.",
      ),
      rule(
        { field: "lockIn", is: "portable" },
        2,
        "You can self-host Appwrite.",
      ),
      rule(
        { field: "deployPreference", is: "self-hosted" },
        2,
        "Self-host is a first-class path.",
      ),
      rule(tinyTeam, 1, "Still a BaaS, so less code."),
      rule(
        { field: "ops", is: "none" },
        -1,
        "Self-hosting still needs someone to run it, or use Appwrite Cloud.",
      ),
      rule(hipaa, -2, "You still own compliance of the deployment."),
    ],
    scaling: scaling(
      "Appwrite Cloud or a single Docker host.",
      "Replicate and split functions.",
      "Treat it as a BFF; move heavy data planes out.",
    ),
    pros: ["Open-source BaaS.", "Self-host option."],
    cons: ["Smaller ecosystem than Firebase/Supabase."],
    meta: meta(2, 2, true, ["https://appwrite.io/docs"]),
  },
  {
    id: "pocketbase",
    layer: "backend",
    name: "PocketBase",
    summary:
      "Single-file SQLite BaaS. Perfect for prototypes and tiny products; not a 1B data plane.",
    plainSummary:
      "A tiny all-in-one backend in one file — wonderful for prototypes, not for huge scale.",
    tags: ["baas", "hobby", "low-ops"],
    rules: [
      rule(
        brochureNoAuth,
        "exclude",
        "A public brochure site does not need a hosted application backend.",
      ),
      rule(
        { field: "timeline", is: "days" },
        3,
        "You can have auth and SQLite in an afternoon.",
      ),
      rule(freeBudget, 2, "Runs on a $0 VPS or even locally."),
      rule(
        { field: "scaleAmbition", anyOf: ["global", "billion"] },
        -3,
        "SQLite-in-process is not a billion-user data plane.",
      ),
      rule(
        { field: "scaleYear1", anyOf: ["100k-1m", "1m-plus"] },
        -2,
        "You will outgrow a single PocketBase file.",
      ),
      rule(
        hipaa,
        "exclude",
        "Hobby SQLite BaaS is the wrong HIPAA starting point.",
      ),
    ],
    scaling: scaling(
      "One binary and SQLite.",
      "Move to Postgres (or Supabase) before writes hurt.",
      "Do not stay here at large scale.",
    ),
    pros: ["Absurdly simple.", "Open source."],
    cons: ["Not a hyperscale backend."],
    meta: meta(2, 2, true, ["https://pocketbase.io/docs/"]),
  },
];
