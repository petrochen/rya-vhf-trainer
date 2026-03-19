import type { ExamTopic } from './srcData';

export interface TopicScore {
  correct: number;
  wrong: number;
}

export interface MockExamScore {
  attempts: number;
  bestPercent: number;
  lastPercent: number;
}

export interface SrcProgress {
  topics: Record<ExamTopic, TopicScore>;
  mockExam: MockExamScore;
}

export const INITIAL_SRC_PROGRESS: SrcProgress = {
  topics: {
    equipment: { correct: 0, wrong: 0 },
    priority: { correct: 0, wrong: 0 },
    channels: { correct: 0, wrong: 0 },
    dsc: { correct: 0, wrong: 0 },
    procedure: { correct: 0, wrong: 0 },
    position: { correct: 0, wrong: 0 },
    traffic: { correct: 0, wrong: 0 },
    gmdss: { correct: 0, wrong: 0 },
    regulations: { correct: 0, wrong: 0 },
  },
  mockExam: {
    attempts: 0,
    bestPercent: 0,
    lastPercent: 0,
  },
};

export function recordTopicAttempt(progress: SrcProgress, topic: ExamTopic, correct: boolean): SrcProgress {
  const current = progress.topics[topic];
  return {
    ...progress,
    topics: {
      ...progress.topics,
      [topic]: {
        correct: current.correct + (correct ? 1 : 0),
        wrong: current.wrong + (correct ? 0 : 1),
      },
    },
  };
}

export function recordMockExam(progress: SrcProgress, percent: number): SrcProgress {
  return {
    ...progress,
    mockExam: {
      attempts: progress.mockExam.attempts + 1,
      bestPercent: Math.max(progress.mockExam.bestPercent, percent),
      lastPercent: percent,
    },
  };
}

export function getTopicStats(progress: SrcProgress) {
  return (Object.keys(progress.topics) as ExamTopic[]).map((topic) => {
    const total = progress.topics[topic].correct + progress.topics[topic].wrong;
    const accuracy = total > 0 ? progress.topics[topic].correct / total : 0;
    const weakness = total === 0 ? 1 : 1 - accuracy;
    return { topic, total, accuracy, weakness };
  });
}
