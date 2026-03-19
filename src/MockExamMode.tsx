import { useEffect, useMemo, useRef, useState } from 'react';
import { AlarmClock, CheckCircle, ClipboardCheck, RotateCcw, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ALL_EXAM_QUESTIONS, EXAM_TOPIC_LABELS } from './srcData';
import type { ExamQuestion, ExamTopic } from './srcData';
import { withShuffledQuestionOptions } from './examOptions';
import { recordMockExam, recordTopicAttempt } from './topicProgress';
import type { SrcProgress } from './topicProgress';

interface MockExamModeProps {
  onBack: () => void;
  setSrcProgress: React.Dispatch<React.SetStateAction<SrcProgress>>;
}

const QUESTION_COUNT = 16;
const EXAM_SECONDS = 16 * 60;
const MOCK_BLUEPRINT: Array<{ topic: ExamTopic; count: number }> = [
  { topic: 'equipment', count: 2 },
  { topic: 'channels', count: 2 },
  { topic: 'dsc', count: 3 },
  { topic: 'priority', count: 2 },
  { topic: 'position', count: 1 },
  { topic: 'traffic', count: 2 },
  { topic: 'procedure', count: 2 },
  { topic: 'gmdss', count: 1 },
  { topic: 'regulations', count: 1 },
];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function takeRandom(
  source: ExamQuestion[],
  count: number,
  usedIds: Set<string>,
): ExamQuestion[] {
  const available = source.filter((question) => !usedIds.has(question.id));
  const selected = shuffle(available).slice(0, count);
  for (const question of selected) {
    usedIds.add(question.id);
  }
  return selected;
}

function buildExamSet(): ExamQuestion[] {
  const usedIds = new Set<string>();
  const selected: ExamQuestion[] = [];

  for (const slot of MOCK_BLUEPRINT) {
    const topicPool = ALL_EXAM_QUESTIONS.filter((question) => question.topic === slot.topic);
    selected.push(...takeRandom(topicPool, slot.count, usedIds));
  }

  if (selected.length < QUESTION_COUNT) {
    const fillCount = QUESTION_COUNT - selected.length;
    selected.push(...takeRandom(ALL_EXAM_QUESTIONS, fillCount, usedIds));
  }

  return shuffle(selected)
    .slice(0, QUESTION_COUNT)
    .map((question, index) => withShuffledQuestionOptions(question, `mock:${index}:${question.id}`));
}

