# StackPilot

**Pick your stack. Scale with confidence.**

StackPilot is an open-source questionnaire that recommends a tech stack for a new product. It is a rules engine, not a chatbot: the same answers always produce the same ranking, and the catalog is data you can fork.

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui (Radix)
- No accounts, no database, no tracking
- Shareable result URLs

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test      # scoring engine
npm run build # production
npm run lint  # Biome
```

## How scoring works

1. Each stack in `lib/stacks.ts` has a 0–3 **affinity** on every answer tag (product, scale, team, budget, realtime, data, deploy).
2. Each user answer contributes `dimensionWeight × (affinity / 3)`. Weights sum to 100.
3. Stacks with product affinity `0` are dropped from the top 3 when enough alternatives exist.
4. The UI shows the winner plus two runners-up, with “why this fits” drawn from affinities ≥ 2.

The engine is pure functions in `lib/scoring.ts`. Golden cases live in `tests/scoring.test.ts`.

Question flow is a tree in `lib/questions.ts`. Options may set `next`; `skipWhen` can auto-answer a later question (v1: choosing “Real-time app” skips the realtime question).

## Add a stack

1. Open `lib/stacks.ts`.
2. Append a `Stack` object with:
   - `id`, `name`, `summary`
   - `profile` affinities (0–3) for every tag
   - `pros`, `cons`
   - `scalingStory` for `to10k`, `to1m`, `to1b`
3. Use the `profile({ ... })` helper so missing tags default to `0`.
4. Add or extend a test in `tests/scoring.test.ts` if this stack should win a known answer combo.
5. Run `npm test`.

You should not need to edit React components.

## Add a question

1. Open `lib/questions.ts`.
2. Add a `Question` with `id`, `prompt`, `options`, and `next`.
3. Each option needs `mapsTo: { dimension, value }` matching `UserProfile` in `lib/types.ts`.
4. If a previous answer should skip it, add `skipWhen`.
5. If you introduced a new profile dimension, update `lib/types.ts`, every stack profile, `DIMENSION_WEIGHTS` in `lib/scoring.ts`, and tests.

The wizard renders whatever the tree returns. No new screens to wire by hand.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Landing |
| `/wizard` | Questionnaire (`?a=` can prefill answers) |
| `/result?a=` | Recommendation from encoded answers |

Encoding is `product:web,scale:startup,...` (see `encodeAnswers` / `decodeAnswers`).

## Theme

Dark mode is the default. The toggle stores `stackpilot-theme` in `localStorage`. Color tokens live in `app/globals.css`.

For production sitemap/robots URLs, set `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-domain.com`).

## License

[MIT](./LICENSE)
