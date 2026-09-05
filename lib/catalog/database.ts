import type { Component } from "@/lib/types";
import {
  enterpriseBudget,
  freeBudget,
  meta,
  rule,
  scaling,
  tinyTeam,
} from "./helpers";

export const DATABASES: Component[] = [
  {
    id: "postgres",
    layer: "database",
    name: "PostgreSQL",
    summary:
      "The default relational database. Runs on Neon, Supabase, RDS, Cloud SQL, or your own VMs. JSON, full-text, and pgvector extend it.",
    plainSummary:
      "The standard database for most products — it keeps related records (users, orders, invoices) consistent.",
    tags: ["sql", "relational"],
    synergy: [
      { with: "supabase", bonus: 3, reason: "Supabase is managed Postgres." },
      {
        with: "django",
        bonus: 2,
        reason: "Django’s ORM is at its best on Postgres.",
      },
      {
        with: "next-builtin",
        bonus: 1,
        reason: "Serverless drivers (Neon, Supabase) fit Next.js.",
      },
    ],
    rules: [
      rule(
        { field: "dataShape", is: "relational" },
        3,
        "Postgres is the default relational store.",
      ),
      rule(
        { field: "dataShape", is: "unsure" },
        3,
        "When the data shape is unclear, Postgres is the safe default.",
      ),
      rule(
        { field: "consistency", anyOf: ["strong", "unsure"] },
        3,
        "Transactions keep money and inventory correct.",
      ),
      rule(
        { field: "product", anyOf: ["webapp", "store", "internal", "api"] },
        2,
        "Most product domains are relational.",
      ),
      rule(
        { field: "search", is: "filter" },
        1,
        "Indexes and SQL cover basic filtering.",
      ),
      rule(
        { field: "ai", is: "rag" },
        1,
        "pgvector can start RAG without another vendor.",
      ),
      rule(
        tinyTeam,
        2,
        "Managed Postgres (Neon/Supabase) needs almost no ops.",
      ),
      rule(
        freeBudget,
        2,
        "Neon, Supabase, and RDS-equivalent free tiers exist.",
      ),
      rule(
        { field: "dataShape", is: "graph" },
        -2,
        "A graph query model is a poor fit.",
      ),
      rule(
        { field: "dataShape", is: "timeseries" },
        -1,
        "Works, but Timescale or a TSDB may fit better.",
      ),
    ],
    scaling: scaling(
      "One managed instance (Neon, Supabase, RDS) with connection pooling.",
      "Read replicas, better indexes, and a cache in front of hot keys.",
      "Partition or move to distributed SQL; keep Postgres as the system of record as long as it holds.",
    ),
    pros: ["Transactions, SQL, extensions.", "Runs anywhere."],
    cons: ["A single primary becomes the write bottleneck at extreme scale."],
    meta: meta(3, 3, true, ["https://www.postgresql.org/docs/"]),
  },
  {
    id: "mysql",
    layer: "database",
    name: "MySQL / PlanetScale",
    summary:
      "Relational MySQL, including Vitess-backed PlanetScale for branching and sharding. Natural with Laravel and many PHP hosts.",
    plainSummary:
      "Another standard relational database, common with PHP and some large internet companies.",
    tags: ["sql", "relational"],
    synergy: [
      { with: "laravel", bonus: 2, reason: "Laravel’s default is MySQL." },
    ],
    rules: [
      rule(
        { field: "dataShape", is: "relational" },
        2,
        "MySQL is a capable relational store.",
      ),
      rule(
        { field: "languages", includes: "php" },
        2,
        "The PHP world standardizes on MySQL.",
      ),
      rule(
        { field: "dataShape", is: "unsure" },
        1,
        "Postgres is usually the safer default, but MySQL works.",
      ),
      rule(
        { field: "consistency", is: "strong" },
        2,
        "InnoDB transactions are solid.",
      ),
    ],
    scaling: scaling(
      "One managed MySQL.",
      "Read replicas or PlanetScale/Vitess when writes spread out.",
      "Vitess sharding or a move to distributed SQL.",
    ),
    pros: ["Familiar, cheap hosting.", "Vitess path to shards."],
    cons: ["Fewer extensions than Postgres."],
    meta: meta(3, 3, true, ["https://dev.mysql.com/doc/"]),
  },
  {
    id: "sqlite",
    layer: "database",
    name: "SQLite (Turso / libSQL)",
    summary:
      "Embedded SQL. Perfect for local-first, edge, and tiny products. Not a multi-writer 1B OLTP plane.",
    plainSummary:
      "A database that lives in a file — simple and fast to start, limited when many people write at once.",
    tags: ["sql", "hobby"],
    rules: [
      rule(
        { field: "dataVolume", is: "small" },
        2,
        "SQLite is plenty for small data.",
      ),
      rule(
        { field: "offline", is: "sync" },
        3,
        "Embedded SQL is the local-first default.",
      ),
      rule(
        { field: "timeline", is: "days" },
        2,
        "Zero database servers to provision.",
      ),
      rule(
        { field: "scaleYear1", anyOf: ["100k-1m", "1m-plus"] },
        -3,
        "Multi-writer OLTP at this size is not SQLite’s job.",
      ),
      rule(
        { field: "scaleAmbition", is: "billion" },
        -3,
        "Plan a client/server database.",
      ),
    ],
    scaling: scaling(
      "One file or Turso replica.",
      "Move writes to Postgres before contention.",
      "Keep SQLite on clients for local-first; server of record elsewhere.",
    ),
    pros: ["Zero ops.", "Local-first."],
    cons: ["Write concurrency limits."],
    meta: meta(3, 3, true, ["https://sqlite.org/docs.html"]),
  },
  {
    id: "mongodb",
    layer: "database",
    name: "MongoDB Atlas",
    summary:
      "Document store with a flexible schema. Good while the product is still changing; reporting and relations get painful later.",
    plainSummary:
      "A database that stores flexible records — handy when the shape of data keeps changing.",
    tags: ["document"],
    rules: [
      rule(
        { field: "dataShape", is: "document" },
        3,
        "MongoDB is a document database.",
      ),
      rule(
        { field: "dataShape", is: "relational" },
        -2,
        "Relations and reporting get painful.",
      ),
      rule(
        { field: "consistency", is: "strong" },
        -1,
        "You can have transactions, but SQL DBs are clearer for money.",
      ),
      rule(freeBudget, 1, "Atlas has a free tier."),
      rule(
        { field: "product", anyOf: ["webapp", "api", "mobile"] },
        1,
        "A common API default when schemas are still moving.",
      ),
    ],
    scaling: scaling(
      "Atlas M0/M10 and indexes as a religion.",
      "Replica set, Redis, maybe search.",
      "Sharded Atlas, or a move to a more structured store for the system of record.",
    ),
    pros: ["Schema flexibility.", "Familiar JS JSON documents."],
    cons: ["Integrity and analytics later."],
    meta: meta(3, 3, true, ["https://www.mongodb.com/docs/atlas/"]),
  },
  {
    id: "dynamodb",
    layer: "database",
    name: "DynamoDB",
    summary:
      "AWS key-value/document with huge scale if you design access patterns up front. Ties you to AWS.",
    plainSummary:
      "A Google-scale style database on AWS — extremely scalable if you design it carefully from day one.",
    tags: ["document", "hyperscale", "lock-in"],
    synergy: [
      {
        with: "aws-lambda",
        bonus: 2,
        reason: "Lambda + DynamoDB is a classic serverless AWS pair.",
      },
    ],
    rules: [
      rule(
        { field: "existingCloud", includes: "aws" },
        2,
        "DynamoDB is native AWS.",
      ),
      rule(
        { field: "scaleAmbition", anyOf: ["global", "billion"] },
        2,
        "This is a proven huge-scale data plane.",
      ),
      rule(
        { field: "dataShape", is: "document" },
        1,
        "Item design is document-like.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        -3,
        "Access-pattern design is easy to get wrong.",
      ),
      rule(
        { field: "consistency", is: "strong" },
        -1,
        "Single-item strong reads; multi-item is harder.",
      ),
    ],
    scaling: scaling(
      "On-demand tables and careful keys.",
      "GSIs, Streams, and DAX if needed.",
      "This is already a 1B-item shape if keys were designed well.",
    ),
    pros: ["Operational scale.", "Serverless billing."],
    cons: ["You must know queries in advance.", "AWS lock-in."],
    meta: meta(2, 3, false, ["https://docs.aws.amazon.com/dynamodb/"]),
  },
  {
    id: "firestore",
    layer: "database",
    name: "Cloud Firestore",
    summary:
      "Firebase’s document database with realtime listeners. Excellent mobile sync; relational domains fight it.",
    plainSummary:
      "A live document database that phones can subscribe to — simple until the data needs lots of relationships.",
    tags: ["document", "lock-in", "hobby"],
    synergy: [
      {
        with: "firebase",
        bonus: 3,
        reason: "Firestore is the Firebase database.",
      },
    ],
    rules: [
      rule(
        { field: "dataShape", is: "document" },
        3,
        "Firestore is a document store.",
      ),
      rule(
        { field: "realtime", anyOf: ["live", "collab"] },
        2,
        "Listeners are built in.",
      ),
      rule(
        { field: "dataShape", is: "relational" },
        -3,
        "Joins are not the model.",
      ),
      rule(
        { field: "compliance", includes: "hipaa" },
        "exclude",
        "Hobby Firestore is the wrong HIPAA store.",
      ),
    ],
    scaling: scaling(
      "One Firestore project.",
      "Denormalize; watch billed reads.",
      "Move the system of record if query patterns explode.",
    ),
    pros: ["Realtime listeners.", "Mobile SDKs."],
    cons: ["Read billing.", "Awkward relations."],
    meta: meta(3, 3, false, ["https://firebase.google.com/docs/firestore"]),
  },
  {
    id: "cassandra",
    layer: "database",
    name: "Cassandra / ScyllaDB",
    summary:
      "Wide-column store for huge write volumes and multi-datacenter availability. Ops-heavy; wrong for a CRUD app.",
    plainSummary:
      "A database built for enormous streams of writes across the world — overkill for a normal app.",
    tags: ["hyperscale", "high-ops"],
    rules: [
      rule(
        { field: "scaleAmbition", is: "billion" },
        2,
        "This is a 1B-event write path.",
      ),
      rule({ field: "readWrite", is: "write-heavy" }, 2, "Write-optimized."),
      rule(
        { field: "team", is: "solo-learning" },
        "exclude",
        "Do not start here.",
      ),
      rule(
        { field: "ops", is: "none" },
        "exclude",
        "You cannot run Cassandra with zero ops.",
      ),
      rule(
        { field: "product", anyOf: ["webapp", "website"] },
        -2,
        "Wrong default for a product CRUD store.",
      ),
    ],
    scaling: scaling(
      "Do not start here — Postgres will do.",
      "Managed Scylla or Astra once write volume demands it.",
      "Multi-DC clusters with careful partition keys.",
    ),
    pros: ["Write scale.", "Multi-DC."],
    cons: ["Operational cost.", "No relational model."],
    meta: meta(1, 3, true, ["https://cassandra.apache.org/_/index.html"]),
  },
  {
    id: "cockroach",
    layer: "database",
    name: "CockroachDB",
    summary:
      "Distributed SQL with Postgres dialect. For global, strongly consistent OLTP when a single primary will not do.",
    plainSummary:
      "Postgres-like SQL that can run in many regions at once — for when one database server is not enough.",
    tags: ["sql", "hyperscale"],
    rules: [
      rule(
        { field: "dataShape", anyOf: ["relational", "unsure"] },
        2,
        "It speaks SQL.",
      ),
      rule(
        { field: "geo", anyOf: ["multi-region", "worldwide"] },
        3,
        "Surviving regions is the point.",
      ),
      rule(
        { field: "scaleAmbition", anyOf: ["global", "billion"] },
        3,
        "Distributed SQL is a 1B OLTP shape.",
      ),
      rule(
        { field: "consistency", is: "strong" },
        3,
        "Serializability is a design goal.",
      ),
      rule(freeBudget, -2, "Distributed SQL is not a free-tier default."),
      rule(
        { field: "ops", is: "none" },
        -1,
        "Use the dedicated cloud, not self-hosted, if nobody operates DBs.",
      ),
    ],
    scaling: scaling(
      "Cockroach Cloud serverless for a small global app.",
      "Regional tables and follower reads.",
      "This is already the 1B OLTP shape; watch tail latency and topology.",
    ),
    pros: ["SQL + multi-region.", "Postgres dialect."],
    cons: ["Cost and complexity vs single-node Postgres."],
    meta: meta(2, 3, true, ["https://www.cockroachlabs.com/docs/"]),
  },
  {
    id: "spanner",
    layer: "database",
    name: "Google Spanner",
    summary:
      "Google’s globally consistent SQL. Right on GCP at huge scale; expensive and proprietary.",
    plainSummary:
      "Google’s worldwide SQL database — extremely capable, and tied to Google Cloud.",
    tags: ["sql", "hyperscale", "lock-in"],
    rules: [
      rule(
        { field: "existingCloud", includes: "gcp" },
        3,
        "Spanner lives on GCP.",
      ),
      rule(
        { field: "scaleAmbition", is: "billion" },
        3,
        "This is a true 1B OLTP option.",
      ),
      rule(
        { field: "geo", is: "worldwide" },
        3,
        "Global consistency is the product.",
      ),
      rule(enterpriseBudget, 2, "You can afford it."),
      rule(freeBudget, "exclude", "Spanner is not a free-tier database."),
      rule(
        { field: "team", is: "solo-learning" },
        "exclude",
        "Wrong first database.",
      ),
    ],
    scaling: scaling(
      "Do not start here.",
      "Move specific global tables when a primary Postgres fails.",
      "Regional configurations and autoscaling nodes.",
    ),
    pros: ["Global consistency.", "SQL."],
    cons: ["GCP lock-in.", "Price."],
    meta: meta(2, 3, false, ["https://cloud.google.com/spanner/docs"]),
  },
  {
    id: "yugabyte",
    layer: "database",
    name: "YugabyteDB",
    summary:
      "Open-source distributed SQL with Postgres compatibility. Alternative to Cockroach when you want to self-host.",
    plainSummary:
      "Open-source SQL that can spread across servers — a portable cousin of the big distributed databases.",
    tags: ["sql", "hyperscale"],
    rules: [
      rule({ field: "lockIn", is: "portable" }, 2, "You can self-host."),
      rule(
        { field: "dataShape", anyOf: ["relational", "unsure"] },
        2,
        "Postgres-compatible SQL.",
      ),
      rule(
        { field: "scaleAmbition", anyOf: ["global", "billion"] },
        2,
        "Distributed SQL headroom.",
      ),
      rule(
        { field: "ops", is: "none" },
        -2,
        "Self-hosting distributed SQL needs operators.",
      ),
    ],
    scaling: scaling(
      "Managed Yugabyte or a small cluster.",
      "Add regions.",
      "Tune tablet leaders and connection pooling.",
    ),
    pros: ["Postgres compat.", "Open source."],
    cons: ["Ops if self-hosted."],
    meta: meta(1, 2, true, ["https://docs.yugabyte.com/"]),
  },
  {
    id: "timescaledb",
    layer: "database",
    name: "TimescaleDB",
    summary:
      "Postgres extension for time-series. Keep SQL and hypertables instead of a separate TSDB when events are the data.",
    plainSummary:
      "Postgres, tuned for measurements over time — sensors, metrics, activity.",
    tags: ["sql", "timeseries"],
    synergy: [{ with: "postgres", bonus: 2, reason: "Timescale is Postgres." }],
    rules: [
      rule(
        { field: "dataShape", is: "timeseries" },
        3,
        "Hypertables are built for time-series.",
      ),
      rule(
        { field: "product", is: "analytics" },
        1,
        "Useful as a hot store before a warehouse.",
      ),
      rule(
        { field: "dataShape", is: "relational" },
        -1,
        "Use vanilla Postgres unless you actually have time-series.",
      ),
    ],
    scaling: scaling(
      "One Timescale (or Timescale Cloud) instance.",
      "Compression and retention policies.",
      "Tier old data to a warehouse; keep hot windows in Timescale.",
    ),
    pros: ["SQL + time-series.", "Postgres ecosystem."],
    cons: ["Not a graph or document DB."],
    meta: meta(2, 3, true, ["https://docs.timescale.com/"]),
  },
  {
    id: "neo4j",
    layer: "database",
    name: "Neo4j",
    summary:
      "Graph database for connections-first domains: recommendations, fraud, knowledge graphs.",
    plainSummary:
      "A database built for networks of relationships — friends, fraud rings, recommendations.",
    tags: ["graph"],
    rules: [
      rule(
        { field: "dataShape", is: "graph" },
        3,
        "Neo4j is a graph database.",
      ),
      rule(
        { field: "dataShape", anyOf: ["relational", "document", "unsure"] },
        -2,
        "Do not use a graph DB as your only store without a graph domain.",
      ),
      rule(
        { field: "product", is: "analytics" },
        1,
        "Graph analytics can live here.",
      ),
    ],
    scaling: scaling(
      "Aura free/pro for a prototype.",
      "Causal cluster when the graph is hot.",
      "Keep Neo4j for the graph; OLTP system of record may still be SQL.",
    ),
    pros: ["Cypher for traversals."],
    cons: ["Wrong as a general app DB."],
    meta: meta(2, 3, true, ["https://neo4j.com/docs/"]),
  },
  {
    id: "clickhouse-olap",
    layer: "database",
    name: "ClickHouse",
    summary:
      "Columnar OLAP. For product analytics and large scans — not for transactional orders.",
    plainSummary:
      "A database that answers big reporting questions fast — not for shopping carts and logins.",
    tags: ["analytics"],
    rules: [
      rule(
        { field: "analytics", is: "bi" },
        3,
        "Columnar scans are the point.",
      ),
      rule({ field: "dataShape", is: "timeseries" }, 2, "Event analytics fit."),
      rule(
        { field: "product", is: "analytics" },
        3,
        "An analytics product can be ClickHouse-first.",
      ),
      rule(
        { field: "consistency", is: "strong" },
        -3,
        "Not an OLTP system of record.",
      ),
      rule(
        { field: "product", anyOf: ["store", "webapp"] },
        -2,
        "Do not put checkout in ClickHouse.",
      ),
    ],
    scaling: scaling(
      "One ClickHouse Cloud service for events.",
      "Sharding and materialized views.",
      "This is a 1B-event analytics shape.",
    ),
    pros: ["Scan speed.", "SQL."],
    cons: ["Not transactional OLTP."],
    meta: meta(2, 3, true, ["https://clickhouse.com/docs"]),
  },
  {
    id: "azure-sql",
    layer: "database",
    name: "Azure SQL / SQL Server",
    summary:
      "Microsoft’s relational database. Correct when the org is already in Azure/SQL Server.",
    plainSummary:
      "Microsoft’s database — the natural pairing with Azure and C#.",
    tags: ["sql", "relational", "lock-in"],
    synergy: [
      {
        with: "aspnet",
        bonus: 3,
        reason: "ASP.NET and SQL Server are a Microsoft default.",
      },
    ],
    rules: [
      rule(
        { field: "existingCloud", anyOf: ["azure", "microsoft"] },
        3,
        "Stay on Azure SQL.",
      ),
      rule(
        { field: "languages", includes: "csharp" },
        2,
        "EF Core on SQL Server is first-class.",
      ),
      rule(
        { field: "dataShape", anyOf: ["relational", "unsure"] },
        2,
        "It is a strong relational engine.",
      ),
      rule(freeBudget, -1, "Licensing/cost vs Postgres on a tight budget."),
    ],
    scaling: scaling(
      "A small Azure SQL SKU.",
      "Hyperscale or replicas, plus Redis.",
      "Regional stamps and partitioning with Azure-native observability.",
    ),
    pros: ["Azure integration.", "Mature tooling."],
    cons: ["Cost vs Postgres."],
    meta: meta(3, 3, false, ["https://learn.microsoft.com/azure/azure-sql/"]),
  },
];
