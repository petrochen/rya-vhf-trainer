import { useMemo, useState } from 'react';
import { CheckCircle, HelpCircle, RotateCcw, ShieldQuestion, Target, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EXAM_QUESTIONS, EXAM_TOPIC_LABELS, QUICK_RULES } from './srcData';
import type { ExamTopic } from './srcData';
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

interface ExamLabProps {
  onBack: () => void;
  srcProgress: SrcProgress;
  setSrcProgress: React.Dispatch<React.SetStateAction<SrcProgress>>;
}

const TOPICS = Object.keys(EXAM_QUESTIONS) as ExamTopic[];
const DEFAULT_TOPIC: ExamTopic = TOPICS.includes('equipment') ? 'equipment' : TOPICS[0];
const IDK_OPTION = '__idk__';

export const ExamLab = ({ onBack, srcProgress, setSrcProgress }: ExamLabProps) => {
  const [topic, setTopic] = useState<ExamTopic>(DEFAULT_TOPIC);
  const [cycle, setCycle] = useState<DrillCycle>(() => createDrillCycle(EXAM_QUESTIONS[DEFAULT_TOPIC]));
  const [selected, setSelected] = useState<string | null>(null);
  const [pendingCycle, setPendingCycle] = useState<DrillCycle | null>(null);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionAttempts, setSessionAttempts] = useState(0);
  const [streak, setStreak] = useState(0);

  const question = cycle.current;
  const sessionAccuracy = sessionAttempts > 0 ? Math.round((sessionScore / sessionAttempts) * 100) : 0;
  const coveragePercent = getCoveragePercent(cycle);
  const remediationLeft = getRemediationLeft(cycle);
  const remainingTotal = getRemainingTotal(cycle);
  const ruleBlock = QUICK_RULES[topic];
  const topicAttempts = srcProgress.topics[topic].correct + srcProgress.topics[topic].wrong;
  const topicAccuracy = topicAttempts > 0
    ? Math.round((srcProgress.topics[topic].correct / topicAttempts) * 100)
    : 0;
  const questionOptions = useMemo(() => {
    if (!question) {
      return [];
    }
    const seed = `${cycle.phase}:${cycle.coveredCount}:${cycle.coverageQueue.length}:${cycle.remediationQueue.length}`;
    return shuffleQuestionOptions(question, seed);
  }, [question, cycle.phase, cycle.coveredCount, cycle.coverageQueue.length, cycle.remediationQueue.length]);

  const restartTopic = (nextTopic = topic) => {
    setCycle(createDrillCycle(EXAM_QUESTIONS[nextTopic]));
    setSelected(null);
    setPendingCycle(null);
    setLastAnswerCorrect(null);
  };

  const switchTopic = (nextTopic: ExamTopic) => {
    if (nextTopic === topic) {
      return;
    }
    setTopic(nextTopic);
    restartTopic(nextTopic);
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
    setSessionAttempts((value) => value + 1);
    if (correct) {
      setSessionScore((value) => value + 1);
      setStreak((value) => value + 1);
    } else {
      setStreak(0);
    }
    setSrcProgress((value) => recordTopicAttempt(value, question.topic, correct));
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
        : 'Topic Complete';
  const nextLabel = pendingCycle?.phase === 'complete' ? 'Finish Topic' : 'Next';

  return (
    <div
      className="drill-view mx-auto flex h-full max-h-screen w-full max-w-6xl flex-col gap-3 overflow-x-hidden overflow-y-auto rounded-3xl border border-border/70 bg-card/95 p-4 shadow-2xl backdrop-blur md:p-6"
      style={{ maxHeight: 'calc(100vh - 8rem)' }}
    >
      <div className="relative z-10 flex items-center justify-between gap-3">
        <Button onClick={onBack} variant="outline" size="sm" className="h-10 min-w-24">
          <XCircle size={18} />
          Back
        </Button>

        <div className="text-center leading-tight">
          <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-sky-300">Exam Mode</div>
          <div className="text-2xl font-bold text-foreground md:text-3xl">RYA SRC Exam Lab</div>
          <Badge variant="outline" className="mt-2 border-border/70 text-muted-foreground">
            {cycleHeader}
          </Badge>
        </div>

        <Button onClick={() => restartTopic()} variant="secondary" size="sm" className="h-10 min-w-24">
          <RotateCcw size={18} />
          Restart
        </Button>
      </div>

      <Card className="relative z-10 border-border/70 bg-card/95">
        <CardHeader className="pb-3">
          <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">Topic Selection</div>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={topic} onValueChange={(value) => switchTopic(value as ExamTopic)}>
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-muted/40 p-1 md:grid-cols-3 xl:grid-cols-5">
              {TOPICS.map((entry) => (
                <TabsTrigger
                  key={entry}
                  value={entry}
                  className="min-h-14 flex-col items-start justify-start gap-1 text-left text-xs"
                >
                  <span className="text-sm font-bold">{EXAM_TOPIC_LABELS[entry]}</span>
                  <span className="line-clamp-2 text-[11px] text-muted-foreground">{QUICK_RULES[entry].bullets[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <div className="relative z-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/70 bg-card/95">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-1 text-[11px] font-semibold tracking-[0.16em] uppercase text-sky-300">
              <Target size={14} />
              Session Accuracy
            </div>
            <CardTitle className="text-4xl font-extrabold">{sessionAccuracy}%</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {sessionScore} / {sessionAttempts} this session
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
              Topic Mastery
            </div>
            <CardTitle className="text-4xl font-extrabold">{topicAccuracy}%</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {topicAttempts} historical attempts • streak {streak}
          </CardContent>
        </Card>
      </div>

      {!question ? (
        <Card className="relative z-10 border-emerald-500/40 bg-emerald-500/10 text-center">
          <CardHeader className="items-center pb-1">
            <CheckCircle className="mb-1 h-12 w-12 text-emerald-300" />
            <CardTitle className="text-3xl font-extrabold text-foreground">Topic Complete</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5">
            <p className="max-w-xl text-base text-muted-foreground">
              {EXAM_TOPIC_LABELS[topic]} closed: coverage 100% and remediation queue empty.
            </p>
            <Button onClick={() => restartTopic()} size="lg">
              Restart {EXAM_TOPIC_LABELS[topic]}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="relative z-10 grid gap-4 xl:grid-cols-[320px,1fr]">
          <Card className="border-border/70 bg-card/95">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                <ShieldQuestion size={16} />
                Reference
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {ruleBlock.bullets.map((bullet) => (
                <div key={bullet} className="rounded-lg border border-border/70 bg-muted/35 p-3 text-sm leading-relaxed text-muted-foreground">
                  {bullet}
                </div>
              ))}
              <div className="text-sm text-muted-foreground">
                Remaining in cycle: {remainingTotal}
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col border-border/70 bg-card/95">
            <CardHeader className="space-y-3">
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-sky-300">{question.eyebrow}</div>
              <CardTitle className="text-2xl font-extrabold leading-tight md:text-3xl">{question.title}</CardTitle>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{question.prompt}</p>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4">
              <div className="grid grid-cols-1 gap-3">
                {questionOptions.map((option) => {
                  const isPicked = selected === option.id;
                  const isAnswer = question.answer === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option.id)}
                      disabled={Boolean(selected)}
                      className={[
                        'rounded-lg border px-4 py-3 text-left text-base leading-snug transition-colors',
                        'hover:border-primary/60 hover:bg-accent',
                        selected ? 'pointer-events-none' : '',
                        selected && isAnswer ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-50' : '',
                        selected && !isAnswer && isPicked ? 'border-red-500/60 bg-red-500/15 text-red-100' : '',
                        selected && !isAnswer && !isPicked ? 'border-border/60 bg-muted/25 text-muted-foreground' : '',
                        !selected ? 'border-border/70 bg-muted/35 text-foreground' : '',
                      ].join(' ')}
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
                <Card className={lastAnswerCorrect ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-red-500/50 bg-red-500/10'}>
                  <CardHeader className="pb-2">
                    <div className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                      {lastAnswerCorrect ? 'Correct' : 'Review'}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-base leading-relaxed text-foreground">
                    <div>{question.explanation}</div>
                    <div className="text-sm text-muted-foreground">
                      Correct answer: {question.options.find((option) => option.id === question.answer)?.label}
                    </div>
                    <div className="text-sm text-muted-foreground">Handbook reference: {question.handbookRef}</div>
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