export const MockExamMode = ({ onBack, setSrcProgress }: MockExamModeProps) => {
  const [questions, setQuestions] = useState<ExamQuestion[]>(() => buildExamSet());
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_SECONDS);
  const [submitted, setSubmitted] = useState(false);
  const hasRecordedRef = useRef(false);
  const finished = submitted || secondsLeft <= 0;

  useEffect(() => {
    if (finished) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsLeft, finished]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (questionId: string, optionId: string) => {
    if (finished) {
      return;
    }

    setAnswers((value) => ({ ...value, [questionId]: optionId }));
  };

  const finishExam = () => {
    setSubmitted(true);
  };

  const restartExam = () => {
    setQuestions(buildExamSet());
    setAnswers({});
    setCurrentIndex(0);
    setSecondsLeft(EXAM_SECONDS);
    setSubmitted(false);
    hasRecordedRef.current = false;
  };

  const results = useMemo(() => {
    return questions.map((question) => {
      const selected = answers[question.id];
      const correct = selected === question.answer;
      return { question, selected, correct };
    });
  }, [questions, answers]);

  const correctCount = results.filter((entry) => entry.correct).length;
  const percent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = `${secondsLeft % 60}`.padStart(2, '0');
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    if (!finished || hasRecordedRef.current) {
      return;
    }

    hasRecordedRef.current = true;
    setSrcProgress((value) => {
      let next = recordMockExam(value, percent);
      for (const entry of results) {
        next = recordTopicAttempt(next, entry.question.topic, entry.correct);
      }
      return next;
    });
  }, [finished, percent, results, setSrcProgress]);

  return (
    <div className="mx-auto flex h-full max-h-screen w-full max-w-6xl flex-col gap-3 overflow-y-auto rounded-3xl border border-border/70 bg-card/95 p-4 shadow-2xl backdrop-blur md:p-6">
      <div className="flex items-center justify-between gap-3">
        <Button onClick={onBack} variant="outline" size="sm" className="h-10 min-w-24">
          <XCircle size={18} />
          Back
        </Button>

        <div className="text-center leading-tight">
          <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-red-300">Timed Assessment</div>
          <div className="text-2xl font-bold text-foreground md:text-3xl">Mock Exam</div>
        </div>

        <Button onClick={restartExam} variant="secondary" size="sm" className="h-10 min-w-24">
          <RotateCcw size={18} />
          Restart
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="border-border/70 bg-card/95">
          <CardHeader className="pb-2">
            <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-muted-foreground">Questions</div>
            <CardTitle className="text-4xl font-extrabold">{currentIndex + 1} / {questions.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Blueprint-weighted across handbook-critical topics.
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/95">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-1 text-[11px] font-semibold tracking-[0.16em] uppercase text-amber-300">
              <AlarmClock size={14} />
              Time Left
            </div>
            <CardTitle className="text-4xl font-extrabold">{minutes}:{seconds}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Finish manually or let the timer submit.
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/95">
          <CardHeader className="pb-2">
            <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-muted-foreground">Answered</div>
            <CardTitle className="text-4xl font-extrabold">{answeredCount}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>Unanswered questions count as wrong.</div>
            <Progress value={Math.round((answeredCount / questions.length) * 100)} className="h-2 bg-muted/70" />
          </CardContent>
        </Card>
      </div>

      {!finished ? (
        <div className="grid flex-1 min-h-0 gap-4 xl:grid-cols-[260px,1fr]">
          <Card className="flex min-h-0 flex-col border-border/70 bg-card/95">
            <CardHeader className="pb-3">
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">Navigator</div>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-3 pt-0">
              <div className="grid grid-cols-4 gap-2 md:grid-cols-6 xl:grid-cols-4">
                {questions.map((question, index) => {
                  const answered = Boolean(answers[question.id]);
                  const active = index === currentIndex;
                  return (
                    <button
                      key={question.id}
                      onClick={() => setCurrentIndex(index)}
                      className={[
                        'rounded-lg border px-2 py-2 text-sm transition-colors',
                        active
                          ? 'border-sky-500/50 bg-sky-500/15 text-foreground'
                          : answered
                            ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-100'
                            : 'border-border/70 bg-muted/35 text-muted-foreground hover:bg-accent hover:text-foreground',
                      ].join(' ')}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              <Button onClick={finishExam} className="mt-auto w-full">
                Submit Exam
              </Button>
            </CardContent>
          </Card>

          <Card className="flex min-h-0 flex-col border-border/70 bg-card/95">
            <CardHeader className="space-y-3">
              <Badge variant="outline" className="w-fit text-[11px]">
                {EXAM_TOPIC_LABELS[currentQuestion.topic]}
              </Badge>
              <CardTitle className="text-2xl font-extrabold leading-tight md:text-3xl">{currentQuestion.title}</CardTitle>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{currentQuestion.prompt}</p>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
              <div className="space-y-3 overflow-y-auto pr-1">
                {currentQuestion.options.map((option) => {
                  const checked = answers[currentQuestion.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(currentQuestion.id, option.id)}
                      className={[
                        'w-full rounded-lg border px-4 py-3 text-left text-base leading-snug transition-colors',
                        checked
                          ? 'border-sky-500/50 bg-sky-500/15 text-foreground'
                          : 'border-border/70 bg-muted/35 text-foreground hover:border-primary/60 hover:bg-accent',
                      ].join(' ')}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-3">
                <Button
                  onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
                  disabled={currentIndex === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentIndex((value) => Math.min(questions.length - 1, value + 1))}
                  disabled={currentIndex === questions.length - 1}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-border/70 bg-card/95">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-emerald-300">
              <ClipboardCheck size={14} />
              Results
            </div>
            <CardTitle className="text-5xl font-extrabold">{percent}%</CardTitle>
            <p className="text-base text-muted-foreground">{correctCount} correct out of {questions.length}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.map(({ question, selected, correct }, index) => (
              <Card
                key={question.id}
                className={correct ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-red-500/50 bg-red-500/10'}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase text-muted-foreground">
                    {correct ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    Question {index + 1} · {EXAM_TOPIC_LABELS[question.topic]}
                  </div>
                  <CardTitle className="text-lg font-bold">{question.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-muted-foreground">
                  <div>Your answer: {selected ? question.options.find((option) => option.id === selected)?.label : 'No answer'}</div>
                  <div>Correct answer: {question.options.find((option) => option.id === question.answer)?.label}</div>
                  <div className="text-foreground">{question.explanation}</div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
