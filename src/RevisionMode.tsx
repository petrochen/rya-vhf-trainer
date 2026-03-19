import { useMemo, useState } from 'react';
import { BrainCircuit, CheckCircle, HelpCircle, RotateCcw, Target, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ALL_EXAM_QUESTIONS, EXAM_TOPIC_LABELS, QUICK_RULES } from './srcData';
import type { ExamQuestion, ExamTopic } from './srcData';
import { shuffleQuestionOptions } from './examOptions';
import { getTopicStats, recordTopicAttempt } from './topicProgress';
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

interface RevisionModeProps {
  onBack: () => void;
  srcProgress: SrcProgress;
  setSrcProgress: React.Dispatch<React.SetStateAction<SrcProgress>>;
}

const IDK_OPTION = '__idk__';

function topicQuestions(topic: ExamTopic): ExamQuestion[] {
  return ALL_EXAM_QUESTIONS.filter((question) => question.topic === topic);
}

export const RevisionMode = ({ onBack, srcProgress, setSrcProgress }: RevisionModeProps) => {
  const rankedTopics = useMemo(
    () => getTopicStats(srcProgress).sort((a, b) => b.weakness - a.weakness || a.accuracy - b.accuracy || a.total - b.total),
    [srcProgress],
  );
  const defaultTopic = rankedTopics[0]?.topic ?? 'equipment';
  const [topic, setTopic] = useState<ExamTopic>(defaultTopic);
  const [cycle, setCycle] = useState<DrillCycle>(() => createDrillCycle(topicQuestions(defaultTopic)));
  const [selected, setSelected] = useState<string | null>(null);
  const [pendingCycle, setPendingCycle] = useState<DrillCycle | null>(null);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionAttempts, setSessionAttempts] = useState(0);

  const question = cycle.current;
  const coveragePercent = getCoveragePercent(cycle);
  const remediationLeft = getRemediationLeft(cycle);
  const remainingTotal = getRemainingTotal(cycle);
  const sessionAccuracy = sessionAttempts > 0 ? Math.round((sessionCorrect / sessionAttempts) * 100) : 0;
  const topicTotals = srcProgress.topics[topic].correct + srcProgress.topics[topic].wrong;
  const topicAccuracy = topicTotals > 0 ? Math.round((srcProgress.topics[topic].correct / topicTotals) * 100) : 0;
  const ruleBlock = QUICK_RULES[topic];
  const questionOptions = useMemo(() => {
    if (!question) {
      return [];
    }
    const seed = `${cycle.phase}:${cycle.coveredCount}:${cycle.coverageQueue.length}:${cycle.remediationQueue.length}`;
    return shuffleQuestionOptions(question, seed);
  }, [question, cycle.phase, cycle.coveredCount, cycle.coverageQueue.length, cycle.remediationQueue.length]);

  const restartTopic = (nextTopic = topic) => {
    setCycle(createDrillCycle(topicQuestions(nextTopic)));
    setSelected(null);
    setPendingCycle(null);
    setLastAnswerCorrect(null);
  };

  const handleSwitchTopic = (nextTopic: ExamTopic) => {
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
      setSessionCorrect((value) => value + 1);
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
          <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-emerald-300">Adaptive Practice</div>
          <div className="text-2xl font-bold text-foreground md:text-3xl">Weak Area Revision</div>
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
          <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">Revision Queue</div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2 pt-0 md:grid-cols-2 xl:grid-cols-3">
          {rankedTopics.map((entry) => (
            <button
              key={entry.topic}
              onClick={() => handleSwitchTopic(entry.topic)}
              className={[
                'rounded-lg border p-3 text-left transition-colors',
                topic === entry.topic
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-foreground'
                  : 'border-border/70 bg-muted/35 text-muted-foreground hover:bg-accent hover:text-foreground',
              ].join(' ')}
            >
              <div className="text-sm font-bold">{EXAM_TOPIC_LABELS[entry.topic]}</div>
              <div className="mt-1 text-xs">
                {entry.total} attempts · {Math.round(entry.accuracy * 100)}% accuracy
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="relative z-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/70 bg-card/95">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-1 text-[11px] font-semibold tracking-[0.16em] uppercase text-emerald-300">
              <BrainCircuit size={14} />
              Weakest Topic
            </div>
            <CardTitle className="text-xl font-extrabold">{EXAM_TOPIC_LABELS[rankedTopics[0]?.topic ?? topic]}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Auto-ranked by weakness.
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/95">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-1 text-[11px] font-semibold tracking-[0.16em] uppercase text-sky-300">
              <Target size={14} />
              Session Accuracy
            </div>
            <CardTitle className="text-4xl font-extrabold">{sessionAccuracy}%</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {sessionCorrect} / {sessionAttempts} in session
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
            Remaining {remainingTotal} • mastery {topicAccuracy}%
          </CardContent>
        </Card>
      </div>

      {!question ? (
        <Card className="relative z-10 border-emerald-500/40 bg-emerald-500/10 text-center">
          <CardHeader className="items-center pb-1">
            <CheckCircle className="mb-1 h-12 w-12 text-emerald-300" />
            <CardTitle className="text-3xl font-extrabold text-foreground">Revision Topic Complete</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5">
            <p className="max-w-xl text-base text-muted-foreground">
              {EXAM_TOPIC_LABELS[topic]} closed: coverage and remediation complete.
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
              <div className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                Reference
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {ruleBlock.bullets.map((bullet) => (
                <div key={bullet} className="rounded-lg border border-border/70 bg-muted/35 p-3 text-sm leading-relaxed text-muted-foreground">
                  {bullet}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="flex flex-col border-border/70 bg-card/95">
            <CardHeader className="space-y-3">
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-emerald-300">{EXAM_TOPIC_LABELS[question.topic]}</div>
              <CardTitle className="text-2xl font-extrabold leading-tight md:text-3xl">{question.title}</CardTitle>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{question.prompt}</p>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4">
              <div className="grid grid-cols-1 gap-3">
                {questionOptions.map((option) => {
                  const isPicked = selected === option.id;
                  const isAnswer = option.id === question.answer;
                  const className =
                    selected && isAnswer
                      ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-50'
                      : selected && isPicked
                        ? 'border-red-500/60 bg-red-500/15 text-red-100'
                        : selected
                          ? 'border-border/60 bg-muted/25 text-muted-foreground'
                          : 'border-border/70 bg-muted/35 text-foreground hover:border-primary/60 hover:bg-accent';

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option.id)}
                      disabled={Boolean(selected)}
                      className={`rounded-lg border px-4 py-3 text-left text-base leading-snug transition-colors ${className}`}
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
