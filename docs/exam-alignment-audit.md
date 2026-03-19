# RYA SRC Exam Alignment Audit

Updated: 2026-03-18
Role: `Product Owner + Exam Alignment Lead`

## 1) Source Of Exam Requirements

Alignment was reviewed against:

- `RYA-VHF SRC Course Handbook 2019` (OCR in `extracted/`).
- `Appendix 1: Examination Syllabus for CEPT SRC` (`page-072` ... `page-077`).
- `Appendix 2: Standard Marine Navigational Vocabulary` (`page-078` ... `page-081`).
- Channel chart and supporting appendices (`page-082` ... `page-085`).

Key exam blocks from Appendix 1:

- `A` General knowledge (communication/station types, channels, frequencies, simplex/duplex, basic equipment).
- `B` Detailed radio equipment knowledge (controls, DSC call types, MMSI, priorities).
- `C` GMDSS procedures (SAR, distress/urgency/safety via DSC, false alerts, protection of distress channels, MSI/NAVTEX, EPIRB/SART).
- `D` Voice procedure + regulations (Mayday/Pan Pan/Securite, Seelonce, Mayday Relay, SMNV, phonetics, licensing/secrecy/radio log, practical routines).

## 2) What Is Already Implemented Well

- Learning sections `Learn` + handbook modules + procedural templates:
  - `src/LearnMode.tsx`
  - `src/srcData.ts` (`HANDBOOK_MODULES`, `LEARN_SECTIONS`, `PROCEDURE_TEMPLATES`, `APPENDIX_SYLLABUS_BLOCKS`, `EXAM_CRITICAL_ITEMS`)
- Practical drills for key exam skills:
  - `Equipment / Controls`, `Priority`, `Channels`, `DSC`, `Procedure Words`, `Position/Identity`, `Distress Traffic`, `GMDSS Systems`, `Regulations`
  - `Transmission Builder` with routine/safety/urgency/distress scenarios
- Scenario-based training:
  - radio check, garbled call, mayday, acknowledgement, mayday relay, safety broadcast
  - `src/vhfData.ts`
- Exam layer:
  - `Exam Lab` (topic drills)
  - `Mock Exam` (timed mixed assessment)
  - `Weak Area Revision` + topic progress tracking
- Expanded question bank:
  - now includes not only procedural topics, but also `equipment`, `gmdss`, `regulations`
  - includes questions on DSC call taxonomy (`all ships / individual / geographic area / group`)

## 3) Appendix-To-Site Coverage Matrix

### Covered Well

- `A/B` Equipment knowledge:
  - simplex/semi-duplex/duplex concepts
  - dual watch, power/PTT/volume/squelch/dimmer
  - battery readiness basics
- Distress/Urgency/Safety/Routine classification.
- Channel discipline (16/70 + move to working channel).
- Voice procedures (Mayday/Pan Pan/Securite), basic acknowledgement flow.
- Mayday Relay / Seelonce discipline (partly in theory + questions + scenarios).
- DSC fundamentals (MMSI, distress follow-up on 16, urgency/safety follow-up, false alert principle).
- DSC call taxonomy (question + drill coverage): all ships / individual / geographic / group.
- Procedure words and phonetic alphabet.
- SMNV Appendix 2 core markers and response phrases (`QUESTION`, `INTENTION`, `No information`, `Message not understood`).
- Position/identity delivery (callsign/MMSI/position format).
- Garbled/unanswered routine handling (covered in scenarios/questions).
- `C` GMDSS systems:
  - RCC/SAR role
  - NAVTEX awareness
  - EPIRB/SART fundamentals
- `C3` protection/test layer:
  - DSC test-protocol awareness
  - distress-frequency protection discipline during active incidents
- `D2/D3` Regulations/public correspondence:
  - licence/operator entitlement awareness
  - secrecy/log/prohibited traffic awareness
  - AAIC/public correspondence awareness

### Partially Covered (Foundation Exists, But Not Yet Exam-Complete)

- Channel chart depth:
  - base rules exist, but there is no full simulator for the complete channel plan (port ops / ship movement / public correspondence channels).
- Distress control detail:
  - parts exist, but there is no step-by-step role trainer (`coast station vs ship station`) for receipt/ack handling.
- SMNV Appendix 2:
  - base coverage exists, but not the full set of markers/response patterns.

### Remaining Gaps (After Current Update)

- Simulation depth:
  - no role-based full SAR control simulator (coast station command flow).
- Channel chart mastery:
  - needs a dedicated scenario-to-channel intensive trainer for the full Appendix chart.
- SMNV breadth:
  - needs an extended drill for message markers and response patterns from Appendix 2.

## 4) Current Product Conclusion

The current implementation covers not only procedural content, but also key Appendix 1 theory zones (`A/B/C/D`) through dedicated drills, Learn blueprint content, and an expanded question bank.

Outcome:

- For practical exam elements: `readiness is high`.
- For the full exam (including Appendix 1 theory blocks A/B/C/D): `readiness is high, but not maximum` because simulation depth and channel-chart training can be stronger.

## 5) Priority Improvement Plan (Product Backlog)

### P0 (Next Step For Exam Realism)

- Full channel-plan simulator based on Appendix chart (port ops / ship movement / public correspondence mapping).
- Distress command simulator:
  - coast station vs ship role flow
  - Seelonce control lifecycle
- Mock Exam v2 with weighting by A/B/C/D blocks.

### P1 (Learning Quality)

- Extended SMNV vocabulary drills (markers + standard responses).
- Remediation report by syllabus sub-points after mock exam.

### P2 (Polish And Realism)

- Split `srcData.ts` into domain modules for maintainable content.
- Micro-UX improvements for mobile density and navigation.

## 6) Recommendation For Next Step

The next sprint should focus on `exam realism`: channel-plan simulator + distress command flow + weighted mock blueprint. Appendix 1 baseline coverage is in place; the biggest gain now comes from deeper, better-structured simulation.
