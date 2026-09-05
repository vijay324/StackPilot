import type { StackPreset } from "@/lib/types";

export const PRESETS: StackPreset[] = [
  {
    id: "nextjs-postgres-vercel",
    name: "Next.js + Postgres + Vercel",
    components: ["nextjs", "next-builtin", "postgres", "vercel"],
    narrative:
      "Full-stack TypeScript on a serverless platform that takes a product from prototype to production without an ops team.",
    plainNarrative:
      "A TypeScript website and database on Vercel — a common, low-ops way to launch a web product.",
    scaling: {
      to10k:
        "Stay on Vercel with managed Postgres (Neon, Supabase, or Vercel Postgres) and Route Handlers.",
      to1m: "Add pooling, edge cache, queues, and split a few hot API routes.",
      to1b: "Keep Next.js as the web shell; extract high-QPS APIs and stateful workloads.",
    },
  },
  {
    id: "nextjs-supabase",
    name: "Next.js + Supabase",
    components: ["nextjs", "supabase", "postgres", "supabase-auth", "vercel"],
    narrative:
      "Postgres, auth, storage, and realtime behind a Next.js app — a fast path for a solo builder.",
    plainNarrative:
      "A website plus a hosted backend that already includes login and a database.",
    scaling: {
      to10k: "One Supabase project and a Next.js app on Vercel.",
      to1m: "Tune RLS and indexes; move heavy jobs off the database.",
      to1b: "Keep Postgres as system of record; add caches and dedicated services.",
    },
  },
  {
    id: "t3-stack",
    name: "T3 Stack (Next.js + Postgres)",
    components: ["nextjs", "next-builtin", "postgres", "vercel"],
    narrative: "End-to-end typesafe web stack for small TypeScript teams.",
    plainNarrative:
      "TypeScript from the database to the screen, hosted without a server team.",
    scaling: {
      to10k: "Single Next.js app against small Postgres.",
      to1m: "Pooler, cache, and a few workers.",
      to1b: "Public APIs, distributed SQL, split frontends.",
    },
  },
  {
    id: "sveltekit-supabase",
    name: "SvelteKit + Supabase",
    components: ["sveltekit", "sveltekit-builtin", "supabase", "postgres"],
    narrative:
      "A lean web stack with less client JavaScript, still backed by Postgres and auth.",
    plainNarrative:
      "A lighter website framework with a hosted Postgres and login.",
    scaling: {
      to10k: "SvelteKit plus one Supabase project.",
      to1m: "CDN and replicas; keep pages server-rendered.",
      to1b: "Keep SvelteKit as the web tier; extract hot APIs.",
    },
  },
  {
    id: "remix-postgres-fly",
    name: "React Router + Postgres + Fly.io",
    components: ["react-router", "postgres", "fly"],
    narrative:
      "Web-standard routing close to your users, with SQL on long-lived processes.",
    plainNarrative:
      "A web app running near users on Fly, with a normal SQL database.",
    scaling: {
      to10k: "One Fly region and Postgres.",
      to1m: "Multi-region instances, replicas, and a queue.",
      to1b: "Regional data and extracted write-heavy services.",
    },
  },
  {
    id: "django-postgres-render",
    name: "Django + Postgres + Render",
    components: ["django", "postgres", "render", "htmx"],
    narrative:
      "Batteries-included Python with admin, migrations, and a Heroku-style PaaS.",
    plainNarrative:
      "A Python web app with a built-in admin, hosted on a simple platform.",
    scaling: {
      to10k: "Render web service and managed Postgres.",
      to1m: "Redis, Celery, and a CDN.",
      to1b: "Split read-heavy apps and move hot paths to async services.",
    },
  },
  {
    id: "rails-postgres-render",
    name: "Rails + Postgres + Render",
    components: ["rails", "postgres", "render", "sidekiq"],
    narrative:
      "Convention-heavy Ruby for teams that want to ship a product, not a framework.",
    plainNarrative:
      "Ruby on Rails with a database and background jobs, hosted simply.",
    scaling: {
      to10k: "One web process, Sidekiq, Postgres.",
      to1m: "More processes, Redis, CDN.",
      to1b: "Modular monolith; extract only the hottest domains.",
    },
  },
  {
    id: "laravel-mysql",
    name: "Laravel + MySQL",
    components: ["laravel", "mysql"],
    narrative:
      "PHP’s most productive web framework with first-party queues and auth.",
    plainNarrative:
      "A PHP web toolkit with a MySQL database — common for agencies and product teams.",
    scaling: {
      to10k: "Laravel Cloud/Forge and one MySQL.",
      to1m: "Octane or more workers, Redis, replicas.",
      to1b: "Keep Laravel as the monolith; extract APIs that need another runtime.",
    },
  },
  {
    id: "nestjs-postgres-aws",
    name: "NestJS + Postgres + AWS",
    components: ["nestjs", "postgres", "aws-ecs"],
    narrative: "Structured Node APIs with OpenAPI and a managed AWS path.",
    plainNarrative:
      "An organized TypeScript API on Amazon’s container platform.",
    scaling: {
      to10k: "One NestJS service on Fargate and RDS.",
      to1m: "Horizontal tasks, SQS/Redis, API gateway.",
      to1b: "Break modules into services on ECS or EKS.",
    },
  },
  {
    id: "fastapi-postgres-lambda",
    name: "FastAPI + Postgres + AWS Lambda",
    components: ["fastapi", "postgres", "aws-lambda"],
    narrative:
      "Typed Python APIs that deploy as functions — strong for backends and ML-adjacent products.",
    plainNarrative:
      "A Python API that runs only when called, with a SQL database.",
    scaling: {
      to10k: "API Gateway plus a serverless Postgres.",
      to1m: "Provisioned concurrency; batch on Step Functions or containers.",
      to1b: "Containers for steady traffic; Lambda for spikes.",
    },
  },
  {
    id: "go-redis-kubernetes",
    name: "Go + Redis + Kubernetes",
    components: ["go", "redis", "kubernetes", "postgres"],
    narrative:
      "High-throughput services with explicit infrastructure — the default when you will operate at scale.",
    plainNarrative:
      "Fast server software on Kubernetes, with a cache and a database — for teams that can operate it.",
    scaling: {
      to10k: "Skip K8s if you can; one Go binary plus managed Redis/Postgres.",
      to1m: "Kubernetes, HPAs, Redis Cluster.",
      to1b: "Multi-cluster, sharded data, dedicated realtime/edge tiers.",
    },
  },
  {
    id: "spring-postgres-k8s",
    name: "Spring Boot + Postgres + Kubernetes",
    components: ["spring", "postgres", "kubernetes"],
    narrative: "Enterprise Java APIs with a clear path onto Kubernetes.",
    plainNarrative: "Java APIs on Kubernetes — a standard large-company shape.",
    scaling: {
      to10k: "One Spring Boot app on a VM or Cloud Run.",
      to1m: "K8s, pooling, Redis, broker.",
      to1b: "Domain services, CQRS where needed, multi-region databases.",
    },
  },
  {
    id: "dotnet-sql-azure",
    name: "ASP.NET + Azure SQL + Azure",
    components: ["aspnet", "azure-sql", "azure-app"],
    narrative:
      "Microsoft’s full stack when the organization is already in Azure.",
    plainNarrative: "C# APIs and Microsoft’s database, hosted on Azure.",
    scaling: {
      to10k: "App Service or Container Apps and a small Azure SQL SKU.",
      to1m: "Autoscale, Redis, Hyperscale or replicas.",
      to1b: "Regional stamps, Front Door, and data partitioning.",
    },
  },
  {
    id: "firebase-flutter",
    name: "Firebase + Flutter",
    components: ["flutter", "firebase", "firestore", "firebase-auth"],
    narrative:
      "Cross-platform mobile with a serverless BaaS — auth, documents, and realtime included.",
    plainNarrative:
      "One mobile app for iPhone and Android, with Google hosting login and live data.",
    scaling: {
      to10k: "Firebase Auth, Firestore, and Cloud Functions.",
      to1m: "Denormalize reads; watch billing; Cloud Run for heavy work.",
      to1b: "Keep Firebase for client sync if it fits; move the system of record out.",
    },
  },
  {
    id: "react-native-supabase",
    name: "React Native + Supabase",
    components: ["expo", "supabase", "postgres", "expo-eas"],
    narrative:
      "TypeScript mobile with a relational backend, auth, and realtime.",
    plainNarrative:
      "One phone app for iOS and Android, with a real SQL database and login included.",
    scaling: {
      to10k: "Expo app plus one Supabase project.",
      to1m: "Tune RLS; EAS for a more native pipeline.",
      to1b: "Keep RN for clients; split backend reads and notifications.",
    },
  },
  {
    id: "phoenix-liveview-fly",
    name: "Phoenix LiveView + Fly.io",
    components: [
      "phoenix-liveview",
      "phoenix",
      "phoenix-channels",
      "fly",
      "postgres",
    ],
    narrative:
      "Server-rendered realtime web with BEAM concurrency — collaboration without a SPA.",
    plainNarrative:
      "Live web screens that update instantly, running close to users on Fly.",
    scaling: {
      to10k: "Single Fly machine, Postgres, LiveView as the UI.",
      to1m: "Multiple regions, PubSub clustering, presence.",
      to1b: "Partition PubSub; isolate extremely hot sockets.",
    },
  },
  {
    id: "node-mongodb",
    name: "Node.js + MongoDB",
    components: ["hono", "mongodb"],
    narrative:
      "Flexible JSON documents and a huge JS ecosystem — a common API default while schemas are still moving.",
    plainNarrative: "A JavaScript API with a flexible document database.",
    scaling: {
      to10k: "One API, Atlas M0/M10.",
      to1m: "Replica set, indexes, Redis, maybe search.",
      to1b: "Sharded Atlas or a more structured store plus a service split.",
    },
  },
  {
    id: "airflow-dbt-bigquery",
    name: "Airflow + dbt + BigQuery",
    components: ["dagster", "dbt", "bigquery"],
    narrative:
      "The managed analytics stack: orchestrate, transform, and warehouse.",
    plainNarrative:
      "A reporting platform: scheduled jobs, checked SQL, and a giant warehouse.",
    scaling: {
      to10k:
        "A few dbt models on BigQuery scheduled by managed Airflow/Dagster.",
      to1m: "Layered marts, SLOs, partitioning.",
      to1b: "Domain data products; streaming only where latency demands it.",
    },
  },
  {
    id: "kafka-flink-k8s",
    name: "Kafka + Flink + Kubernetes",
    components: ["kafka", "flink", "kubernetes"],
    narrative:
      "Streaming backbone for event-driven systems that must process high-volume data in near real time.",
    plainNarrative:
      "A serious streaming platform — only when you truly have huge live event volume.",
    scaling: {
      to10k: "Do not start here — a queue plus warehouse will do.",
      to1m: "Managed Kafka and Flink on Kubernetes once fan-out demands it.",
      to1b: "Multi-cluster Kafka, tiered storage, Flink autoscaling, schema governance.",
    },
  },
];
