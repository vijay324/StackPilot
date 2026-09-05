import type { Component } from "@/lib/types";
import { meta, rule, scaling } from "./helpers";

export const SEARCH: Component[] = [
  {
    id: "postgres-fts",
    layer: "search",
    name: "Postgres full-text search",
    summary:
      "tsvector in Postgres. Enough for many products until ranking and typos become the product.",
    plainSummary:
      "Search using the database you already have — enough until search itself is a feature.",
    tags: ["search"],
    synergy: [{ with: "postgres", bonus: 3, reason: "It is Postgres." }],
    rules: [
      rule(
        { field: "search", is: "fulltext" },
        1,
        "Built-in FTS can start full-text.",
      ),
      rule({ field: "search", is: "filter" }, 3, "SQL is enough for filters."),
      rule({ field: "ops", is: "none" }, 2, "No extra search cluster."),
    ],
    scaling: scaling(
      "Add tsvector columns and GIN indexes.",
      "Tune ranking; consider pg_trgm for typos.",
      "Move to a dedicated search engine when relevance is the product.",
    ),
    pros: ["No extra system."],
    cons: ["Relevance and typos trail dedicated engines."],
    meta: meta(3, 3, true, [
      "https://www.postgresql.org/docs/current/textsearch.html",
    ]),
  },
  {
    id: "meilisearch",
    layer: "search",
    name: "Meilisearch",
    summary:
      "Typo-tolerant search with a kind DX. Easy to self-host or use Cloud.",
    plainSummary: "A search box that forgives typos — simpler than Elastic.",
    tags: ["search", "low-ops"],
    rules: [
      rule(
        { field: "search", is: "fulltext" },
        3,
        "Typo-tolerant ranking is the product.",
      ),
      rule(
        { field: "ops", anyOf: ["none", "light"] },
        2,
        "Cloud or a single container.",
      ),
      rule(
        { field: "search", is: "none" },
        "exclude",
        "You did not ask for search.",
      ),
    ],
    scaling: scaling(
      "One Meilisearch Cloud project.",
      "Sharding and replica indexes.",
      "This is enough for most product search; Elastic if you need observability-grade search.",
    ),
    pros: ["DX.", "Typos."],
    cons: ["Younger than Elastic."],
    meta: meta(2, 3, true, ["https://www.meilisearch.com/docs"]),
  },
  {
    id: "typesense",
    layer: "search",
    name: "Typesense",
    summary:
      "Fast typo-tolerant search, similar niche to Meilisearch, easy to self-host.",
    plainSummary:
      "Another focused product-search engine that handles typos well.",
    tags: ["search"],
    rules: [
      rule(
        { field: "search", is: "fulltext" },
        3,
        "Built for instant, typo-tolerant search.",
      ),
      rule({ field: "lockIn", is: "portable" }, 1, "Easy to self-host."),
      rule(
        { field: "search", is: "none" },
        "exclude",
        "You did not ask for search.",
      ),
    ],
    scaling: scaling(
      "One node or Typesense Cloud.",
      "HA cluster.",
      "Stay here unless you need the Elastic ecosystem.",
    ),
    pros: ["Speed.", "Self-host."],
    cons: ["Smaller ecosystem than Elastic."],
    meta: meta(2, 3, true, ["https://typesense.org/docs/"]),
  },
  {
    id: "opensearch",
    layer: "search",
    name: "Elasticsearch / OpenSearch",
    summary:
      "The heavy search/analytics engine. Right for logs, complex relevance, and large indexes.",
    plainSummary: "The industrial search engine — powerful, and more to run.",
    tags: ["search", "high-ops", "hyperscale"],
    rules: [
      rule(
        { field: "search", is: "fulltext" },
        2,
        "Relevance tooling is unmatched.",
      ),
      rule(
        { field: "analytics", is: "bi" },
        1,
        "Log and event search often lands here.",
      ),
      rule(
        { field: "ops", is: "none" },
        -3,
        "Do not self-host Elastic with zero ops.",
      ),
      rule(
        { field: "search", is: "none" },
        "exclude",
        "You did not ask for search.",
      ),
    ],
    scaling: scaling(
      "Managed OpenSearch/Elastic Cloud.",
      "ILM, replicas, and ingest pipelines.",
      "This is a known huge-index shape.",
    ),
    pros: ["Power.", "Ecosystem."],
    cons: ["Ops and cost."],
    meta: meta(3, 3, true, ["https://opensearch.org/docs/latest/"]),
  },
  {
    id: "algolia",
    layer: "search",
    name: "Algolia",
    summary:
      "Managed product search. Buy relevance if it is a storefront feature.",
    plainSummary:
      "A hosted search product used by many shops — you pay instead of running a cluster.",
    tags: ["search", "low-ops", "lock-in"],
    rules: [
      rule(
        { field: "search", is: "fulltext" },
        3,
        "Algolia is product search as a service.",
      ),
      rule(
        { field: "product", is: "store" },
        2,
        "Storefront search is a classic Algolia case.",
      ),
      rule({ field: "ops", is: "none" }, 2, "Fully managed."),
      rule(
        { field: "lockIn", is: "portable" },
        -2,
        "Indexes are vendor-shaped.",
      ),
      rule(
        { field: "search", is: "none" },
        "exclude",
        "You did not ask for search.",
      ),
    ],
    scaling: scaling(
      "One index from your catalog.",
      "Replicas and rules.",
      "Cost may push you to self-hosted search at huge query volume.",
    ),
    pros: ["Relevance DX.", "No cluster."],
    cons: ["Price.", "Lock-in."],
    meta: meta(2, 3, false, ["https://www.algolia.com/doc/"]),
  },
];

