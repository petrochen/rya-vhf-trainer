import type { ExamQuestion, ExamQuestionOption } from './srcData';

function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function createSeededRandom(seed: number): () => number {
  let state = seed || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

export function shuffleQuestionOptions(question: ExamQuestion, salt = ''): ExamQuestionOption[] {
  const copy = [...question.options];
  const random = createSeededRandom(hashString(`${question.id}:${salt}`));

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

export function withShuffledQuestionOptions(question: ExamQuestion, salt = ''): ExamQuestion {
  return {
    ...question,
    options: shuffleQuestionOptions(question, salt),
  };
}
