import {
  type Affinity,
  BUDGETS,
  type Budget,
  DATA_TYPES,
  type DataType,
  DEPLOYMENTS,
  type Deployment,
  PRODUCTS,
  type Product,
  REALTIME,
  type RealTimeNeed,
  SCALES,
  type Scale,
  type Stack,
  type StackProfile,
  TEAMS,
  type TeamExperience,
} from "./types";

function fill<T extends string>(
  keys: readonly T[],
  scores: Partial<Record<T, Affinity>>,
): Record<T, Affinity> {
  return Object.fromEntries(
    keys.map((key) => [key, scores[key] ?? 0]),
  ) as Record<T, Affinity>;
}

function profile(input: {
  product: Partial<Record<Product, Affinity>>;
  scale: Partial<Record<Scale, Affinity>>;
  teamExperience: Partial<Record<TeamExperience, Affinity>>;
  budget: Partial<Record<Budget, Affinity>>;
  realTime: Partial<Record<RealTimeNeed, Affinity>>;
  dataType: Partial<Record<DataType, Affinity>>;
  deploymentPreference: Partial<Record<Deployment, Affinity>>;
}): StackProfile {
  return {
    product: fill(PRODUCTS, input.product),
    scale: fill(SCALES, input.scale),
    teamExperience: fill(TEAMS, input.teamExperience),
    budget: fill(BUDGETS, input.budget),
    realTime: fill(REALTIME, input.realTime),
    dataType: fill(DATA_TYPES, input.dataType),
    deploymentPreference: fill(DEPLOYMENTS, input.deploymentPreference),
  };
}

