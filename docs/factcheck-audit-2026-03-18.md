# Question Factcheck Audit

Updated: 2026-03-18
Role: `Exam Content QA (Book Fidelity)`

## Scope

- `EXAM_QUESTIONS`
- `CHANNEL_PLAN_SIM_QUESTIONS`
- `DSC_CONSOLE_DRILL_QUESTIONS`
- `VHF_SCENARIOS`

Source of truth: `RYA-VHF SRC Course Handbook 2019` OCR in `extracted/rya_ocr_txt/`, with focus on Appendix 1/2 and channel chart pages.

## Automated Checks

Command:

```bash
npm run check:fact
```

Checks performed:

- unique question IDs across all banks
- answer key exists in options
- non-empty explanation text
- `handbookRef` present and parseable
- all referenced pages exist in OCR
- VHF scenario structural sanity (priority opening, identity phrase, turn-taking closure)

## Result

- Question items checked: `134`
- Unique question IDs: `134`
- VHF scenarios checked: `12`
- Critical issues: `0`

## Manual Review Notes

One low lexical-overlap flag remained:

- `cp-no-voice-on-70` (`pp. 61-66, 75, 82-83`)

Manual validation confirmed this is aligned with handbook text:

- `page-075`: `C3. Protection of distress frequencies` and `Status of Channel 70`
- `page-074`: `The Channel 70 instant alert selector`

So this item remains valid and handbook-based.

## Content Tightening Done In This Pass

To reduce ambiguity and keep wording closer to handbook terms, explanations were tightened for:

- `channel-67`
- `proc-all-before`
- `proc-all-after`
- `proc-in-figures`
- `proc-correct`
- `cp-small-craft-safety-67`
- `cp-no-voice-on-70`
- `dsc-console-group`

