import type { Component } from "@/lib/types";
import {
  dedicatedOps,
  enterpriseBudget,
  freeBudget,
  lowOps,
  meta,
  rule,
  scaling,
  tinyTeam,
} from "./helpers";

export const HOSTING: Component[] = [
  {
    id: "vercel",
    layer: "hosting",
    name: "Vercel",
    summary:
      "Serverless/edge host tuned for Next.js, plus preview deploys. Weak for long-lived sockets and custom runtimes.",
    plainSummary:
      "The easiest place to put a Next.js or similar website — you do not manage servers.",
    tags: ["low-ops", "serverless"],
    synergy: [
      { with: "nextjs", bonus: 3, reason: "Vercel is built around Next.js." },
      {
        with: "astro",
        bonus: 2,
        reason: "Astro on Vercel is a common free-tier site.",
      },
    ],
    rules: [
      rule(lowOps, 3, "There are no servers to mind."),
      rule(tinyTeam, 3, "Preview deploys replace an ops person."),
      rule(freeBudget, 3, "Hobby/Pro covers early products."),
      rule(
        { field: "deployPreference", is: "serverless" },
        3,
        "This is a serverless platform.",
      ),
      rule(
        { field: "product", anyOf: ["website", "webapp", "store", "ai"] },
        2,
        "Web frontends are the happy path.",
      ),
      rule(
        { field: "realtime", is: "multiplayer" },
        "exclude",
        "Long-lived multiplayer sockets are not a Vercel-only job.",
      ),
      rule(
        { field: "deployPreference", is: "self-hosted" },
        "exclude",
        "Vercel is not self-hosted.",
      ),
      rule(
        { field: "ops", is: "dedicated" },
        -1,
        "A platform team often wants AWS/GCP/Azure accounts.",
      ),
      rule(
        { field: "existingCloud", includes: "azure" },
        -1,
        "A Microsoft shop usually stays on Azure.",
      ),
    ],
    scaling: scaling(
      "Hobby/Pro plus a managed Postgres.",
      "Edge cache, connection pooling, queues off-platform.",
      "Keep Vercel for the web shell; run stateful and high-QPS APIs elsewhere.",
    ),
    pros: ["Previews.", "Next.js-native."],
    cons: ["Not for long-lived sockets.", "Hyperscale means splitting off."],
    meta: meta(3, 3, false, ["https://vercel.com/docs"]),
  },
  {
    id: "netlify",
    layer: "hosting",
    name: "Netlify",
    summary:
      "JAMstack/serverless host with a generous free tier. Excellent for content sites and forms; less of an app platform than Vercel.",
    plainSummary:
      "A simple host for public websites — especially marketing sites and docs.",
    tags: ["low-ops", "serverless"],
    synergy: [
      {
        with: "astro",
        bonus: 2,
        reason: "Astro + Netlify is a classic content deploy.",
      },
    ],
    rules: [
      rule(
        { field: "product", is: "website" },
        3,
        "Netlify is built for content sites.",
      ),
      rule(freeBudget, 3, "The free tier is enough for many sites."),
      rule(lowOps, 3, "No servers."),
      rule({ field: "product", is: "api" }, -2, "Not an API platform."),
      rule(
        { field: "deployPreference", is: "self-hosted" },
        "exclude",
        "Netlify is not self-hosted.",
      ),
    ],
    scaling: scaling(
      "Static site plus optional functions.",
      "Split a real API off when the product becomes an app.",
      "Keep Netlify for content; apps live elsewhere.",
    ),
    pros: ["Simple.", "Free tier."],
    cons: ["Weaker full-stack story than Vercel."],
    meta: meta(2, 3, false, ["https://docs.netlify.com/"]),
  },
  {
    id: "cloudflare-workers",
    layer: "hosting",
    name: "Cloudflare Workers / Pages",
    summary:
      "Edge isolate runtime. Outstanding for latency-sensitive public sites and APIs; different programming constraints than Node.",
    plainSummary:
      "Your code runs in many places around the world on Cloudflare — fast for global users, with some programming limits.",
    tags: ["low-ops", "serverless", "hyperscale"],
    synergy: [
      {
        with: "cloudflare-cdn",
        bonus: 3,
        reason: "Workers sit on the same network as the CDN.",
      },
      {
        with: "hono",
        bonus: 2,
        reason: "Hono is a first-class Workers framework.",
      },
    ],
    rules: [
      rule(
        { field: "existingCloud", includes: "cloudflare" },
        3,
        "You already use Cloudflare.",
      ),
      rule(
        { field: "geo", is: "worldwide" },
        3,
        "Edge compute helps worldwide latency.",
      ),
      rule(
        { field: "deployPreference", is: "serverless" },
        2,
        "Workers are serverless isolates.",
      ),
      rule(
        { field: "product", is: "website" },
        2,
        "Pages is a strong content host.",
      ),
      rule(
        { field: "realtime", is: "multiplayer" },
        -1,
        "Durable Objects help, but WebRTC still needs a media layer.",
      ),
      rule(
        { field: "deployPreference", is: "self-hosted" },
        "exclude",
        "Workers are not self-hosted.",
      ),
    ],
    scaling: scaling(
      "Pages or a Worker plus KV/D1.",
      "Durable Objects for coordination; R2 for files.",
      "This network already is global; extract only specialized data planes.",
    ),
    pros: ["Global PoPs.", "Generous free tier."],
    cons: ["Not full Node.", "Vendor runtime."],
    meta: meta(2, 3, false, ["https://developers.cloudflare.com/workers/"]),
  },
  {
    id: "render",
    layer: "hosting",
    name: "Render",
    summary:
      "Heroku-style PaaS for web services, workers, and Postgres. Comfortable middle ground for Django/Rails/Node.",
    plainSummary:
      "A simple host that feels like a traditional server without you owning the machines — good for Python and Rails apps.",
    tags: ["low-ops", "paas"],
    synergy: [
      {
        with: "django",
        bonus: 2,
        reason: "Django + Render is a common PaaS pair.",
      },
      {
        with: "rails",
        bonus: 2,
        reason: "Render replaced a lot of Heroku Rails hosting.",
      },
    ],
    rules: [
      rule(
        { field: "deployPreference", is: "paas" },
        3,
        "Render is a managed PaaS.",
      ),
      rule(
        { field: "languages", anyOf: ["python", "ruby", "php"] },
        2,
        "Long-lived processes fit these frameworks.",
      ),
      rule(tinyTeam, 2, "You get deploys without Kubernetes."),
      rule(
        { field: "deployPreference", is: "self-hosted" },
        "exclude",
        "Render is not self-hosted.",
      ),
      rule(
        freeBudget,
        1,
        "Free tier exists but is thinner than Vercel for frontends.",
      ),
    ],
    scaling: scaling(
      "One web service + managed Postgres.",
      "Separate workers, Redis, autoscale.",
      "Move hot services to a cloud account or Kubernetes when needed.",
    ),
    pros: ["Simple long-lived processes.", "Managed Postgres."],
    cons: ["Less edge story than Vercel/Cloudflare."],
    meta: meta(2, 3, false, ["https://render.com/docs"]),
  },
  {
    id: "railway",
    layer: "hosting",
    name: "Railway",
    summary:
      "Developer PaaS that runs almost any container. Fast for prototypes; watch usage-based cost.",
    plainSummary:
      "A convenient place to run almost any app in the cloud without setting up a cloud account first.",
    tags: ["low-ops", "paas"],
    rules: [
      rule(
        { field: "timeline", is: "days" },
        2,
        "You can deploy from a repo in minutes.",
      ),
      rule({ field: "deployPreference", is: "paas" }, 2, "Railway is a PaaS."),
      rule(tinyTeam, 2, "Low ceremony."),
      rule(
        { field: "scaleAmbition", is: "billion" },
        -2,
        "You will leave a prototype PaaS.",
      ),
      rule(
        { field: "deployPreference", is: "self-hosted" },
        "exclude",
        "Railway is not self-hosted.",
      ),
    ],
    scaling: scaling(
      "One service and a plugin database.",
      "Split workers; watch the bill.",
      "Migrate to a major cloud.",
    ),
    pros: ["Anything in a container.", "Fast start."],
    cons: ["Cost at scale.", "Less enterprise posture."],
    meta: meta(2, 2, false, ["https://docs.railway.app/"]),
  },
  {
    id: "fly",
    layer: "hosting",
    name: "Fly.io",
    summary:
      "Run VMs close to users without a full Kubernetes install. Excellent for Phoenix, Remix, and Go binaries.",
    plainSummary:
      "Put small servers near your users around the world, without building a giant cloud setup.",
    tags: ["paas", "hyperscale"],
    synergy: [
      {
        with: "phoenix",
        bonus: 3,
        reason: "Phoenix clustering on Fly is a documented path.",
      },
      {
        with: "go",
        bonus: 1,
        reason: "A single binary is easy to run on Fly machines.",
      },
    ],
    rules: [
      rule(
        { field: "geo", anyOf: ["multi-region", "worldwide"] },
        3,
        "Machines in many regions is the point.",
      ),
      rule(
        { field: "deployPreference", anyOf: ["paas", "cloud"] },
        2,
        "You get VMs without EKS.",
      ),
      rule(
        { field: "realtime", anyOf: ["live", "collab"] },
        2,
        "Long-lived processes and global clustering help.",
      ),
      rule(
        { field: "languages", includes: "elixir" },
        2,
        "Fly is a Phoenix default.",
      ),
      rule(freeBudget, -1, "The free-tier story is thinner than Vercel."),
      rule(
        { field: "deployPreference", is: "self-hosted" },
        -1,
        "Fly is a hosted VM platform.",
      ),
    ],
    scaling: scaling(
      "One region, one machine.",
      "Multi-region machines and Fly Postgres or an external DB.",
      "Regional data, more machines, maybe Kubernetes later for extra control.",
    ),
    pros: ["Global VMs.", "No K8s required."],
    cons: ["You still operate processes."],
    meta: meta(2, 3, false, ["https://fly.io/docs/"]),
  },
  {
    id: "aws-lambda",
    layer: "hosting",
    name: "AWS Lambda",
    summary:
      "Functions on AWS. Right when you already live in AWS and traffic is spiky. Cold starts and connections need care.",
    plainSummary:
      "Amazon runs your code only when someone uses it — cheap when quiet, trickier for databases and live connections.",
    tags: ["serverless", "aws"],
    synergy: [
      {
        with: "dynamodb",
        bonus: 2,
        reason: "Lambda + DynamoDB avoids connection pooling pain.",
      },
      {
        with: "fastapi",
        bonus: 1,
        reason: "Mangum/API Gateway is a known pair.",
      },
    ],
    rules: [
      rule({ field: "existingCloud", includes: "aws" }, 3, "Stay in AWS."),
      rule(
        { field: "deployPreference", is: "serverless" },
        2,
        "Lambda is serverless.",
      ),
      rule(
        { field: "trafficPattern", is: "spiky" },
        2,
        "You pay for idle at near-zero.",
      ),
      rule(
        { field: "realtime", is: "multiplayer" },
        "exclude",
        "Multiplayer sockets are not a Lambda-only architecture.",
      ),
      rule({ field: "ops", is: "none" }, -1, "IAM and VPCs still exist."),
    ],
    scaling: scaling(
      "API Gateway + Lambda + a serverless DB.",
      "Provisioned concurrency for hot paths; RDS Proxy if you use SQL.",
      "Steady high QPS often moves to ECS/EKS; keep Lambda for spikes.",
    ),
    pros: ["Scale to zero.", "AWS ecosystem."],
    cons: ["Cold starts.", "IAM complexity."],
    meta: meta(3, 3, false, ["https://docs.aws.amazon.com/lambda/"]),
  },
  {
    id: "aws-ecs",
    layer: "hosting",
    name: "AWS ECS / Fargate",
    summary:
      "Managed containers on AWS without Kubernetes. A sensible default for Nest, Go, and Spring on AWS.",
    plainSummary:
      "Amazon runs your containers for you — more control than functions, less complexity than Kubernetes.",
    tags: ["aws", "paas"],
    rules: [
      rule(
        { field: "existingCloud", includes: "aws" },
        3,
        "ECS is the lighter AWS container path.",
      ),
      rule(
        { field: "deployPreference", is: "cloud" },
        3,
        "You want your own AWS account.",
      ),
      rule(
        { field: "ops", is: "light" },
        2,
        "Fargate removes node management.",
      ),
      rule(
        { field: "ops", is: "none" },
        -2,
        "AWS accounts still need someone.",
      ),
      rule(
        { field: "deployPreference", is: "self-hosted" },
        "exclude",
        "ECS is not on-prem.",
      ),
    ],
    scaling: scaling(
      "One Fargate service and RDS.",
      "Autoscaling services, ALB, SQS.",
      "Consider EKS only if you need Kubernetes features.",
    ),
    pros: ["Containers without K8s.", "AWS integrations."],
    cons: ["AWS complexity remains."],
    meta: meta(3, 3, false, ["https://docs.aws.amazon.com/ecs/"]),
  },
  {
    id: "aws-eks",
    layer: "hosting",
    name: "Amazon EKS",
    summary:
      "Managed Kubernetes on AWS. For platform teams that already standardized on K8s.",
    plainSummary:
      "Amazon’s Kubernetes — powerful, and only worth it if you have people to run it.",
    tags: ["aws", "high-ops", "hyperscale", "kubernetes"],
    synergy: [
      { with: "kubernetes", bonus: 3, reason: "EKS is Kubernetes on AWS." },
    ],
    rules: [
      rule(
        { field: "existingCloud", includes: "aws" },
        2,
        "EKS if you must do K8s on AWS.",
      ),
      rule(dedicatedOps, 3, "You have a platform team."),
      rule(
        { field: "scaleAmbition", anyOf: ["global", "billion"] },
        2,
        "K8s is a known huge-scale control plane.",
      ),
      rule(
        { field: "ops", is: "none" },
        "exclude",
        "Do not buy EKS with nobody to operate it.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        "exclude",
        "EKS is the wrong first host.",
      ),
    ],
    scaling: scaling(
      "Skip EKS at 10K users.",
      "One cluster, HPAs, managed node groups.",
      "Multi-cluster, mesh or a thin gateway, multi-region.",
    ),
    pros: ["AWS + K8s ecosystem."],
    cons: ["Expensive to operate poorly."],
    meta: meta(3, 3, false, ["https://docs.aws.amazon.com/eks/"]),
  },
  {
    id: "gcp-cloud-run",
    layer: "hosting",
    name: "Google Cloud Run",
    summary:
      "Request-scaled containers on GCP. Excellent middle path between functions and GKE.",
    plainSummary:
      "Google runs your container only when needed — simpler than Kubernetes on Google Cloud.",
    tags: ["gcp", "serverless", "low-ops"],
    rules: [
      rule(
        { field: "existingCloud", includes: "gcp" },
        3,
        "Cloud Run is the friendly GCP host.",
      ),
      rule(
        { field: "deployPreference", anyOf: ["serverless", "paas", "cloud"] },
        2,
        "Containers without nodes.",
      ),
      rule(
        { field: "languages", includes: "python" },
        1,
        "A common FastAPI/Django (as container) host.",
      ),
      rule(
        { field: "deployPreference", is: "self-hosted" },
        "exclude",
        "Cloud Run is not on-prem.",
      ),
    ],
    scaling: scaling(
      "One Cloud Run service and Cloud SQL.",
      "Min instances for latency; Pub/Sub for jobs.",
      "GKE only if you outgrow Run’s model.",
    ),
    pros: ["Scale to zero.", "Any container."],
    cons: ["GCP lock-in.", "Request timeout limits."],
    meta: meta(2, 3, false, ["https://cloud.google.com/run/docs"]),
  },
  {
    id: "azure-app",
    layer: "hosting",
    name: "Azure App Service / Container Apps",
    summary:
      "Microsoft’s PaaS for web and containers. Default when the org is already on Azure.",
    plainSummary:
      "Microsoft’s managed place to run websites and APIs — natural if you already use Azure.",
    tags: ["azure", "paas", "low-ops"],
    synergy: [
      {
        with: "aspnet",
        bonus: 3,
        reason: "First-class .NET hosting on Azure.",
      },
    ],
    rules: [
      rule(
        { field: "existingCloud", anyOf: ["azure", "microsoft"] },
        3,
        "Stay on Azure.",
      ),
      rule(
        { field: "languages", includes: "csharp" },
        3,
        ".NET on App Service is the paved road.",
      ),
      rule(
        { field: "deployPreference", anyOf: ["paas", "serverless", "cloud"] },
        2,
        "Managed Azure compute.",
      ),
      rule(
        { field: "deployPreference", is: "self-hosted" },
        "exclude",
        "App Service is not on-prem (use AKS/Arc for that).",
      ),
    ],
    scaling: scaling(
      "One App Service plan or Container App.",
      "Autoscale and Azure SQL + Redis.",
      "Regional stamps and Front Door.",
    ),
    pros: ["Identity, slots, logs.", ".NET native."],
    cons: ["Easy to over-provision SKUs."],
    meta: meta(3, 3, false, ["https://learn.microsoft.com/azure/app-service/"]),
  },
  {
    id: "digitalocean",
    layer: "hosting",
    name: "DigitalOcean App Platform / Droplets",
    summary:
      "Simple VMs and a small PaaS. Honest pricing; you operate more than on Vercel.",
    plainSummary:
      "Straightforward cloud servers with simple pricing — good when you want a machine without a giant cloud bill.",
    tags: ["paas"],
    rules: [
      rule(
        { field: "budget", anyOf: ["under-50", "50-500"] },
        2,
        "Pricing is predictable.",
      ),
      rule({ field: "ops", is: "light" }, 2, "A developer can run a droplet."),
      rule(
        { field: "deployPreference", anyOf: ["paas", "cloud", "self-hosted"] },
        1,
        "VMs you can SSH to.",
      ),
      rule({ field: "ops", is: "none" }, -2, "Someone has to patch the box."),
    ],
    scaling: scaling(
      "One app platform service or droplet.",
      "Managed DB + more droplets behind a load balancer.",
      "Graduate to a major cloud or Kubernetes.",
    ),
    pros: ["Simple pricing.", "Human docs."],
    cons: ["Fewer enterprise services."],
    meta: meta(2, 3, false, ["https://docs.digitalocean.com/"]),
  },
  {
    id: "coolify",
    layer: "hosting",
    name: "VPS + Docker (Coolify / Dokku)",
    summary:
      "Self-hosted PaaS on a VPS. Maximum portability and low cost; you own backups and uptime.",
    plainSummary:
      "Your own small server that deploys like a mini Heroku — cheapest, and you are the operator.",
    tags: ["self-hosted", "high-ops"],
    rules: [
      rule(
        { field: "deployPreference", is: "self-hosted" },
        3,
        "This is self-hosted.",
      ),
      rule(
        { field: "lockIn", is: "portable" },
        3,
        "You can pick up the Compose file and leave.",
      ),
      rule(freeBudget, 2, "A $5 VPS often beats many PaaS bills."),
      rule(
        { field: "ops", is: "none" },
        "exclude",
        "Someone must manage the VPS.",
      ),
      rule(
        { field: "compliance", includes: "hipaa" },
        -2,
        "You own the whole compliance boundary.",
      ),
    ],
    scaling: scaling(
      "One VPS and Docker Compose or Coolify.",
      "A second box, off-box Postgres, and backups you test.",
      "Move to Kubernetes or a major cloud when one VPS is a joke.",
    ),
    pros: ["Cost.", "Portability."],
    cons: ["You are SRE."],
    meta: meta(2, 3, true, ["https://coolify.io/docs"]),
  },
  {
    id: "kubernetes",
    layer: "hosting",
    name: "Kubernetes",
    summary:
      "The portable container control plane. Correct with a platform team and a path to 1B; a false economy on a free tier.",
    plainSummary:
      "The industry standard for running many services — powerful, and a bad idea if nobody is on call for it.",
    tags: ["high-ops", "hyperscale", "kubernetes"],
    synergy: [
      {
        with: "go",
        bonus: 2,
        reason: "Go services on Kubernetes are a known hyperscale shape.",
      },
      {
        with: "spring",
        bonus: 2,
        reason: "Spring + K8s is a common enterprise pair.",
      },
    ],
    rules: [
      rule(
        { field: "deployPreference", anyOf: ["self-hosted", "cloud"] },
        2,
        "K8s runs in your account or on-prem.",
      ),
      rule(dedicatedOps, 3, "You have people to operate it."),
      rule(
        { field: "scaleAmbition", anyOf: ["global", "billion"] },
        3,
        "This is a proven 1B-user control plane.",
      ),
      rule(
        { field: "scaleYear1", is: "1m-plus" },
        2,
        "You may already need it.",
      ),
      rule(
        { field: "ops", is: "none" },
        "exclude",
        "Kubernetes with nobody to run it will fail.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        "exclude",
        "Do not start a first product on Kubernetes.",
      ),
      rule(freeBudget, "exclude", "Free-tier Kubernetes is a false economy."),
      rule(enterpriseBudget, 2, "You can staff it."),
    ],
    scaling: scaling(
      "Do not. Use a PaaS or one VM.",
      "One cluster, HPAs, managed node groups.",
      "Multi-cluster, policy, and a real SRE practice.",
    ),
    pros: ["Portable.", "Huge ecosystem."],
    cons: ["Operational cost.", "Slowest beginner path."],
    meta: meta(3, 3, true, ["https://kubernetes.io/docs/home/"]),
  },
];
