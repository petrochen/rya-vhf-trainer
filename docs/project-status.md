# Project Status

Updated: 2026-03-18

## Project

`RYA SRC Prep` based on `RYA VHF SRC Course Handbook 2019`

## Status Summary

- Product direction is stable.
- Core study MVP is largely implemented.
- Build is green.
- Lint is green after a refactor pass (`0 errors / 0 warnings`).
- The project is now in the transition from `core coverage` to `exam realism + adaptive revision`.

## Done

- Initialized `git` in the project.
- Extracted handbook OCR text into `extracted/`.
- Wrote handbook summary and key points into `docs/`.
- Repositioned homepage as `RYA SRC Prep`.
- Built `Learn` mode from handbook-derived content.
- Built focused drills for:
  - `Priority`
  - `Channels`
  - `DSC`
  - `Procedure Words`
  - `Position / MMSI / Callsign`
  - `Acknowledgement / Mayday Relay`
- Built `Procedure Builder` / transmission assembly mode.
- Expanded builder scenarios with:
  - marina call
  - radio check
  - garbled call response
  - urgency call
  - distress call
  - distress acknowledgement
  - mayday relay
  - safety call
- Built `Mock Exam`.
- Built topic-based `Progress`.
- Built `Weak Area Revision`.
- Added handbook-based question bank with edge cases.
- Verified production build with `npm run build`.
- Completed refactor pass for state flow and render purity:
  - moved app/local storage hydration to lazy state initialization (removed cascading `setState` effects)
  - switched topic/question transitions to event-driven updates in `Exam Lab`
  - removed timer/result anti-patterns in `Mock Exam` (derived finish state + single-write progress record)
  - removed impure `Date.now()` calls from render in `Progress`
  - simplified initialization and repeated logic in `Quiz`, `Typing`, and `VHF Procedure Builder`
  - consolidated six duplicated topic-drill screens into one configurable `TopicDrillMode` component
  - validated with `npm run lint` and `npm run build`
- Added formal exam-alignment audit against handbook appendices:
  - `docs/exam-alignment-audit.md`
  - includes `covered / partial / missing` matrix by Appendix 1 syllabus blocks
  - defines P0/P1/P2 product backlog for closing exam-readiness gaps
- Added independent readiness-gate audit (material + implementation):
  - `docs/exam-readiness-gate-2026-03-18.md`
  - includes `GO WITH CONDITIONS` verdict and prioritized blockers for 100% exam-readiness claim
- Added full Appendix-first topic coverage in training model:
  - new tracked topics: `equipment`, `gmdss`, `regulations`
  - new dedicated drills:
    - `Equipment / Controls Drill`
    - `GMDSS Systems Drill`
    - `Regulations / Public Correspondence Drill`
- Expanded handbook-derived exam question bank for missing Appendix 1 areas:
  - equipment controls and channel concepts
  - GMDSS systems (RCC/SAR, NAVTEX, EPIRB, SART, false-alert protection)
  - regulatory and public correspondence block (licence/secrecy/log/AAIC)
- Updated home UX route and exam-critical checks to include new Appendix 1 readiness gates.
- Extended `Learn` mode with:
  - `Official Exam Blueprint (Appendix 1 A/B/C/D)`
  - `Must-Know Before Exam Attempt` checklist
- Performed direct OCR-to-content verification for Appendix 1 (`pp. 72-77`) and Appendix 2 (`pp. 78-81`).
- Expanded question bank to close coverage gaps in:
  - `C2/C3` acknowledgement discipline, DSC testing protocols, distress-frequency protection
  - `D1` distress-traffic control semantics (`Seelonce` lifecycle and acknowledgement obligations)
  - `Appendix 2 SMNV` markers and response phrases
  - position-reporting format details (degrees/minutes, bearing-from-mark, distance/time notation)
- Expanded `Transmission Builder` scenario pool with additional syllabus-aligned cases:
  - public correspondence coast-station routine call
  - urgent medical advice (`Pan Pan`)
  - weather hazard `Securite` broadcast
  - coast-station `Seelonce Mayday` distress-traffic control

## In Progress

- Growing scenario bank in `Transmission Builder` to cover more edge-case traffic routines.
- Mock realism improvements (`Mock Exam v2` structure and weighting).
- Data layer modularization (`srcData.ts` split).

## Planned Next

### 1. Mock Exam v2

- Make the mock exam closer to SRC structure.
- Improve result review by topic and weak-skill recommendation.
- Make the exam feel less like a generic mixed quiz and more like a real prep tool.

### 2. Practical Procedure Depth

- Add more scenarios for:
  - unanswered calls
  - shore-to-ship procedures
  - medical advice flow
  - distress traffic control
  - additional acknowledgement cases

### 3. Adaptive Study Improvements

- Use progress data more aggressively to drive revision.
- Surface weak topics more clearly.
- Recommend the next best drill after mistakes or poor mock-exam performance.

### 4. Content / Data Cleanup

- If the data layer grows further, split the current large content file into:
  - handbook content
  - question bank
  - procedure templates
  - scenario bank

### 5. UX Polish

- Simplify navigation where needed.
- Improve mobile rhythm and density.
- Make relationships between `Learn`, `Drills`, `Mock Exam`, and `Revision` more obvious.

## Risks

- The main product risk is drifting into a reference site instead of staying an exam-first trainer.
- The main technical risk is letting the content layer become too monolithic in one file.
- The main UX risk is overload: there are now many useful modes, so navigation clarity matters.

## Current Readiness

The project is already usable as a serious SRC preparation tool.

It is not yet at the final state of:

- full practical procedure coverage
- realistic mock exam structure
- polished adaptive study loop

## Immediate Recommendation

Continue with:

1. `Mock Exam v2`
2. more practical radio-procedure scenarios
3. stronger weak-area recommendations
