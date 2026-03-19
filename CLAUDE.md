# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

An RYA SRC (Short Range Certificate) exam prep web app. It covers NATO phonetic alphabet drills, VHF radio procedure training, DSC operations, and full mock exams aligned with the RYA VHF SRC Course Handbook 2019. All content in `extracted/` is OCR'd from that handbook.

## Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint
npm run check:fact # Fact-check srcData.ts and vhfData.ts against handbook OCR text
```

## Tech Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS 3 + shadcn/ui components (configured via `components.json`)
- Path alias: `@/` → `src/`
- No router — screen switching is state-driven in `App.tsx` via `Screen` enum

## Architecture

**Single-page app with no routing.** `App.tsx` holds all top-level state (`stats`, `srcProgress`, `theme`) and renders one of ~18 screen components based on `currentScreen` state. Each screen component receives `onBack`, `srcProgress`, and `setSrcProgress` as props.

### Data Layer

- **`data.ts`** — NATO alphabet mapping, misleading distractors, `UserStats` type with spaced-repetition fields (interval, easeFactor, nextReview)
- **`srcData.ts`** — Large file containing all exam questions (`ExamQuestion[]`), topic types, handbook modules, learn sections, syllabus blocks, procedure word data, and VHF channel info. This is the single source of truth for exam content
- **`vhfData.ts`** — VHF transmission builder scenarios and templates
- **`topicProgress.ts`** — `SrcProgress` type tracking per-topic correct/wrong counts and mock exam scores. Pure functions for recording attempts
- **`drillCycle.ts`** — Stateless drill engine: coverage phase (see all questions) → remediation phase (re-drill wrong answers) → complete. Used by all topic drill modes
- **`examOptions.ts`** — Deterministic option shuffling using seeded PRNG (FNV-1a hash)

### Screen Components

Each `*Mode.tsx` or `*DrillMode.tsx` file is a self-contained screen. Topic drill modes (`EquipmentDrillMode`, `ChannelDrillMode`, etc.) all follow the same pattern: filter questions from `srcData.ts` by topic, run them through `drillCycle.ts`, and record results via `topicProgress.ts`.

### State Persistence

All user progress is stored in `localStorage`:

- `natoStats` — per-letter spaced repetition stats
- `srcProgress` — topic scores and mock exam results
- `uiTheme` — dark/light preference

### Fact-Checking

`scripts/factcheck-content.mjs` validates that exam questions and answers in `srcData.ts` are consistent with the OCR'd handbook text in `extracted/`. Run with `npm run check:fact`.

## UI Conventions

- shadcn/ui components live in `src/components/ui/` — add new ones via `npx shadcn@latest add <component>`
- Custom glass-panel styling and gradient backgrounds are in `src/App.css`
- Dark mode is default; theme toggle in top-right corner
