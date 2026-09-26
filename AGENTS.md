# AGENTS.md — React Mastering

Local, LeetCode-style platform that teaches React to a Turkish-speaking learner. pnpm monorepo:

- `apps/platform` (Vite + React UI), `apps/server` (Hono API), `packages/{content,runner,cli}` — the engine. **Do not modify the engine unless your task explicitly says so.**
- `curriculum/` — all learning content (modules, lessons, questions, tests, fixtures, test env, Sinema checkpoints).
- `projects/sinema`, `projects/atolye`, `projects/kitaplik` — the learner's own projects. **Never modify them.** (`curriculum/checkpoints/atolye/start` is the practice project's skeleton; `pnpm setup:projects atolye` copies it.)
- `workspace/`, `progress.json` — learner state. **Never modify.**

## Content authoring
Binding rules: `docs/authoring-guide.md`. Lesson plans + Sinema checkpoint contract: `docs/curriculum-plan.md`. Pedagogy: `docs/superpowers/specs/2026-09-25-react-mastering-platform-design.md` §2. Reference module: `curriculum/modules/00-baslangic/`. Current library APIs: `docs/research/*.md` (React 19.3, React Router 8, TanStack Query 5, Zod 4, RHF 7, RTK 2, Vitest 5, MSW 2, Tailwind 4, TypeScript 6) — do not teach outdated APIs.

In `lesson.md` frontmatter always double-quote `title` (YAML breaks on `:`/`@`/`#`).

Learner-facing text is **Turkish** (plain, friendly, "sen" dili); technical terms stay English. Folder names are ASCII kebab-case with two-digit prefixes.

## Commands (run from repo root)
- `pnpm validate:content -m <N>` — validate module N (schemas, ```check code blocks, solutions pass / starters fail, project tests vs checkpoints). Must end with `✓ İçerik geçerli`.
- `pnpm validate:content -m <N> --skip-projects` — when checkpoints for your module don't exist yet.
- `pnpm validate:content -m <N> --skip-runs` — fast: schemas + code blocks only.
- `npx prettier --write <paths>` — format TS files you wrote (markdown under curriculum is ignored by prettier).
- Do NOT use `tsx` (sandbox blocks its IPC pipe); the scripts above already use plain `node`.
- Do NOT run `pnpm check` or the dev servers: they write learner state (`workspace/`, `progress.json`). Use `pnpm validate:content` only.

## Rules
- Write only where your task allows. Do not commit (the coordinator commits).
- Do not add dependencies. If something in the engine/test env is missing, say so in your final report instead of changing it.
- Finish with a short report: what you created, final validate output line, deviations, open issues.
