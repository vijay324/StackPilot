import type { Component } from "@/lib/types";
import { dedicatedOps, enterpriseBudget, meta, rule, scaling } from "./helpers";

export const WAREHOUSE: Component[] = [
  {
    id: "bigquery",
    layer: "warehouse",
    name: "BigQuery",
    summary:
      "Serverless warehouse on GCP. Scales scans without cluster babysitting; sloppy SQL can spike cost.",
    plainSummary:
      "Google’s giant reporting database — you do not manage servers, you do watch the query bill.",
    tags: ["analytics", "gcp", "hyperscale"],
    synergy: [
      {
        with: "dbt",
        bonus: 2,
        reason: "dbt on BigQuery is a standard analytics stack.",
      },
    ],
    rules: [
      rule({ field: "analytics", is: "bi" }, 3, "A warehouse is the BI store."),
      rule(
        { field: "product", is: "analytics" },
        3,
        "Analytics products often land here.",
      ),
      rule(
        { field: "existingCloud", includes: "gcp" },
        3,
        "BigQuery is native GCP.",
      ),
      rule(enterpriseBudget, 1, "Scan pricing fits a real analytics budget."),
      rule(
        { field: "existingCloud", includes: "azure" },
        -2,
        "Use Fabric/Synapse or Snowflake on Azure-heavy orgs.",
      ),
    ],
    scaling: scaling(
      "A few dbt models on BigQuery.",
      "Partitioning, clustering, SLO monitoring.",
      "Domain data products and Fine-grained access.",
    ),
    pros: ["Serverless scans.", "SQL."],
    cons: ["Cost spikes.", "GCP-centric."],
    meta: meta(3, 3, false, ["https://cloud.google.com/bigquery/docs"]),
  },
  {
    id: "snowflake",
    layer: "warehouse",
    name: "Snowflake",
    summary: "Independent cloud warehouse. Strong for multi-cloud enterprises.",
    plainSummary:
      "A popular independent reporting database used by many large companies.",
    tags: ["analytics", "hyperscale"],
    synergy: [
      { with: "dbt", bonus: 2, reason: "dbt + Snowflake is a common pairing." },
    ],
    rules: [
      rule({ field: "analytics", is: "bi" }, 3, "Snowflake is a warehouse."),
      rule(
        { field: "product", is: "analytics" },
        3,
        "Fits an analytics platform.",
      ),
      rule(enterpriseBudget, 2, "Priced for enterprise analytics."),
      rule(
        { field: "budget", anyOf: ["zero", "under-50"] },
        -3,
        "Not a free-tier warehouse.",
      ),
    ],
    scaling: scaling(
      "One XS warehouse and a few models.",
      "Separate warehouses per workload.",
      "This already is an enterprise 1B-row shape.",
    ),
    pros: ["Separation of storage/compute.", "Multi-cloud."],
    cons: ["Cost.", "Another vendor."],
    meta: meta(3, 3, false, ["https://docs.snowflake.com/"]),
  },
  {
    id: "clickhouse-wh",
    layer: "warehouse",
    name: "ClickHouse (warehouse)",
    summary: "Columnar warehouse for product analytics and huge event streams.",
    plainSummary:
      "A very fast reporting database for events and product analytics.",
    tags: ["analytics", "hyperscale"],
    rules: [
      rule({ field: "analytics", is: "bi" }, 2, "Columnar scans."),
      rule(
        { field: "product", is: "analytics" },
        3,
        "Event analytics fit ClickHouse.",
      ),
      rule({ field: "dataShape", is: "timeseries" }, 2, "Events over time."),
    ],
    scaling: scaling(
      "ClickHouse Cloud for events.",
      "Materialized views and sharding.",
      "A known 1B-event analytics plane.",
    ),
    pros: ["Speed on events."],
    cons: ["Not a general enterprise warehouse like Snowflake."],
    meta: meta(2, 3, true, ["https://clickhouse.com/docs"]),
  },
  {
    id: "duckdb",
    layer: "warehouse",
    name: "DuckDB / MotherDuck",
    summary:
      "Embedded/small-team OLAP. Perfect until you need a shared enterprise warehouse.",
    plainSummary:
      "A lightweight analytics engine — great for a small team, not a company-wide warehouse.",
    tags: ["analytics", "low-ops"],
    rules: [
      rule(
        { field: "analytics", is: "simple" },
        3,
        "DuckDB can power simple dashboards.",
      ),
      rule(
        { field: "analytics", is: "bi" },
        -1,
        "Enterprise BI usually wants BigQuery/Snowflake.",
      ),
      rule(
        {
          field: "team",
          anyOf: ["solo-learning", "solo-experienced", "small"],
        },
        2,
        "Fits a small analytics footprint.",
      ),
    ],
    scaling: scaling(
      "DuckDB files or MotherDuck.",
      "Move hot marts to ClickHouse/BigQuery.",
      "Do not stretch DuckDB into a 1B multi-tenant warehouse.",
    ),
    pros: ["Simple.", "Fast locally."],
    cons: ["Not an enterprise control plane."],
    meta: meta(2, 3, true, ["https://duckdb.org/docs/"]),
  },
  {
    id: "dbt",
    layer: "warehouse",
    name: "dbt",
    summary:
      "SQL transformations as code. Pair with a warehouse; this is not a store by itself.",
    plainSummary:
      "A way to write checked, versioned reporting SQL on top of a warehouse.",
    tags: ["analytics", "sidecar"],
    synergy: [
      { with: "bigquery", bonus: 2, reason: "dbt on BigQuery is standard." },
      { with: "snowflake", bonus: 2, reason: "dbt on Snowflake is standard." },
    ],
    rules: [
      rule(
        { field: "analytics", is: "bi" },
        3,
        "Transformations should be tested SQL.",
      ),
      rule(
        { field: "product", is: "analytics" },
        3,
        "dbt is how analytics teams ship models.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        -1,
        "Overkill for a single dashboard.",
      ),
    ],
    scaling: scaling(
      "A few models in dbt Core.",
      "Layered marts and CI.",
      "Domain data products and contracts.",
    ),
    pros: ["Reviewable SQL.", "Tests."],
    cons: ["Needs a warehouse underneath."],
    meta: meta(3, 3, true, ["https://docs.getdbt.com/"]),
  },
  {
    id: "dagster",
    layer: "warehouse",
    name: "Dagster / Airflow",
    summary:
      "Orchestration for pipelines. Dagster for software-defined assets; Airflow for the incumbent ecosystem.",
    plainSummary: "The scheduler that runs your data jobs in the right order.",
    tags: ["analytics", "high-ops", "sidecar"],
    rules: [
      rule(
        { field: "product", is: "analytics" },
        3,
        "Pipelines need an orchestrator.",
      ),
      rule(
        { field: "analytics", is: "bi" },
        2,
        "Warehouse jobs should be scheduled.",
      ),
      rule(
        { field: "trafficPattern", is: "batch" },
        2,
        "Batch is the happy path.",
      ),
      rule(
        dedicatedOps,
        1,
        "Someone must own the orchestrator (or use a managed one).",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        -2,
        "Do not start an app team on Airflow.",
      ),
    ],
    scaling: scaling(
      "Managed Airflow/Dagster Cloud and a few jobs.",
      "Asset checks and SLAs.",
      "Domain platform teams and streaming only where latency demands it.",
    ),
    pros: ["Visible pipelines.", "Retries."],
    cons: ["Ops.", "Wrong for a CRUD app."],
    meta: meta(3, 3, true, [
      "https://docs.dagster.io/",
      "https://airflow.apache.org/docs/",
    ]),
  },
  {
    id: "flink",
    layer: "warehouse",
    name: "Apache Flink",
    summary:
      "Stream processing with event time. Pair with Kafka — not a warehouse, a streaming compute layer.",
    plainSummary:
      "Software that processes live event streams — only when batch is not fast enough.",
    tags: ["analytics", "hyperscale", "high-ops", "sidecar"],
    synergy: [
      {
        with: "kafka",
        bonus: 3,
        reason: "Flink + Kafka is a standard streaming pair.",
      },
    ],
    rules: [
      rule(
        { field: "product", is: "analytics" },
        1,
        "Only when you truly stream.",
      ),
      rule(
        { field: "realtime", anyOf: ["live", "multiplayer"] },
        1,
        "Stream processing may feed live features.",
      ),
      rule(
        { field: "scaleAmbition", is: "billion" },
        2,
        "A 1B-event streaming shape.",
      ),
      rule(
        { field: "team", is: "solo-learning" },
        "exclude",
        "Do not start here.",
      ),
      rule({ field: "ops", is: "none" }, "exclude", "Flink needs operators."),
    ],
    scaling: scaling(
      "Do not. A queue + warehouse will do.",
      "Flink on K8s with managed Kafka.",
      "Autoscaling jobs and exactly-once sinks.",
    ),
    pros: ["Event time.", "Exactly-once sinks."],
    cons: ["Most expensive operationally."],
    meta: meta(1, 3, true, [
      "https://nightlies.apache.org/flink/flink-docs-stable/",
    ]),
  },
];
