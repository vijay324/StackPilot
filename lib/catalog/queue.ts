import type { Component } from "@/lib/types";
import { meta, rule, scaling } from "./helpers";

export const QUEUES: Component[] = [
  {
    id: "bullmq",
    layer: "queue",
    name: "BullMQ",
    summary:
      "Redis-backed jobs for Node/TypeScript. Simple and enough until you need a dedicated broker.",
    plainSummary:
      "A way for a TypeScript app to send email and other slow work to the background.",
    tags: ["queue", "typescript"],
    synergy: [
      { with: "redis", bonus: 3, reason: "BullMQ runs on Redis." },
      { with: "hono", bonus: 1, reason: "Node/TS APIs commonly use BullMQ." },
    ],
    rules: [
      rule(
        { field: "languages", includes: "typescript" },
        3,
        "BullMQ is a Node job library.",
      ),
      rule(
        { field: "integrations", includes: "jobs" },
        3,
        "You asked for background jobs.",
      ),
      rule(
        { field: "trafficPattern", is: "spiky" },
        1,
        "Queues absorb spikes.",
      ),
      rule(
        { field: "languages", includes: "python" },
        -2,
        "Use Celery in Python.",
      ),
    ],
    scaling: scaling(
      "One Redis and a worker process.",
      "Rate limiters and separate queues per concern.",
      "Move to SQS, Kafka, or Temporal when Redis-as-broker hurts.",
    ),
    pros: ["Simple.", "Same language as the API."],
    cons: ["Redis is now critical infrastructure."],
    meta: meta(3, 3, true, ["https://docs.bullmq.io/"]),
  },
  {
    id: "sidekiq",
    layer: "queue",
    name: "Sidekiq",
    summary: "The Rails background job runner on Redis.",
    plainSummary:
      "The usual way a Rails app sends email and other slow work to the background.",
    tags: ["queue", "ruby"],
    synergy: [
      { with: "rails", bonus: 3, reason: "Sidekiq is the Rails default." },
    ],
    rules: [
      rule(
        { field: "languages", includes: "ruby" },
        3,
        "Sidekiq is the Ruby job runner.",
      ),
      rule(
        { field: "integrations", includes: "jobs" },
        3,
        "You asked for jobs.",
      ),
      rule(
        { not: { field: "languages", includes: "ruby" } },
        -2,
        "Sidekiq is for Ruby.",
      ),
    ],
    scaling: scaling(
      "One Redis, one Sidekiq process.",
      "More concurrency, queues, and cron.",
      "Keep Sidekiq for product jobs; dedicated brokers for event buses.",
    ),
    pros: ["Excellent Rails DX."],
    cons: ["Ruby-specific."],
    meta: meta(2, 3, true, ["https://github.com/sidekiq/sidekiq/wiki"]),
  },
  {
    id: "celery",
    layer: "queue",
    name: "Celery",
    summary:
      "Python distributed tasks, usually on Redis or RabbitMQ. The Django/FastAPI default.",
    plainSummary: "The usual Python way to run work in the background.",
    tags: ["queue", "python"],
    synergy: [
      {
        with: "django",
        bonus: 2,
        reason: "Celery is the usual Django worker.",
      },
    ],
    rules: [
      rule(
        { field: "languages", includes: "python" },
        3,
        "Celery is the Python task queue.",
      ),
      rule(
        { field: "integrations", includes: "jobs" },
        3,
        "You asked for jobs.",
      ),
      rule(
        { field: "ai", anyOf: ["rag", "train"] },
        1,
        "Model and embedding jobs fit workers.",
      ),
    ],
    scaling: scaling(
      "Celery + Redis.",
      "Separate queues, Flower, autoscaled workers.",
      "Consider Temporal for long workflows.",
    ),
    pros: ["Python-native.", "Mature."],
    cons: ["Operational moving parts."],
    meta: meta(3, 3, true, ["https://docs.celeryq.dev/"]),
  },
  {
    id: "sqs",
    layer: "queue",
    name: "Amazon SQS",
    summary: "Managed AWS queues. Right when you already live in AWS.",
    plainSummary: "Amazon’s hosted job queue — you do not run the broker.",
    tags: ["queue", "aws", "low-ops"],
    rules: [
      rule(
        { field: "existingCloud", includes: "aws" },
        3,
        "SQS is the AWS queue.",
      ),
      rule({ field: "integrations", includes: "jobs" }, 2, "You need a queue."),
      rule({ field: "ops", is: "none" }, 1, "Fully managed."),
      rule(
        { field: "existingCloud", includes: "gcp" },
        -2,
        "Use Pub/Sub on GCP.",
      ),
    ],
    scaling: scaling(
      "One queue and a worker (Lambda or ECS).",
      "DLQs and FIFO where needed.",
      "This already scales; add EventBridge/Kafka only for fan-out complexity.",
    ),
    pros: ["Managed.", "Cheap."],
    cons: ["AWS-only."],
    meta: meta(3, 3, false, ["https://docs.aws.amazon.com/sqs/"]),
  },
  {
    id: "pubsub",
    layer: "queue",
    name: "Google Pub/Sub",
    summary: "Managed pub/sub on GCP.",
    plainSummary: "Google’s hosted event bus.",
    tags: ["queue", "gcp"],
    rules: [
      rule(
        { field: "existingCloud", includes: "gcp" },
        3,
        "Pub/Sub is native GCP.",
      ),
      rule(
        { field: "integrations", includes: "jobs" },
        2,
        "You need async work.",
      ),
      rule(
        { field: "existingCloud", includes: "aws" },
        -2,
        "Use SQS/SNS on AWS.",
      ),
    ],
    scaling: scaling(
      "One topic and a push/pull subscriber.",
      "Dead-letter topics.",
      "This already scales globally.",
    ),
    pros: ["Managed global bus."],
    cons: ["GCP-only."],
    meta: meta(2, 3, false, ["https://cloud.google.com/pubsub/docs"]),
  },
  {
    id: "rabbitmq",
    layer: "queue",
    name: "RabbitMQ",
    summary:
      "Traditional AMQP broker. Flexible routing; you operate it (or pay a vendor).",
    plainSummary:
      "A classic message broker — flexible, and someone has to run it.",
    tags: ["queue", "high-ops"],
    rules: [
      rule(
        { field: "integrations", includes: "jobs" },
        1,
        "It can be your job broker.",
      ),
      rule({ field: "ops", is: "dedicated" }, 2, "You can operate a broker."),
      rule(
        { field: "ops", is: "none" },
        -3,
        "Do not self-host RabbitMQ with zero ops.",
      ),
    ],
    scaling: scaling(
      "A managed RabbitMQ (CloudAMQP) is enough.",
      "Mirrored queues or quorum queues.",
      "Often replaced by Kafka at huge event volume.",
    ),
    pros: ["Routing flexibility."],
    cons: ["Ops."],
    meta: meta(2, 3, true, ["https://www.rabbitmq.com/docs"]),
  },
  {
    id: "kafka",
    layer: "queue",
    name: "Kafka / Redpanda",
    summary:
      "Event log for high-volume streaming. Wrong for a CRUD app; right as a backbone at large event rates.",
    plainSummary:
      "A system for recording huge streams of events — overkill until you actually have that volume.",
    tags: ["queue", "hyperscale", "high-ops"],
    rules: [
      rule(
        { field: "product", is: "analytics" },
        2,
        "Event pipelines often land on Kafka.",
      ),
      rule(
        { field: "scaleAmbition", is: "billion" },
        3,
        "This is a 1B-event backbone.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        "exclude",
        "Do not start here.",
      ),
      rule(
        { field: "ops", is: "none" },
        "exclude",
        "Kafka needs operators or a pricey cloud.",
      ),
      rule(
        { field: "integrations", includes: "jobs" },
        -2,
        "A job queue is not the same as an event log.",
      ),
    ],
    scaling: scaling(
      "Do not. Use a queue + warehouse.",
      "Managed Kafka (MSK/Confluent) once fan-out demands it.",
      "Multi-cluster, tiered storage, schema registry.",
    ),
    pros: ["Replay.", "Huge throughput."],
    cons: ["Operationally expensive.", "Wrong for beginners."],
    meta: meta(2, 3, true, ["https://kafka.apache.org/documentation/"]),
  },
  {
    id: "inngest",
    layer: "queue",
    name: "Inngest / Trigger.dev",
    summary:
      "Managed durable functions for TypeScript products. Fastest path when you do not want Redis+workers.",
    plainSummary:
      "A hosted way to run background steps and retries without setting up Redis.",
    tags: ["queue", "low-ops", "typescript"],
    rules: [
      rule(
        { field: "languages", includes: "typescript" },
        2,
        "These products are TS-first.",
      ),
      rule({ field: "ops", is: "none" }, 3, "Fully managed jobs."),
      rule(
        { field: "integrations", includes: "jobs" },
        2,
        "You asked for jobs.",
      ),
      rule(
        { field: "lockIn", is: "portable" },
        -1,
        "You depend on a SaaS runner.",
      ),
    ],
    scaling: scaling(
      "One Inngest/Trigger app next to Next.js.",
      "Fan-out functions; watch step volume.",
      "Move huge fan-out to SQS/Kafka; keep these for product workflows.",
    ),
    pros: ["No Redis to run.", "Great DX."],
    cons: ["Vendor.", "Not an event bus."],
    meta: meta(2, 2, false, ["https://www.inngest.com/docs"]),
  },
  {
    id: "temporal",
    layer: "queue",
    name: "Temporal",
    summary:
      "Durable workflow engine. Right for long-running, failure-prone business processes — not email blasts.",
    plainSummary:
      "A specialist tool for long business processes that must not get stuck halfway.",
    tags: ["queue", "high-ops"],
    rules: [
      rule(
        { field: "payments", is: "marketplace" },
        2,
        "Payouts and multi-step money fit workflows.",
      ),
      rule(
        { field: "ops", is: "dedicated" },
        2,
        "You can run or pay for Temporal Cloud.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        -2,
        "Too much machinery for a first product.",
      ),
      rule(
        { field: "integrations", includes: "jobs" },
        1,
        "Workflows can replace ad-hoc jobs.",
      ),
    ],
    scaling: scaling(
      "Temporal Cloud and a small worker.",
      "Namespaces per domain.",
      "This is already a serious control plane; scale workers and persistence.",
    ),
    pros: ["Durable execution.", "Visible workflows."],
    cons: ["Learning curve.", "Ops if self-hosted."],
    meta: meta(2, 3, true, ["https://docs.temporal.io/"]),
  },
];
