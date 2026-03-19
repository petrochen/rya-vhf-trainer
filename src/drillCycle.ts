import type { ExamQuestion } from './srcData';

export type DrillPhase = 'coverage' | 'remediation' | 'complete';

export interface DrillCycle {
  phase: DrillPhase;
  current: ExamQuestion | null;
  coverageQueue: ExamQuestion[];
  remediationQueue: ExamQuestion[];
  totalCoverage: number;
  coveredCount: number;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createDrillCycle(questions: ExamQuestion[]): DrillCycle {
  const shuffled = shuffle(questions);
  const [first, ...rest] = shuffled;

  if (!first) {
    return {
      phase: 'complete',
      current: null,
      coverageQueue: [],
      remediationQueue: [],
      totalCoverage: 0,
      coveredCount: 0,
    };
  }

  return {
    phase: 'coverage',
    current: first,
    coverageQueue: rest,
    remediationQueue: [],
    totalCoverage: shuffled.length,
    coveredCount: 0,
  };
}

export function resolveDrillAnswer(cycle: DrillCycle, correct: boolean): DrillCycle {
  if (!cycle.current || cycle.phase === 'complete') {
    return cycle;
  }

  if (cycle.phase === 'coverage') {
    const nextCovered = cycle.coveredCount + 1;
    const nextRemediation = correct ? cycle.remediationQueue : [...cycle.remediationQueue, cycle.current];

    if (cycle.coverageQueue.length > 0) {
      const [nextCurrent, ...restCoverage] = cycle.coverageQueue;
      return {
        ...cycle,
        coveredCount: nextCovered,
        current: nextCurrent,
        coverageQueue: restCoverage,
        remediationQueue: nextRemediation,
      };
    }

    if (nextRemediation.length > 0) {
      const shuffledRemediation = shuffle(nextRemediation);
      const [nextCurrent, ...restRemediation] = shuffledRemediation;
      return {
        ...cycle,
        phase: 'remediation',
        coveredCount: nextCovered,
        current: nextCurrent ?? null,
        coverageQueue: [],
        remediationQueue: restRemediation,
      };
    }

    return {
      ...cycle,
      phase: 'complete',
      coveredCount: nextCovered,
      current: null,
      coverageQueue: [],
      remediationQueue: [],
    };
  }

  const nextRemediation = correct ? cycle.remediationQueue : [...cycle.remediationQueue, cycle.current];
  if (nextRemediation.length > 0) {
    const [nextCurrent, ...restRemediation] = nextRemediation;
    return {
      ...cycle,
      current: nextCurrent,
      remediationQueue: restRemediation,
    };
  }

  return {
    ...cycle,
    phase: 'complete',
    current: null,
    coverageQueue: [],
    remediationQueue: [],
  };
}

export function getCoveragePercent(cycle: DrillCycle): number {
  if (cycle.totalCoverage === 0) {
    return 0;
  }
  return Math.round((cycle.coveredCount / cycle.totalCoverage) * 100);
}

export function getCoverageQuestionNumber(cycle: DrillCycle): number {
  if (cycle.phase !== 'coverage' || !cycle.current) {
    return cycle.totalCoverage;
  }
  return cycle.coveredCount + 1;
}

export function getRemediationLeft(cycle: DrillCycle): number {
  if (cycle.phase === 'coverage') {
    return cycle.remediationQueue.length;
  }
  if (cycle.phase === 'remediation') {
    return cycle.remediationQueue.length + (cycle.current ? 1 : 0);
  }
  return 0;
}

export function getRemainingTotal(cycle: DrillCycle): number {
  if (cycle.phase === 'complete') {
    return 0;
  }
  return cycle.coverageQueue.length + cycle.remediationQueue.length + (cycle.current ? 1 : 0);
}
