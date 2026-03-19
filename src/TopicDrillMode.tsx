import { useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { CheckCircle, HelpCircle, RotateCcw, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { EXAM_QUESTIONS } from './srcData';
import type { ExamQuestion, ExamTopic } from './srcData';
import { shuffleQuestionOptions } from './examOptions';
import { recordTopicAttempt } from './topicProgress';
import type { SrcProgress } from './topicProgress';
import {
  createDrillCycle,
  getCoveragePercent,
  getCoverageQuestionNumber,
  getRemainingTotal,
  getRemediationLeft,
  resolveDrillAnswer,
} from './drillCycle';
import type { DrillCycle } from './drillCycle';

type IconType = ComponentType<{ size?: number; className?: string }>;

interface SideItem {
  label?: string;
  text: string;
}

export interface SharedDrillProps {
  onBack: () => void;
  srcProgress: SrcProgress;
  setSrcProgress: React.Dispatch<React.SetStateAction<SrcProgress>>;
}

interface TopicDrillModeProps extends SharedDrillProps {
  topic: ExamTopic;
  title: string;
  headerEyebrowColorClass: string;
  orbClassName: string;
  accuracyIcon: IconType;
  sideIcon: IconType;
  sideTitle: string;
  sideItems: SideItem[];
  attemptsLabel: string;
  resultPanelClassName: string;
  questionsOverride?: ExamQuestion[];
  getCorrectAnswerExample?: (question: ExamQuestion) => {
    when: string;
    exchange: string[];
    note?: string;
  } | null;
}

const IDK_OPTION = '__idk__';

export const TopicDrillMode = ({
  onBack,
  srcProgress,
  setSrcProgress,
  topic,
  title,
  headerEyebrowColorClass,
  orbClassName,
  accuracyIcon: AccuracyIcon,
  sideIcon: SideIcon,
  sideTitle,
  sideItems,
  attemptsLabel,
  resultPanelClassName,
  questionsOverride,
  getCorrectAnswerExample,
}: TopicDrillModeProps) => {
  const questionPool = useMemo(
    () => questionsOverride ?? EXAM_QUESTIONS[topic],
    [questionsOverride, topic],
  );
  const [cycle, setCycle] = useState<DrillCycle>(() => createDrillCycle(questionPool));
  const [selected, setSelected] = useState<string | null>(null);
  const [pendingCycle, setPendingCycle] = useState<DrillCycle | null>(null);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  const question = cycle.current;
  const attempts = srcProgress.topics[topic].correct + srcProgress.topics[topic].wrong;
  const mastery = attempts > 0 ? Math.round((srcProgress.topics[topic].correct / attempts) * 100) : 0;
  const coveragePercent = getCoveragePercent(cycle);
  const remediationLeft = getRemediationLeft(cycle);
  const remainingTotal = getRemainingTotal(cycle);
  const questionOptions = useMemo(() => {
    if (!question) {
      return [];
    }
    const seed = `${cycle.phase}:${cycle.coveredCount}:${cycle.coverageQueue.length}:${cycle.remediationQueue.length}`;
    return shuffleQuestionOptions(question, seed);
  }, [question, cycle.phase, cycle.coveredCount, cycle.coverageQueue.length, cycle.remediationQueue.length]);

  const restartCycle = () => {
    setCycle(createDrillCycle(questionPool));
    setSelected(null);
    setPendingCycle(null);
    setLastAnswerCorrect(null);
  };

  const commitNext = () => {
    if (!pendingCycle) {
      return;
    }
    setCycle(pendingCycle);
    setSelected(null);
    setPendingCycle(null);
    setLastAnswerCorrect(null);
  };

  const registerAnswer = (optionId: string, correct: boolean) => {
    if (!question || selected) {
      return;
    }

    setSelected(optionId);
    setLastAnswerCorrect(correct);
    setPendingCycle(resolveDrillAnswer(cycle, correct));
    setSrcProgress((value) => recordTopicAttempt(value, topic, correct));
  };

  const handleSelect = (optionId: string) => {
    if (!question) {
      return;
    }
    registerAnswer(optionId, optionId === question.answer);
  };

  const handleDontKnow = () => {
    registerAnswer(IDK_OPTION, false);
  };

  const cycleHeader =
    cycle.phase === 'coverage'
      ? `Question ${getCoverageQuestionNumber(cycle)} / ${cycle.totalCoverage}`
      : cycle.phase === 'remediation'
        ? `Remediation (${remediationLeft} left)`
        : 'Cycle Complete';

  const nextLabel = pendingCycle?.phase === 'complete' ? 'Finish Cycle' : 'Next';
  const correctAnswerExample =
    lastAnswerCorrect && question && getCorrectAnswerExample ? getCorrectAnswerExample(question) : null;

  return (
    <div
      className="drill-view mx-auto flex h-full max-h-screen w-full max-w-6xl flex-col gap-3 overflow-x-hidden overflow-y-auto rounded-3xl border border-border/70 bg-card/95 p-4 shadow-2xl backdrop-blur md:p-6"
      style={{ maxHeight: 'calc(100vh - 8rem)' }}
    >
      <div className={cn(orbClassName, 'opacity-60')} />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <Button onClick={onBack} variant="outline" size="sm" className="h-10 min-w-24">
          <XCircle size={18} />
          Back
        </Button>
        <div className="text-center leading-tight">
          <div className={cn('text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground', headerEyebrowColorClass)}>
            Dedicated Drill
          </div>
          <div className="text-2xl font-bold text-foreground md:text-3xl">{title}</div>
          <Badge variant="outline" className="mt-2 border-border/70 text-muted-foreground">
            {cycleHeader}
          </Badge>
        </div>
        <Button onClick={restartCycle} variant="secondary" size="sm" className="h-10 min-w-24">
          <RotateCcw size={18} />
          Restart
        </Button>
      </div>

      <div className="relative z-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/70 bg-card/95">
          <CardHeader className="pb-2">
            <div className={cn('flex items-center gap-1 text-[11px] font-semibold tracking-[0.16em] uppercase', headerEyebrowColorClass)}>
              <AccuracyIcon size={14} />
              Topic Mastery
            </div>
            <CardTitle className="text-4xl font-extrabold">{mastery}%</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {attempts} {attemptsLabel}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/95">
          <CardHeader className="pb-2">
            <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-sky-300">
              Coverage
            </div>
            <CardTitle className="text-4xl font-extrabold">{coveragePercent}%</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>{cycle.coveredCount} / {cycle.totalCoverage} seen</div>
            <Progress value={coveragePercent} className="h-2 bg-muted/70" />
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/95">
          <CardHeader className="pb-2">
            <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-amber-300">
              Remediation Left
            </div>
            <CardTitle className="text-4xl font-extrabold">{remediationLeft}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Wrong/IDK must be closed correctly.
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/95">
          <CardHeader className="pb-2">
            <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-muted-foreground">
              Remaining
            </div>
            <CardTitle className="text-4xl font-extrabold">{remainingTotal}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Questions left in this cycle.
          </CardContent>
        </Card>
      </div>

      {!question ? (
        <Card className="relative z-10 border-emerald-500/40 bg-emerald-500/10 text-center">
          <CardHeader className="items-center pb-1">
            <CheckCircle className="mb-1 h-12 w-12 text-emerald-300" />
            <CardTitle className="text-3xl font-extrabold text-foreground">Cycle Complete</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5">
            <p className="max-w-xl text-base text-muted-foreground">
              All questions covered and remediation queue closed.
            </p>
            <Button onClick={restartCycle} size="lg">Start New Cycle</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="relative z-10 grid gap-4 xl:grid-cols-[320px,1fr]">
          <Card className="border-border/70 bg-card/95">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                <SideIcon size={16} />
                {sideTitle}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {sideItems.map((item) => {
                if (item.label) {
                  return (
                    <div key={item.label} className="rounded-lg border border-border/70 bg-muted/35 p-3">
                      <div className="mb-1 text-sm font-bold text-foreground">{item.label}</div>
                      <div className="text-sm leading-relaxed text-muted-foreground">{item.text}</div>
                    </div>
                  );
                }

                return (
                  <div key={item.text} className="rounded-lg border border-border/70 bg-muted/35 p-3 text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="flex flex-col border-border/70 bg-card/95">
            <CardHeader className="space-y-3">
              <div className={cn('text-[11px] font-semibold tracking-[0.18em] uppercase', headerEyebrowColorClass)}>
                {question.eyebrow}
              </div>
              <CardTitle className="text-2xl font-extrabold leading-tight md:text-3xl">{question.title}</CardTitle>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{question.prompt}</p>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4">
              <div className="grid grid-cols-1 gap-3">
                {questionOptions.map((option) => {
                  const isPicked = selected === option.id;
                  const isAnswer = option.id === question.answer;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option.id)}
                      disabled={Boolean(selected)}
                      className={cn(
                        'rounded-lg border px-4 py-3 text-left text-base leading-snug transition-colors',
                        'hover:border-primary/60 hover:bg-accent',
                        selected && 'pointer-events-none',
                        selected && isAnswer && 'border-emerald-500/60 bg-emerald-500/15 text-emerald-50',
                        selected && !isAnswer && isPicked && 'border-red-500/60 bg-red-500/15 text-red-100',
                        selected && !isAnswer && !isPicked && 'border-border/60 bg-muted/25 text-muted-foreground',
                        !selected && 'border-border/70 bg-muted/35 text-foreground',
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="drill-actionbar sticky bottom-0 mt-2 flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-card/95 p-3 backdrop-blur">
                <Button onClick={handleDontKnow} disabled={Boolean(selected)} variant="outline" className="min-w-32">
                  <HelpCircle size={16} />
                  I Don't Know
                </Button>
                <Button onClick={commitNext} disabled={!pendingCycle} className="min-w-28">
                  {nextLabel}
                </Button>
              </div>

              {selected && (
                <Card
                  className={cn(
                    'border',
                    resultPanelClassName,
                    lastAnswerCorrect ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-red-500/50 bg-red-500/10',
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                      {lastAnswerCorrect ? 'Correct' : 'Review'}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-base leading-relaxed text-foreground">
                    <div>{question.explanation}</div>
                    {correctAnswerExample && (
                      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3">
                        <div className="mb-1 text-xs font-semibold tracking-[0.16em] uppercase text-emerald-200">
                          When To Use + Example
                        </div>
                        <div className="mb-2 text-sm text-muted-foreground">{correctAnswerExample.when}</div>
                        <div className="space-y-1 rounded-md border border-border/70 bg-card/70 p-2 text-sm">
                          {correctAnswerExample.exchange.map((line, index) => (
                            <div key={`${line}-${index}`} className="text-foreground">
                              {line}
                            </div>
                          ))}
                        </div>
                        {correctAnswerExample.note && (
                          <div className="mt-2 text-xs text-muted-foreground">{correctAnswerExample.note}</div>
                        )}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Correct answer: {question.options.find((option) => option.id === question.answer)?.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Handbook reference: {question.handbookRef}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
