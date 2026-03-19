# Exam Readiness Gate Audit

Updated: 2026-03-18  
Role: `Independent Exam-Readiness Auditor (Methodology + Product QA + Tech QA)`

## Scope

Audit goal: determine whether the product is moving in the right direction for:

1. material fidelity to `RYA VHF SRC Course Handbook 2019` (including Appendix 1/2), and
2. implementation quality for real exam preparation.

## Evidence Reviewed

- Handbook OCR and appendices:
  - `extracted/rya_ocr_txt/page-072.txt` ... `page-077.txt` (Appendix 1 syllabus A/B/C/D)
  - `extracted/rya_ocr_txt/page-078.txt` ... `page-081.txt` (SMNV)
  - `extracted/rya_ocr_txt/page-082.txt` ... `page-085.txt` (channel chart + sea area/NAVTEX notes)
- Product docs:
  - `docs/exam-alignment-audit.md`
  - `docs/project-status.md`
- Implementation:
  - `src/srcData.ts`
  - `src/vhfData.ts`
  - `src/drillCycle.ts`
  - `src/MockExamMode.tsx`
  - `src/VhfMode.tsx`
  - `src/App.tsx`
  - `src/LearnMode.tsx`

## Snapshot Metrics (Current Build)

- Exam question bank: `86` items across `9` topics.
- VHF Procedure Builder scenarios: `12` (`Routine 4`, `Urgency 2`, `Safety 2`, `Distress 4`).
- Progress/cycle engine is finite by design (coverage -> remediation -> complete).
- Build/lint: green.

## Verdict

`GO WITH CONDITIONS`

Direction is correct and strongly exam-oriented.  
The product is usable now for serious SRC prep, but not yet at `100% exam realism`.

## Findings (Ordered by Severity)

### P0-1: Mock exam validity risk (topic coverage is random, not blueprint-controlled)

- Evidence:
  - `buildExamSet()` samples from full bank using global shuffle + `slice(0, QUESTION_COUNT)` with no syllabus weighting or per-topic minimum:
    - `src/MockExamMode.tsx:30`
- Why this matters:
  - A candidate can receive a mock set that under-represents a critical syllabus block and get a misleading readiness signal.
- Required fix:
  - Add blueprint-based generation (`A/B/C/D` weighting + minimum per critical topic).

### P1-1: Procedure Builder teaches exact string order, not robust procedural intent

- Evidence:
  - Answer validation is strict equality on phrase text and exact position:
    - `src/VhfMode.tsx:209`
- Why this matters:
  - Practical exam competence should tolerate equivalent valid phrase variants while preserving mandatory structure.
- Required fix:
  - Move from phrase-literal grading to slot-based grading (`identity`, `position`, `priority marker`, `assistance`, etc.).

### P1-2: Appendix channel-chart depth remains partial

- Evidence:
  - Channel topic currently has a compact set of conceptual questions:
    - `src/srcData.ts:900`
  - Prior alignment doc still marks full channel-plan mastery as partial:
    - `docs/exam-alignment-audit.md:73`
- Why this matters:
  - Appendix chart knowledge includes richer context than current drill depth.
- Required fix:
  - Add scenario-to-channel simulator for intership / port ops / ship movement / public correspondence contexts.

### P1-3: Traceability is good at page level, but not yet complete at clause level

- Evidence:
  - Questions include `handbookRef` page references, but there is no enforced field for exact Appendix clause mapping per item.
  - Syllabus blocks exist in learn content:
    - `src/LearnMode.tsx:86`
    - `src/srcData.ts:368`
- Why this matters:
  - Claiming full compliance is harder without one-to-one item-to-clause traceability.
- Required fix:
  - Add `syllabusRef` (e.g., `A1.3`, `C3.6`, `D3`) to each question/scenario.

### P2-1: Content maintainability risk (single large data file)

- Evidence:
  - Most handbook content and question bank are concentrated in one file:
    - `src/srcData.ts`
  - Risk already acknowledged:
    - `docs/exam-alignment-audit.md:115`
- Why this matters:
  - Slows content QA, increases regression risk during ongoing expansion.
- Required fix:
  - Split by domain (`learn`, `question-bank`, `templates`, `syllabus-traceability`).

## What Is Working Well (Direction Confirmed)

- Study flow is explicitly structured around handbook progression and topic drills:
  - `src/App.tsx:101`
- Book blocks and exam-critical readiness gates are present on the home flow:
  - `src/App.tsx:177`
  - `src/App.tsx:526`
- Appendix 1 A/B/C/D blueprint is surfaced in Learn mode:
  - `src/LearnMode.tsx:86`
- Procedure Builder cycle is finite and tracks solved scenarios without repetition in the cycle:
  - `src/VhfMode.tsx:157`
  - `src/VhfMode.tsx:195`
- Topic drills use finite closure logic (coverage + remediation):
  - `src/drillCycle.ts:53`
  - `src/drillCycle.ts:91`

## Gate Decision

- `Direction`: correct.
- `Production claim "100% exam-ready"`: not yet.
- `Release recommendation`: continue as training beta; close P0/P1 items before claiming full exam equivalence.

## Next Sprint (High-Impact Order)

1. Blueprint-driven `Mock Exam v2` generator (mandatory per-topic minima + A/B/C/D weighting).  
2. Slot-based Procedure Builder grader (semantic/structural correctness over literal phrase matching).  
3. Channel chart simulator (scenario -> channel decision with feedback by Appendix chart context).  
4. Per-item traceability field (`syllabusRef`) and validation script.  
