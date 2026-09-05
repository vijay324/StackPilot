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

1. Answers become a `Profile` (`lib/engine/profile.ts`).
2. Each **component** in `lib/catalog/` has written `FitRule`s. A fired rule adds a score or excludes the component. Explanations on the result page come only from those rule strings.
3. Applicable **layers** are selected from the profile (web frontend, mobile, backend, database, cache, and so on).
4. Layers are assembled greedily with `requires` / `conflicts` / `synergy`.
5. If a named preset in `lib/presets.ts` shares at least 80% of its components with the assembly, the result uses that preset name. Otherwise it is titled “Your custom stack”.
6. Two perspective reruns (lowest ops, portable, maximum scale headroom) become alternatives when they differ.

The engine is pure functions in `lib/engine/`. Golden cases live in `tests/scoring.test.ts`.

Question flow is a list in `lib/questions.ts` with `showWhen` conditions. Multi-select answers are stored as `a+b+c` in the share URL.

## Add a component

1. Open the matching file under `lib/catalog/` (or add a new layer file and export it from `lib/catalog/index.ts`).
2. Append a `Component` with:
   - `id`, `name`, `summary`, `plainSummary`
   - at least three `FitRule`s with human-written `reason`s
   - `scaling` for `to10k`, `to1m`, `to1b`
   - `pros`, `cons`
   - `meta.lastReviewed` and at least one `meta.sources` URL
3. Use `rule()`, `scaling()`, and `meta()` from `lib/catalog/helpers.ts`.
4. Add or extend a test in `tests/scoring.test.ts` if this component should win a known persona.
5. Run `npm test`.

Do not invent capabilities the vendor does not have. If you are unsure, leave the component out.

## Add a question

1. Open `lib/questions.ts`.
2. Add a `Question` with `id`, `section`, `kind`, `prompt`, `options`, and optional `showWhen`.
3. Use `kind: "multi"` for several-at-once answers; exclusive options (like “None”) set `exclusive: true`.
4. Offer a “Not sure” option when a non-technical user could get stuck. Map it in `buildProfile` to a safe default.
5. If the question is developer-only, gate it with `showWhen: { questionId: "role", anyOf: ["developer", "lead"] }` and optionally set `promptTechnical`.
6. The wizard renders whatever the tree returns. No new screens to wire by hand.

## Accuracy checklist

- Every explanation on the result page is a `FitRule.reason` or `synergy.reason` written in the catalog.
- `npm test` covers catalog integrity (unique ids, sources, ≥3 rules) and golden personas with at least one negative assertion (“never recommend X”).
- Legacy `?a=` URLs from the old 7-question engine decode without throwing and resume the wizard.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Landing |
| `/wizard` | Questionnaire (`?a=` can prefill answers) |
| `/result?a=` | Recommendation from encoded answers |

Encoding is `role:founder,product:website,...` (see `encodeAnswers` / `decodeAnswers`). Multi-select values join with `+`.

## Theme

Dark mode is the default. The toggle stores `stackpilot-theme` in `localStorage`. Color tokens live in `app/globals.css`.

For production sitemap/robots URLs, set `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-domain.com`).

## License

[MIT](./LICENSE)
