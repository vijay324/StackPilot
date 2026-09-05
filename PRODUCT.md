# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers choosing a tech stack before they write the first service — solo builders, small teams, and experienced groups comparing options for a new product. They share the result with a teammate or a future self.

## Product Purpose

StackPilot recommends a production tech stack from a short questionnaire. Success is a named stack, a 0→1B scaling story, and a shareable URL — in a couple of minutes, without an account.

## Positioning

A deterministic, testable rules engine over a curated catalog of real-world stacks. Same answers always produce the same ranking. It is not a chatbot and does not call a model to pick the stack.

## Operating Context

Stateless browser app. Answers live in React state during the wizard and in a query string on the result page. No database, no user accounts, no analytics in v1. Deployable as a Vercel static/serverless Next.js app.

## Constraints

- Open-source MIT flagship; public GitHub quality bar.
- Recommendation logic is a static rules engine (`lib/scoring.ts`), not AI.
- Question flow and stack catalog are data files, not hardcoded UI.
- v1 questions are the seven in `lib/questions.ts` (realtime product skips the realtime question).
- Fully keyboard-operable wizard; WCAG-minded contrast and labels.
- No tracking.

## Brand Commitments

- Name: StackPilot
- Tagline: "Pick your stack. Scale with confidence."
- Visual references (pinned): Linear, Notion, Vercel, Polar — minimal, dark-mode-first, generous whitespace, no gradients, sharp typography.
- Palette, type, and surfaces are specified in DESIGN.md.

## Evidence

- 19 curated stacks in `lib/stacks.ts`.
- Scoring unit tests in `tests/scoring.test.ts` lock golden answer combinations.

## Voice

Direct, specific, unhyped. Talk like a senior engineer reviewing a proposal. Prefer stack names and tradeoffs over slogans.

## Open Decisions

- Public GitHub URL and production domain are unset until the repo is published.
- Optional `/api/explain` AI endpoint is out of v1.