export const STACKS: Stack[] = [
  {
    id: "nextjs-postgres-vercel",
    name: "Next.js + Postgres + Vercel",
    summary:
      "Full-stack TypeScript on a serverless platform that takes a product from prototype to production without an ops team.",
    profile: profile({
      product: { web: 3, api: 2, realtime: 1 },
      scale: { startup: 3, growth: 3, hyperscale: 1 },
      teamExperience: { solo: 3, small: 3, experienced: 2 },
      budget: { free: 3, low: 3, enterprise: 2 },
      realTime: { yes: 1, no: 3 },
      dataType: { relational: 3, both: 2, document: 1, analytics: 1 },
      deploymentPreference: { serverless: 3, managed: 2, "self-hosted": 1 },
    }),
    pros: [
      "One language and one deploy target for UI and API.",
      "Generous free tier and preview deployments.",
      "Huge ecosystem, hiring pool, and documentation.",
    ],
    cons: [
      "Serverless limits and cold starts at chatty, long-lived workloads.",
      "Real-time needs extra infrastructure (not first-class).",
      "Hyperscale means splitting away from a single Vercel project.",
    ],
    scalingStory: {
      to10k:
        "Stay on the Vercel Hobby/Pro plan with a managed Postgres (Neon, Supabase, or Vercel Postgres) and Server Actions or Route Handlers.",
      to1m: "Add connection pooling, cache reads at the edge, move background work to queues, and split a few hot API routes into dedicated services.",
      to1b: "Keep Next.js for the web shell; extract high-QPS APIs, introduce read replicas / a distributed SQL layer, and run stateful workloads off-platform.",
    },
  },
  {
    id: "nextjs-supabase",
    name: "Next.js + Supabase",
    summary:
      "Postgres, auth, storage, and realtime behind a Next.js app — the fastest path for a solo builder who may need live updates later.",
    profile: profile({
      product: { web: 3, api: 2, realtime: 2, mobile: 1 },
      scale: { startup: 3, growth: 2, hyperscale: 1 },
      teamExperience: { solo: 3, small: 3, experienced: 2 },
      budget: { free: 3, low: 3, enterprise: 1 },
      realTime: { yes: 3, no: 2 },
      dataType: { relational: 3, both: 2, document: 1, analytics: 1 },
      deploymentPreference: { serverless: 3, managed: 3, "self-hosted": 1 },
    }),
    pros: [
      "Auth, file storage, and Postgres in one vendor.",
      "Realtime subscriptions without standing up a socket cluster.",
      "Can self-host later if you outgrow the cloud plan.",
    ],
    cons: [
      "Vendor coupling around auth and realtime.",
      "Row-level security takes discipline to get right.",
      "Not the right control plane for a 1B-user data plane.",
    ],
    scalingStory: {
      to10k:
        "Use the Supabase free/pro project as-is; deploy the Next.js app on Vercel or similar.",
      to1m: "Tune indexes and RLS, enable read replicas, and move heavy jobs off the database into Edge Functions or a worker.",
      to1b: "Keep Supabase (or Postgres) for the system of record; add caches, search, and dedicated realtime/gateway services.",
    },
  },
  {
    id: "t3-stack",
    name: "T3 Stack (Next.js + tRPC + Prisma + Postgres)",
    summary:
      "End-to-end typesafe web stack for small TypeScript teams that want structure without a separate API repo.",
    profile: profile({
      product: { web: 3, api: 2 },
      scale: { startup: 3, growth: 2, hyperscale: 1 },
      teamExperience: { solo: 3, small: 3, experienced: 2 },
      budget: { free: 2, low: 3, enterprise: 1 },
      realTime: { yes: 1, no: 3 },
      dataType: { relational: 3, both: 2, analytics: 1 },
      deploymentPreference: { serverless: 3, managed: 2, "self-hosted": 2 },
    }),
    pros: [
      "Types flow from database to UI with almost no boilerplate.",
      "Prisma keeps schema changes reviewable.",
      "Easy to host on Vercel, Fly, or a VPS.",
    ],
    cons: [
      "tRPC is less ideal if you must expose a public OpenAPI surface.",
      "Prisma and serverless connection limits need pooling.",
      "Not aimed at mobile-first or data-platform work.",
    ],
    scalingStory: {
      to10k:
        "Single Next.js app, Prisma against a small Postgres, deploy serverless.",
      to1m: "Add a connection pooler, cache layer, and extract a few procedures into workers.",
      to1b: "Replace tRPC-only boundaries with public APIs, shard or distribute Postgres, and split frontends.",
    },
  },
  {
    id: "sveltekit-supabase",
    name: "SvelteKit + Supabase",
    summary:
      "A lean web stack with less client JavaScript, still backed by Postgres, auth, and a free tier.",
    profile: profile({
      product: { web: 3, api: 1, realtime: 2 },
      scale: { startup: 3, growth: 2, hyperscale: 1 },
      teamExperience: { solo: 3, small: 2, experienced: 2 },
      budget: { free: 3, low: 3, enterprise: 1 },
      realTime: { yes: 2, no: 3 },
      dataType: { relational: 3, both: 2, document: 1 },
      deploymentPreference: { serverless: 3, managed: 2, "self-hosted": 2 },
    }),
    pros: [
      "Excellent performance and a small mental model.",
      "Supabase covers auth and data so you can ship alone.",
      "Deploys cleanly to Vercel, Netlify, Cloudflare, or a Node host.",
    ],
    cons: [
      "Smaller hiring pool than React/Next.js.",
      "Fewer off-the-shelf SaaS UI kits.",
      "Ecosystem depth is the main long-term risk.",
    ],
    scalingStory: {
      to10k: "SvelteKit adapters + a single Supabase project.",
      to1m: "Add caching headers, a CDN, and Postgres replicas; keep the app mostly server-rendered.",
      to1b: "Keep SvelteKit as the web tier; move hot paths to dedicated APIs and a stronger data plane.",
    },
  },
  {
    id: "remix-postgres-fly",
    name: "Remix + Postgres + Fly.io",
    summary:
      "Web-standard routing and server rendering close to your users, with a SQL database you can run as a VM.",
    profile: profile({
      product: { web: 3, api: 1 },
      scale: { startup: 3, growth: 3, hyperscale: 2 },
      teamExperience: { solo: 2, small: 3, experienced: 2 },
      budget: { free: 1, low: 3, enterprise: 2 },
      realTime: { yes: 1, no: 3 },
      dataType: { relational: 3, both: 2 },
      deploymentPreference: { "self-hosted": 3, managed: 3, serverless: 1 },
    }),
    pros: [
      "Progressive enhancement and great form/mutation story.",
      "Fly puts compute near users without a full Kubernetes install.",
      "Works well when you want long-lived Node processes.",
    ],
    cons: [
      "Free-tier story is thinner than Vercel/Netlify.",
      "You own more runtime and database ops than a serverless platform.",
      "Real-time still needs a separate channel.",
    ],
    scalingStory: {
      to10k: "One Fly app region + managed or Fly Postgres.",
      to1m: "Multi-region app instances, read replicas, and a queue for emails/jobs.",
      to1b: "Regional data partitioning, edge caching, and extracted services for write-heavy domains.",
    },
  },
  {
    id: "django-postgres-render",
    name: "Django + Postgres + Render",
    summary:
      "Batteries-included Python web/API stack with migrations, admin, and a managed PaaS that feels like Heroku.",
    profile: profile({
      product: { web: 3, api: 3, pipeline: 1 },
      scale: { startup: 3, growth: 2, hyperscale: 1 },
      teamExperience: { solo: 3, small: 3, experienced: 2 },
      budget: { free: 2, low: 3, enterprise: 2 },
      realTime: { yes: 1, no: 3 },
      dataType: { relational: 3, both: 2, analytics: 2, document: 1 },
      deploymentPreference: { managed: 3, "self-hosted": 3, serverless: 1 },
    }),
    pros: [
      "Admin, auth, ORM, and migrations included.",
      "Excellent for CRUD products and internal tools.",
      "Python opens the door to data/ML later.",
    ],
    cons: [
      "Weaker default story for rich interactive SPAs.",
      "WebSockets/Channels add moving parts.",
      "Less natural on a pure serverless host.",
    ],
    scalingStory: {
      to10k: "Render web service + managed Postgres; use Django admin for ops.",
      to1m: "Add Redis cache, Celery workers, and a CDN in front of media.",
      to1b: "Split read-heavy apps, introduce a gateway, and move hot paths to async services.",
    },
  },
  {
    id: "rails-postgres-render",
    name: "Rails + Postgres + Render",
    summary:
      "Convention-heavy full-stack Ruby for teams that want to ship a product, not a framework.",
    profile: profile({
      product: { web: 3, api: 2 },
      scale: { startup: 3, growth: 2, hyperscale: 1 },
      teamExperience: { solo: 2, small: 3, experienced: 2 },
      budget: { free: 1, low: 3, enterprise: 2 },
      realTime: { yes: 2, no: 3 },
      dataType: { relational: 3, both: 2 },
      deploymentPreference: { managed: 3, "self-hosted": 2, serverless: 1 },
    }),
    pros: [
      "Unmatched speed for CRUD and marketplace-style products.",
      "Hotwire/Action Cable cover many live-update cases.",
      "Mature gems for billing, jobs, and auth.",
    ],
    cons: [
      "Hiring is more specialized than JavaScript or Python.",
      "Concurrency model needs care at very high QPS.",
      "Free-tier PaaS options have shrunk since Heroku’s changes.",
    ],
    scalingStory: {
      to10k: "One Render/Heroku-style dyno, Sidekiq, and Postgres.",
      to1m: "Multiple web/worker processes, Redis, and a CDN; tune Active Record queries.",
      to1b: "Service-extract the hottest domains; keep Rails as the modular monolith core as long as possible.",
    },
  },
  {
    id: "laravel-mysql",
    name: "Laravel + MySQL + Laravel Cloud",
    summary:
      "PHP’s most productive web framework with first-party queues, auth, and a managed deploy path.",
    profile: profile({
      product: { web: 3, api: 2 },
      scale: { startup: 3, growth: 2, hyperscale: 1 },
      teamExperience: { solo: 2, small: 3, experienced: 2 },
      budget: { free: 1, low: 3, enterprise: 2 },
      realTime: { yes: 2, no: 3 },
      dataType: { relational: 3, both: 2 },
      deploymentPreference: { managed: 3, serverless: 2, "self-hosted": 2 },
    }),
    pros: [
      "Eloquent, queues, and first-party packages cover most product needs.",
      "Huge shared-hosting and agency ecosystem.",
      "Echo/Reverb handle many realtime features.",
    ],
    cons: [
      "PHP/Laravel specialists are abundant in some markets, scarce in others.",
      "Not the default choice for mobile-first or streaming data.",
      "Hyperscale usually means splitting off Go/Java/K8s services.",
    ],
    scalingStory: {
      to10k: "Laravel Cloud, Forge, or Ploi with a single MySQL instance.",
      to1m: "Octane or more PHP-FPM workers, Redis, Horizon, and read replicas.",
      to1b: "Keep Laravel for the modular monolith; extract APIs that need a different runtime.",
    },
  },
  {
    id: "nestjs-postgres-aws",
    name: "NestJS + Postgres + AWS",
    summary:
      "Structured Node.js backend for teams that want Angular-style modules, OpenAPI, and a managed AWS path.",
    profile: profile({
      product: { api: 3, web: 2, realtime: 2 },
      scale: { startup: 2, growth: 3, hyperscale: 2 },
      teamExperience: { solo: 1, small: 3, experienced: 3 },
      budget: { free: 1, low: 2, enterprise: 3 },
      realTime: { yes: 2, no: 3 },
      dataType: { relational: 3, both: 2, document: 1 },
      deploymentPreference: { managed: 3, serverless: 2, "self-hosted": 2 },
    }),
    pros: [
      "Clear module boundaries and dependency injection.",
      "First-class OpenAPI, queues, and WebSocket gateways.",
      "Fits ECS, EKS, or Lambda with the same codebase shape.",
    ],
    cons: [
      "Boilerplate is heavy for a solo beginner.",
      "AWS cost and IAM complexity show up early.",
      "Not a complete frontend story on its own.",
    ],
    scalingStory: {
      to10k: "One NestJS service on ECS/Fargate or a small VM, RDS Postgres.",
      to1m: "Horizontal tasks, RDS pooling, SQS/Redis, and an API gateway.",
      to1b: "Break modules into services, add caches and CQRS where writes hurt, run on EKS or ECS at scale.",
    },
  },
  {
    id: "fastapi-postgres-lambda",
    name: "FastAPI + Postgres + AWS Lambda",
    summary:
      "Typed Python APIs that deploy as functions — strong for backends, ML-adjacent products, and low-ops teams.",
    profile: profile({
      product: { api: 3, pipeline: 2, web: 1 },
      scale: { startup: 3, growth: 3, hyperscale: 2 },
      teamExperience: { solo: 2, small: 3, experienced: 3 },
      budget: { free: 2, low: 3, enterprise: 2 },
      realTime: { yes: 1, no: 3 },
      dataType: { relational: 3, analytics: 2, both: 2, document: 1 },
      deploymentPreference: { serverless: 3, managed: 2, "self-hosted": 2 },
    }),
    pros: [
      "Fast to write, automatic OpenAPI, great typing.",
      "Python data/ML libraries in the same language.",
      "Lambda (or containers) keeps ops light at the start.",
    ],
    cons: [
      "Cold starts and connection management on Lambda.",
      "WebSockets and long workers fight the function model.",
      "You still need a separate frontend for a web/mobile product.",
    ],
    scalingStory: {
      to10k: "Mangum/API Gateway + RDS Proxy or a serverless Postgres.",
      to1m: "Provisioned concurrency for hot routes; move batch jobs to Step Functions or containers.",
      to1b: "Run FastAPI on Kubernetes or ECS for steady traffic; keep Lambda for spiky edge APIs.",
    },
  },
  {
    id: "go-redis-kubernetes",
    name: "Go + Redis + Kubernetes",
    summary:
      "High-throughput services with explicit infrastructure — the default when you already know you will operate at scale.",
    profile: profile({
      product: { api: 3, realtime: 3, pipeline: 2, web: 1 },
      scale: { startup: 1, growth: 2, hyperscale: 3 },
      teamExperience: { solo: 0, small: 1, experienced: 3 },
      budget: { free: 0, low: 1, enterprise: 3 },
      realTime: { yes: 3, no: 2 },
      dataType: { relational: 2, both: 2, analytics: 2, document: 1 },
      deploymentPreference: { "self-hosted": 3, managed: 2, serverless: 1 },
    }),
    pros: [
      "Excellent CPU/memory efficiency and concurrency.",
      "Redis covers cache, pub/sub, and some queues.",
      "Kubernetes is a known path to multi-region 1B-user systems.",
    ],
    cons: [
      "Slowest time-to-first-feature for a solo beginner.",
      "You are buying an ops practice, not just a language.",
      "Free-tier Kubernetes is a false economy.",
    ],
    scalingStory: {
      to10k:
        "Skip K8s if you can; a single Go binary + managed Redis/Postgres is enough.",
      to1m: "Introduce Kubernetes, HPAs, and Redis Cluster; put Postgres behind pgbouncer.",
      to1b: "Multi-cluster, service mesh or a thin gateway, sharded data, and dedicated realtime/edge tiers.",
    },
  },
  {
    id: "spring-postgres-k8s",
    name: "Spring Boot + Postgres + Kubernetes",
    summary:
      "Enterprise Java APIs with unmatched library depth, observability, and a clear path onto Kubernetes.",
    profile: profile({
      product: { api: 3, web: 2 },
      scale: { startup: 1, growth: 2, hyperscale: 3 },
      teamExperience: { solo: 0, small: 2, experienced: 3 },
      budget: { free: 0, low: 1, enterprise: 3 },
      realTime: { yes: 1, no: 3 },
      dataType: { relational: 3, both: 2, analytics: 2 },
      deploymentPreference: { "self-hosted": 3, managed: 3, serverless: 0 },
    }),
    pros: [
      "Battle-tested for regulated, transactional systems.",
      "Huge hiring pool in enterprise markets.",
      "Actuator, Micrometer, and Spring Cloud fit ops-heavy orgs.",
    ],
    cons: [
      "Heavy for a weekend product or a free-tier experiment.",
      "Memory footprint is larger than Go or Node.",
      "Realtime/chat is not the sweet spot.",
    ],
    scalingStory: {
      to10k: "One Spring Boot app on a VM or Cloud Run; managed Postgres.",
      to1m: "K8s deployment, connection pooling, Redis cache, and a message broker.",
      to1b: "Domain services, CQRS where needed, multi-region databases, and a mature SRE practice.",
    },
  },
  {
    id: "dotnet-sql-azure",
    name: "ASP.NET + SQL Server + Azure",
    summary:
      "Microsoft’s full stack for web and APIs when the organization is already in the Azure/SQL Server world.",
    profile: profile({
      product: { web: 3, api: 3 },
      scale: { startup: 1, growth: 3, hyperscale: 3 },
      teamExperience: { solo: 1, small: 2, experienced: 3 },
      budget: { free: 1, low: 2, enterprise: 3 },
      realTime: { yes: 2, no: 3 },
      dataType: { relational: 3, analytics: 2, both: 2 },
      deploymentPreference: { managed: 3, serverless: 2, "self-hosted": 2 },
    }),
    pros: [
      "First-class Azure integration (Identity, Functions, App Service).",
      "Excellent performance in modern .NET.",
      "SignalR covers many realtime needs.",
    ],
    cons: [
      "SQL Server licensing/cost vs Postgres on a tight budget.",
      "Less common among early-stage JS/Python startups.",
      "Easy to over-provision Azure SKUs.",
    ],
    scalingStory: {
      to10k: "App Service or Container Apps + Azure SQL at a small SKU.",
      to1m: "Autoscale, Redis cache, and Azure SQL hyperscale or read replicas.",
      to1b: "Regional stamps, Front Door, and data partitioning with Azure-native observability.",
    },
  },
  {
    id: "firebase-flutter",
    name: "Firebase + Flutter",
    summary:
      "Cross-platform mobile with a serverless BaaS — auth, documents, and realtime included, almost no backend code.",
    profile: profile({
      product: { mobile: 3, realtime: 2, web: 1 },
      scale: { startup: 3, growth: 2, hyperscale: 1 },
      teamExperience: { solo: 3, small: 2, experienced: 1 },
      budget: { free: 3, low: 3, enterprise: 1 },
      realTime: { yes: 3, no: 1 },
      dataType: { document: 3, both: 2, analytics: 1 },
      deploymentPreference: { serverless: 3, managed: 2, "self-hosted": 0 },
    }),
    pros: [
      "One codebase for iOS and Android, plus a decent web target.",
      "Firestore/RTDB make live data the default.",
      "Spark plan is enough to validate an idea.",
    ],
    cons: [
      "Document model fights complex relational domains.",
      "Vendor lock-in and bill shock at chatty read patterns.",
      "Hard to self-host or move off Google later.",
    ],
    scalingStory: {
      to10k:
        "Stay on Firebase Auth + Firestore + Cloud Functions; ship through Play/App Store.",
      to1m: "Denormalize reads, add CDN/cache, and watch Firestore billing; introduce Cloud Run for heavy functions.",
      to1b: "Keep Firebase for client sync if it still fits; move the system of record and fan-out to dedicated services.",
    },
  },
  {
    id: "react-native-supabase",
    name: "React Native + Supabase",
    summary:
      "JavaScript/TypeScript mobile with a relational backend, auth, and realtime — better than Firebase when you need SQL.",
    profile: profile({
      product: { mobile: 3, web: 1, realtime: 2 },
      scale: { startup: 3, growth: 2, hyperscale: 1 },
      teamExperience: { solo: 2, small: 3, experienced: 2 },
      budget: { free: 3, low: 3, enterprise: 1 },
      realTime: { yes: 3, no: 2 },
      dataType: { relational: 3, both: 2, document: 1 },
      deploymentPreference: { serverless: 3, managed: 3, "self-hosted": 1 },
    }),
    pros: [
      "Share TS types and sometimes UI with a future web app.",
      "Postgres + RLS instead of a document store.",
      "Expo makes the first store build realistic for a small team.",
    ],
    cons: [
      "Native modules and store review still bite.",
      "Performance-sensitive UI may need native later.",
      "Supabase realtime is not a full game/multiplayer stack.",
    ],
    scalingStory: {
      to10k: "Expo app + one Supabase project.",
      to1m: "Tune RLS/indexes, add edge caching, and consider EAS for a more native pipeline.",
      to1b: "Keep RN for clients; split backend reads, search, and notifications into dedicated services.",
    },
  },
  {
    id: "phoenix-liveview-fly",
    name: "Phoenix LiveView + Fly.io",
    summary:
      "Server-rendered realtime web with BEAM concurrency — collaboration and live dashboards without a SPA.",
    profile: profile({
      product: { realtime: 3, web: 3, api: 1 },
      scale: { startup: 2, growth: 3, hyperscale: 3 },
      teamExperience: { solo: 1, small: 2, experienced: 3 },
      budget: { free: 1, low: 3, enterprise: 2 },
      realTime: { yes: 3, no: 2 },
      dataType: { relational: 3, both: 2 },
      deploymentPreference: { managed: 3, "self-hosted": 2, serverless: 1 },
    }),
    pros: [
      "Channels and LiveView make realtime the happy path.",
      "BEAM handles huge connection counts per VM.",
      "Fly global clustering matches Phoenix’s strengths.",
    ],
    cons: [
      "Elixir hiring is narrower than JS/Python.",
      "Solo beginners pay an upfront language tax.",
      "Not a mobile client stack.",
    ],
    scalingStory: {
      to10k: "Single Fly machine, Postgres, and LiveView as the UI.",
      to1m: "Multiple regions, PubSub clustering, and presence; keep most logic in the BEAM.",
      to1b: "Partition PubSub, add edge termination, and isolate extremely hot sockets or APIs.",
    },
  },
  {
    id: "node-mongodb",
    name: "Node.js + MongoDB + Express",
    summary:
      "Flexible JSON documents and a huge JS ecosystem — a common default for APIs and web backends with evolving schemas.",
    profile: profile({
      product: { web: 3, api: 3, realtime: 1 },
      scale: { startup: 3, growth: 2, hyperscale: 1 },
      teamExperience: { solo: 3, small: 3, experienced: 2 },
      budget: { free: 2, low: 3, enterprise: 1 },
      realTime: { yes: 2, no: 3 },
      dataType: { document: 3, both: 2, analytics: 1 },
      deploymentPreference: { "self-hosted": 3, managed: 2, serverless: 2 },
    }),
    pros: [
      "Schema flexibility while the product is still changing.",
      "Atlas free tier and a familiar JS toolchain.",
      "Easy to hire Node developers.",
    ],
    cons: [
      "Relational integrity and reporting get painful later.",
      "Easy to paint yourself into unindexed query corners.",
      "Express gives you very little structure by default.",
    ],
    scalingStory: {
      to10k: "Express API, Mongoose, Atlas M0/M10, any VPS or PaaS.",
      to1m: "Replica set, indexes as a religion, Redis cache, and maybe a search engine.",
      to1b: "Sharded Atlas (or a move to a more structured store) plus a proper service split.",
    },
  },
  {
    id: "airflow-dbt-bigquery",
    name: "Airflow + dbt + BigQuery",
    summary:
      "The managed analytics stack: orchestrate, transform, and warehouse without standing up a streaming platform.",
    profile: profile({
      product: { pipeline: 3 },
      scale: { startup: 1, growth: 3, hyperscale: 2 },
      teamExperience: { solo: 0, small: 2, experienced: 3 },
      budget: { free: 0, low: 1, enterprise: 3 },
      realTime: { yes: 1, no: 3 },
      dataType: { analytics: 3, relational: 2, both: 1 },
      deploymentPreference: { managed: 3, "self-hosted": 2, serverless: 1 },
    }),
    pros: [
      "dbt makes warehouse SQL reviewable and tested.",
      "BigQuery scales scans without cluster babysitting.",
      "Composer/Astro/MWAA take the Airflow ops edge off.",
    ],
    cons: [
      "Batch-oriented; sub-second streaming is not the point.",
      "Cost can spike with sloppy scans.",
      "Overkill for an app’s OLTP database.",
    ],
    scalingStory: {
      to10k:
        "A few dbt models on BigQuery (or Snowflake) scheduled by a managed Airflow.",
      to1m: "Layered marts, SLO monitoring, and partitioning/clustering as a standard.",
      to1b: "Domain data products, Fine-grained access, and streaming inserts only where latency demands it.",
    },
  },
  {
    id: "kafka-flink-k8s",
    name: "Kafka + Flink + Kubernetes",
    summary:
      "Streaming backbone for event-driven systems that must process high-volume data in near real time.",
    profile: profile({
      product: { pipeline: 3, realtime: 2, api: 1 },
      scale: { startup: 0, growth: 2, hyperscale: 3 },
      teamExperience: { solo: 0, small: 1, experienced: 3 },
      budget: { free: 0, low: 0, enterprise: 3 },
      realTime: { yes: 3, no: 1 },
      dataType: { analytics: 3, both: 1, document: 1 },
      deploymentPreference: { "self-hosted": 3, managed: 2, serverless: 0 },
    }),
    pros: [
      "True streaming with replay and consumer groups.",
      "Flink covers event time, state, and exactly-once sinks.",
      "This is a proven 1B-event-scale shape.",
    ],
    cons: [
      "Operationally the most expensive stack in this catalog.",
      "Wrong answer for a CRUD app or a beginner team.",
      "You still need a serving layer (API/warehouse) on top.",
    ],
    scalingStory: {
      to10k: "Do not start here — a queue + warehouse will do.",
      to1m: "Managed Kafka (MSK/Confluent) and Flink on K8s once event volume or fan-out demands it.",
      to1b: "Multi-cluster Kafka, tiered storage, Flink autoscaling, and strict schema governance.",
    },
  },
];

export const STACKS_BY_ID: Record<string, Stack> = Object.fromEntries(
  STACKS.map((stack) => [stack.id, stack]),
);

export function getStack(id: string): Stack {
  const stack = STACKS_BY_ID[id];
  if (!stack) {
    throw new Error(`Unknown stack id: ${id}`);
  }
  return stack;
}
