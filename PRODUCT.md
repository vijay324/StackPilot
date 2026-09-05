# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Non-technical founders choosing a first stack, plus developers and technical leads comparing options before they write the first service. They share the result with a teammate or a future self.

## Product Purpose

StackPilot recommends a production tech stack from an adaptive questionnaire. Success is a named **Best Overall Recommendation**, a 0→1B scaling story, per-layer reasons, and a shareable URL — without an account.

## Positioning

A deterministic, testable rules engine over a layered catalog of real-world components. Same answers always produce the same ranking. It is not a chatbot and does not call a model to pick the stack.

## Operating Context

Stateless browser app. Answers live in React state during the wizard and in a query string on the result page. No database, no user accounts, no analytics in v1. Deployable as a Vercel static/serverless Next.js app.

## Constraints

- Open-source MIT flagship; public GitHub quality bar.
- Recommendation logic is a static layered rules engine (`lib/engine/`), not AI.
- Question flow and component catalog are data files, not hardcoded UI.
- The questionnaire is sectioned (who, what, data, scale, constraints, integrations). Visible length is typically 16–30 questions depending on the path; there is no hard cap in code.
- Fully keyboard-operable wizard; WCAG-minded contrast and labels.
- No tracking.

## Brand Commitments

- Name: StackPilot
- Tagline: "Pick your stack. Scale with confidence."
- Visual references (pinned): Linear, Notion, Vercel, Polar — minimal, dark-mode-first, generous whitespace, no gradients, sharp typography.
- Palette, type, and surfaces are specified in DESIGN.md.

## Evidence

- Layered catalog in `lib/catalog/` (frontend, backend, data, cache, integrations, hosting).
- Scoring and composition unit tests in `tests/scoring.test.ts` lock golden answer combinations.

## Voice

Direct, specific, unhyped. Talk like a senior engineer reviewing a proposal. Prefer stack names and tradeoffs over slogans. Keep copy readable for non-technical founders.

## Open Decisions

- Public GitHub URL and production domain are unset until the repo is published.
- Optional `/api/explain` AI endpoint remains out of scope; explanations come only from written `FitRule.reason` text.