export const VECTOR: Component[] = [
  {
    id: "pgvector",
    layer: "vector",
    name: "pgvector",
    summary:
      "Vectors inside Postgres. Right first RAG store for most products already on Postgres.",
    plainSummary:
      "Store AI ‘meanings’ next to your normal data — simplest start for search-over-documents.",
    tags: ["vector"],
    synergy: [
      {
        with: "postgres",
        bonus: 3,
        reason: "pgvector is a Postgres extension.",
      },
    ],
    rules: [
      rule({ field: "ai", is: "rag" }, 3, "RAG can start in Postgres."),
      rule(
        { field: "ops", anyOf: ["none", "light"] },
        2,
        "No extra vector vendor.",
      ),
      rule({ field: "ai", is: "none" }, "exclude", "No vector store needed."),
    ],
    scaling: scaling(
      "One pgvector column and an HNSW index.",
      "Separate embedding jobs; watch recall.",
      "Move to a dedicated vector DB if recall/QPS demand it.",
    ),
    pros: ["One database.", "Transactional."],
    cons: ["Not a purpose-built vector service."],
    meta: meta(3, 3, true, ["https://github.com/pgvector/pgvector"]),
  },
  {
    id: "qdrant",
    layer: "vector",
    name: "Qdrant",
    summary:
      "Open-source vector database. Self-host or Cloud when RAG is central.",
    plainSummary:
      "A specialist database for AI search over your documents, and you can host it yourself.",
    tags: ["vector"],
    rules: [
      rule({ field: "ai", is: "rag" }, 3, "Qdrant is built for this."),
      rule({ field: "lockIn", is: "portable" }, 2, "Self-host is first-class."),
      rule({ field: "ai", is: "none" }, "exclude", "No vector store needed."),
    ],
    scaling: scaling(
      "Qdrant Cloud or one container.",
      "Sharding and replicas.",
      "This is a serious RAG data plane.",
    ),
    pros: ["Open source.", "Filters + vectors."],
    cons: ["Another system to run."],
    meta: meta(2, 3, true, ["https://qdrant.tech/documentation/"]),
  },
  {
    id: "pinecone",
    layer: "vector",
    name: "Pinecone",
    summary: "Managed vector DB. Fastest managed RAG path; vendor-hosted.",
    plainSummary:
      "A hosted AI-search database — quick to start, you cannot run it yourself.",
    tags: ["vector", "lock-in", "low-ops"],
    rules: [
      rule({ field: "ai", is: "rag" }, 2, "Managed vectors."),
      rule({ field: "ops", is: "none" }, 2, "No cluster."),
      rule({ field: "lockIn", is: "portable" }, -2, "Cannot self-host."),
      rule({ field: "ai", is: "none" }, "exclude", "No vector store needed."),
    ],
    scaling: scaling(
      "One serverless index.",
      "Namespaces per tenant.",
      "Watch query cost; some teams later move to Qdrant/pgvector.",
    ),
    pros: ["Managed.", "Simple API."],
    cons: ["Lock-in.", "Cost."],
    meta: meta(2, 3, false, ["https://docs.pinecone.io/"]),
  },
];
