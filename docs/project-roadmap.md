# RYA SRC Prep Roadmap

## Product Goal

Build an exam-first training site based on `RYA VHF SRC Course Handbook 2019`.

The product must train the user to:

- choose the correct message priority
- choose the correct channel
- use correct routine / urgency / safety / distress voice procedure
- understand DSC flow and follow-up actions
- use standard marine vocabulary and phonetics correctly
- pass a mixed mock exam

## Current State

Implemented:

- handbook OCR text stored in `extracted/`
- handbook key points summary in `docs/`
- homepage repositioned as `RYA SRC Prep`
- `Learn` mode
- `Exam Lab`
- `Mock Exam v1`
- `Transmission Builder` with scenario-type filtering
- phonetic quiz and typing drills

## Product Architecture

### 1. Learn

Purpose:

- compress the handbook into exam-usable knowledge

Content:

- handbook modules
- exam focus tags
- essential rules
- voice procedure checklists

### 2. Drills

Purpose:

- isolate one exam skill at a time

Required drills:

- `Priority Drill`
- `Channel Drill`
- `DSC Drill`
- `Procedure Words Drill`
- `Transmission Builder`
- `Phonetic + MMSI + Position Drill`

### 3. Mock Exam

Purpose:

- simulate pressure and mixed-topic recall

Required features:

- timed mixed exam
- topic breakdown
- explanation review
- recommendations for weak areas

### 4. Progress

Purpose:

- show mastery by SRC topic, not only by NATO letters

Required metrics:

- phonetic mastery
- channels mastery
- priority mastery
- DSC mastery
- procedure words mastery
- mock exam results

## Sprint Plan

### Sprint 1

Delivered:

- OCR and handbook content extraction
- learning foundation
- exam lab
- mock exam v1
- scenario filtering in builder

### Sprint 2

In progress:

- dedicated `DSC Drill`
- dedicated `Procedure Words Drill`
- topic-based progress screen
- better navigation between learning and drills

### Sprint 3

Next:

- `Channel Drill`
- `Priority Drill` with richer scenarios
- `Position / MMSI / Callsign Drill`
- more exam questions from handbook edge cases

### Sprint 4

Next:

- `Mock Exam v2` closer to real SRC structure
- error review grouped by topic
- spaced repetition or weak-topic targeting

## Delivery Principles

- every screen must map to a handbook skill
- avoid generic trivia; focus on exam behaviour
- prefer short actionable explanations over long theory
- keep content data-driven so new handbook-derived drills are easy to add
