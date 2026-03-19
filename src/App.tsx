import { useState, useEffect } from 'react';
import { Play, Keyboard, BarChart2, Radio, BookOpen, Shield, Waves, MessageSquareQuote, BrainCircuit, Sun, Moon } from 'lucide-react';
import { INITIAL_STATS } from './data';
import type { UserStats } from './data';
import { QuizMode } from './QuizMode';
import { TypingMode } from './TypingMode';
import { Progress } from './Progress';
import { VhfMode } from './VhfMode';
import { ExamLab } from './ExamLab';
import { LearnMode } from './LearnMode';
import { MockExamMode } from './MockExamMode';
import { DscDrillMode } from './DscDrillMode';
import { ProcedureWordsMode } from './ProcedureWordsMode';
import { ChannelDrillMode } from './ChannelDrillMode';
import { PriorityDrillMode } from './PriorityDrillMode';
import { PositionDrillMode } from './PositionDrillMode';
import { TrafficDrillMode } from './TrafficDrillMode';
import { RevisionMode } from './RevisionMode';
import { EquipmentDrillMode } from './EquipmentDrillMode';
import { GmdssDrillMode } from './GmdssDrillMode';
import { RegulationsDrillMode } from './RegulationsDrillMode';
import { ChannelPlanMode } from './ChannelPlanMode';
import { DscConsoleMode } from './DscConsoleMode';
import { EXAM_TOPIC_LABELS } from './srcData';
import type { ExamTopic } from './srcData';
import { INITIAL_SRC_PROGRESS } from './topicProgress';
import type { SrcProgress } from './topicProgress';

const Screen = {
  Home: 'Home',
  Quiz: 'Quiz',
  Type: 'Type',
  Progress: 'Progress',
  Vhf: 'Vhf',
  Exam: 'Exam',
  Learn: 'Learn',
  Mock: 'Mock',
  Equipment: 'Equipment',
  Dsc: 'Dsc',
  Procedure: 'Procedure',
  Channels: 'Channels',
  Priority: 'Priority',
  Position: 'Position',
  Traffic: 'Traffic',
  Gmdss: 'Gmdss',
  Regulations: 'Regulations',
  ChannelPlan: 'ChannelPlan',
  DscConsole: 'DscConsole',
  Revision: 'Revision',
} as const;
type ScreenType = typeof Screen[keyof typeof Screen];
type ThemeMode = 'dark' | 'light';

interface StudyStep {
  id: string;
  title: string;
  description: string;
  screen: ScreenType;
  topic?: ExamTopic;
}

interface TopicMetric {
  topic: ExamTopic;
  total: number;
  accuracy: number;
}

type StepStatus = 'not-started' | 'in-progress' | 'strong';

interface BookBlock {
  id: string;
  chapter: string;
  pages: string;
  title: string;
  objective: string;
  topics: ExamTopic[];
  startScreen: ScreenType;
  critical?: boolean;
}

const TOPIC_ORDER: ExamTopic[] = [
  'equipment',
  'channels',
  'procedure',
  'priority',
  'dsc',
  'position',
  'traffic',
  'gmdss',
  'regulations',
];

const TOPIC_SCREEN_MAP: Record<ExamTopic, ScreenType> = {
  equipment: Screen.Equipment,
  priority: Screen.Priority,
  channels: Screen.Channels,
  dsc: Screen.Dsc,
  procedure: Screen.Procedure,
  position: Screen.Position,
  traffic: Screen.Traffic,
  gmdss: Screen.Gmdss,
  regulations: Screen.Regulations,
};

const STUDY_FLOW: StudyStep[] = [
  {
    id: 'learn',
    title: 'Read Handbook Core',
    description: 'Complete a short fundamentals pass on procedures and regulations before drills.',
    screen: Screen.Learn,
  },
  ...TOPIC_ORDER.map((topic) => ({
    id: `topic-${topic}`,
    title: EXAM_TOPIC_LABELS[topic],
    description: 'Train this topic until you hold at least 80% accuracy consistently.',
    screen: TOPIC_SCREEN_MAP[topic],
    topic,
  })),
  {
    id: 'channel-plan',
    title: 'Channel Plan Simulator',
    description: 'Practise full Appendix channel-plan decisions across service contexts.',
    screen: Screen.ChannelPlan,
  },
  {
    id: 'dsc-console',
    title: 'DSC Console Drill',
    description: 'Practise channel-70 controller actions, data entry, testing, and alert handling.',
    screen: Screen.DscConsole,
  },
  {
    id: 'vhf-builder',
    title: 'Transmission Builder',
    description: 'Build realistic radio messages in the correct sequence.',
    screen: Screen.Vhf,
  },
  {
    id: 'exam-lab',
    title: 'Exam Lab',
    description: 'Mixed questions across all topics without a hard timer.',
    screen: Screen.Exam,
  },
  {
    id: 'mock',
    title: 'Mock Exam',
    description: 'Timer and structure aligned with the official exam style.',
    screen: Screen.Mock,
  },
  {
    id: 'revision',
    title: 'Weak Area Revision',
    description: 'Targeted work on weak topics before a final attempt.',
    screen: Screen.Revision,
  },
];

const STATUS_META: Record<StepStatus, { label: string; className: string }> = {
  'not-started': {
    label: 'Not Started',
    className: 'bg-white/5 border-white/10 text-slate-300',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200',
  },
  strong: {
    label: 'Strong',
    className: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200',
  },
};

const SCREEN_LABELS: Record<ScreenType, string> = {
  Home: 'Home',
  Quiz: 'Phonetic Quiz',
  Type: 'Typing Drill',
  Progress: 'Progress',
  Vhf: 'Transmission Builder',
  Exam: 'Exam Lab',
  Learn: 'Learn Handbook',
  Mock: 'Mock Exam',
  Equipment: 'Equipment Drill',
  Dsc: 'DSC Drill',
  Procedure: 'Procedure Words',
  Channels: 'Channel Drill',
  Priority: 'Priority Drill',
  Position: 'Position / Identity',
  Traffic: 'Acknowledgement / Relay',
  Gmdss: 'GMDSS Systems',
  Regulations: 'Regulations',
  ChannelPlan: 'Channel Plan Simulator',
  DscConsole: 'DSC Console Drill',
  Revision: 'Weak Area Revision',
};

const BOOK_BLOCKS: BookBlock[] = [
  {
    id: 'book-basics',
    chapter: 'Book Block 1',
    pages: 'pp. 21-29, 73',
    title: 'Equipment Controls, Channels, Watchkeeping',
    objective: 'Cover VHF control fundamentals, dual watch, and channel discipline.',
    topics: ['equipment', 'channels'],
    startScreen: Screen.Equipment,
  },
  {
    id: 'book-routine',
    chapter: 'Book Block 2',
    pages: 'pp. 30-42',
    title: 'Routine Voice Procedure + SMNV',
    objective: 'Practise standard prowords, phonetics, radio checks, and routine call flow.',
    topics: ['procedure', 'channels'],
    startScreen: Screen.Procedure,
  },
  {
    id: 'book-priority',
    chapter: 'Book Block 3',
    pages: 'pp. 43-54',
    title: 'Distress / Urgency / Safety Decision',
    objective: 'Classify incidents confidently and choose the correct voice priority.',
    topics: ['priority', 'position', 'traffic'],
    startScreen: Screen.Priority,
    critical: true,
  },
  {
    id: 'book-dsc',
    chapter: 'Book Block 4',
    pages: 'pp. 61-71',
    title: 'DSC Flow + Follow-Up Actions',
    objective: 'Train DSC distress/urgency/safety flows, false alerts, voice follow-up, and acknowledgement discipline.',
    topics: ['dsc', 'position', 'traffic'],
    startScreen: Screen.Dsc,
    critical: true,
  },
  {
    id: 'book-appendix-1',
    chapter: 'Book Block 5',
    pages: 'pp. 72-77',
    title: 'Official SRC Syllabus Coverage',
    objective: 'Cover all mandatory Appendix 1 areas through mixed practice and exam-format training.',
    topics: ['equipment', 'priority', 'channels', 'dsc', 'procedure', 'position', 'traffic', 'gmdss', 'regulations'],
    startScreen: Screen.Exam,
    critical: true,
  },
  {
    id: 'book-gmdss-systems',
    chapter: 'Book Block 6',
    pages: 'pp. 74-76',
    title: 'GMDSS Systems + SAR Awareness',
    objective: 'RCC/SAR, NAVTEX, EPIRB, SART, false-alert procedures.',
    topics: ['gmdss', 'dsc'],
    startScreen: Screen.Gmdss,
    critical: true,
  },
  {
    id: 'book-regulations',
    chapter: 'Book Block 7',
    pages: 'p. 77',
    title: 'Regulations + Public Correspondence',
    objective: 'Licence, operator entitlement, secrecy, logbook, prohibited traffic, AAIC awareness.',
    topics: ['regulations', 'channels', 'procedure'],
    startScreen: Screen.Regulations,
    critical: true,
  },
  {
    id: 'book-appendix-2',
    chapter: 'Book Block 8',
    pages: 'pp. 78-83',
    title: 'SMNV + Channel Selection Chart',
    objective: 'Standardise vocabulary and select channels quickly in scenario-based tasks.',
    topics: ['procedure', 'channels', 'position'],
    startScreen: Screen.Vhf,
    critical: true,
  },
];

function loadInitialStats(): UserStats {
  if (typeof window === 'undefined') {
    return INITIAL_STATS;
  }

  const saved = window.localStorage.getItem('natoStats');
  if (!saved) {
    return INITIAL_STATS;
  }

  try {
    const parsed = JSON.parse(saved) as Record<string, Partial<UserStats[string]>>;
    const migrated: UserStats = { ...INITIAL_STATS };

    for (const letter of Object.keys(INITIAL_STATS)) {
      const base = INITIAL_STATS[letter];
      const incoming = parsed?.[letter];
      migrated[letter] = {
        ...base,
        ...(incoming ?? {}),
        easeFactor: incoming?.easeFactor ?? base.easeFactor,
        interval: incoming?.interval ?? base.interval,
        nextReview: incoming?.nextReview ?? base.nextReview,
      };
    }

    return migrated;
  } catch (error) {
    console.error(error);
    return INITIAL_STATS;
  }
}

function loadInitialSrcProgress(): SrcProgress {
  if (typeof window === 'undefined') {
    return INITIAL_SRC_PROGRESS;
  }

  const saved = window.localStorage.getItem('srcProgress');
  if (!saved) {
    return INITIAL_SRC_PROGRESS;
  }

  try {
    const parsed = JSON.parse(saved) as Partial<SrcProgress>;
    return {
      ...INITIAL_SRC_PROGRESS,
      ...parsed,
      topics: {
        ...INITIAL_SRC_PROGRESS.topics,
        ...(parsed.topics ?? {}),
      },
      mockExam: {
        ...INITIAL_SRC_PROGRESS.mockExam,
        ...(parsed.mockExam ?? {}),
      },
    };
  } catch (error) {
    console.error(error);
    return INITIAL_SRC_PROGRESS;
  }
}

function loadInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const saved = window.localStorage.getItem('uiTheme');
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }

  return 'dark';
}

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(Screen.Home);
  const [stats, setStats] = useState<UserStats>(() => loadInitialStats());
  const [srcProgress, setSrcProgress] = useState<SrcProgress>(() => loadInitialSrcProgress());
  const [theme, setTheme] = useState<ThemeMode>(() => loadInitialTheme());

  useEffect(() => {
    window.localStorage.setItem('natoStats', JSON.stringify(stats));
    window.localStorage.setItem('srcProgress', JSON.stringify(srcProgress));
  }, [stats, srcProgress]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('light', theme === 'light');
    root.classList.toggle('dark', theme === 'dark');
    root.setAttribute('data-theme', theme);
    window.localStorage.setItem('uiTheme', theme);
  }, [theme]);

  const topicMetrics: TopicMetric[] = TOPIC_ORDER.map((topic) => {
    const topicScore = srcProgress.topics[topic];
    const total = topicScore.correct + topicScore.wrong;
    const accuracy = total > 0 ? Math.round((topicScore.correct / total) * 100) : 0;
    return { topic, total, accuracy };
  });

  const metricByTopic = topicMetrics.reduce((acc, metric) => {
    acc[metric.topic] = metric;
    return acc;
  }, {} as Record<ExamTopic, TopicMetric>);

  const totalTopicAttempts = topicMetrics.reduce((sum, metric) => sum + metric.total, 0);
  const strongTopicCount = topicMetrics.filter((metric) => metric.total >= 8 && metric.accuracy >= 80).length;
  const alphabetMastery = Math.round(
    (Object.values(stats).filter((letterStats) => letterStats.score >= 8).length / Object.keys(stats).length) * 100,
  );

  const strongTopics = [...topicMetrics]
    .filter((metric) => metric.total >= 5 && metric.accuracy >= 80)
    .sort((a, b) => b.accuracy - a.accuracy || b.total - a.total)
    .slice(0, 3);

  const weakTopics = [...topicMetrics]
    .filter((metric) => metric.total < 5 || metric.accuracy < 75)
    .sort((a, b) => a.accuracy - b.accuracy || a.total - b.total)
    .slice(0, 3);

  const getTopicStatus = (metric: TopicMetric): StepStatus => {
    if (metric.total === 0) {
      return 'not-started';
    }
    if (metric.total >= 8 && metric.accuracy >= 80) {
      return 'strong';
    }
    return 'in-progress';
  };

  const getStepStatus = (step: StudyStep): StepStatus => {
    if (step.topic) {
      return getTopicStatus(metricByTopic[step.topic]);
    }

    if (step.id === 'learn') {
      return totalTopicAttempts > 0 ? 'strong' : 'in-progress';
    }
    if (step.id === 'channel-plan') {
      return getTopicStatus(metricByTopic.channels);
    }
    if (step.id === 'dsc-console') {
      return getTopicStatus(metricByTopic.dsc);
    }
    if (step.id === 'vhf-builder') {
      const readyCount = topicMetrics.filter((metric) => metric.total >= 5).length;
      if (readyCount >= 5) {
        return 'strong';
      }
      if (readyCount >= 2) {
        return 'in-progress';
      }
      return 'not-started';
    }
    if (step.id === 'exam-lab') {
      if (totalTopicAttempts >= 30) {
        return 'strong';
      }
      if (totalTopicAttempts >= 12) {
        return 'in-progress';
      }
      return 'not-started';
    }
    if (step.id === 'mock') {
      if (srcProgress.mockExam.attempts === 0) {
        return 'not-started';
      }
      if (srcProgress.mockExam.bestPercent >= 80) {
        return 'strong';
      }
      return 'in-progress';
    }
    if (step.id === 'revision') {
      if (totalTopicAttempts < 12) {
        return 'not-started';
      }
      if (weakTopics.length === 0 && srcProgress.mockExam.bestPercent >= 80) {
        return 'strong';
      }
      return 'in-progress';
    }

    return 'not-started';
  };

  const getStepProgressText = (step: StudyStep) => {
    if (step.topic) {
      const metric = metricByTopic[step.topic];
      return `${metric.total} attempts • ${metric.accuracy}% accuracy`;
    }
    if (step.id === 'mock') {
      return `${srcProgress.mockExam.attempts} attempts • best ${srcProgress.mockExam.bestPercent}%`;
    }
    if (step.id === 'channel-plan') {
      const metric = metricByTopic.channels;
      return `${metric.total} channel attempts • ${metric.accuracy}% accuracy`;
    }
    if (step.id === 'dsc-console') {
      const metric = metricByTopic.dsc;
      return `${metric.total} DSC attempts • ${metric.accuracy}% accuracy`;
    }
    if (step.id === 'exam-lab') {
      return `${totalTopicAttempts} topic attempts completed`;
    }
    if (step.id === 'revision') {
      return `${weakTopics.length} weak topics currently flagged`;
    }
    return null;
  };

  const nextWeakTopic = TOPIC_ORDER.find((topic) => {
    const metric = metricByTopic[topic];
    return metric.total < 5 || metric.accuracy < 80;
  });

  const recommendedStep = (() => {
    if (totalTopicAttempts === 0) {
      return STUDY_FLOW.find((step) => step.id === 'learn') ?? STUDY_FLOW[0];
    }
    if (nextWeakTopic) {
      return STUDY_FLOW.find((step) => step.topic === nextWeakTopic) ?? STUDY_FLOW[0];
    }
    if (srcProgress.mockExam.attempts === 0) {
      return STUDY_FLOW.find((step) => step.id === 'exam-lab') ?? STUDY_FLOW[0];
    }
    if (srcProgress.mockExam.bestPercent < 80) {
      return STUDY_FLOW.find((step) => step.id === 'mock') ?? STUDY_FLOW[0];
    }
    return STUDY_FLOW.find((step) => step.id === 'revision') ?? STUDY_FLOW[0];
  })();

  const recommendedReason = (() => {
    if (recommendedStep.id === 'learn') {
      return 'Start with fundamentals: core handbook rules first, then drills.';
    }
    if (recommendedStep.topic) {
      const metric = metricByTopic[recommendedStep.topic];
      if (metric.total === 0) {
        return 'This topic has not been started yet. Tackle it first.';
      }
      return `Current topic accuracy is ${metric.accuracy}% — target at least 80%.`;
    }
    if (recommendedStep.id === 'exam-lab') {
      return 'Core topics are covered, so move into mixed practice.';
    }
    if (recommendedStep.id === 'mock') {
      return 'Time to consolidate with a timed exam-format run.';
    }
    return 'Final targeted clean-up of weak areas before the exam.';
  })();

  const getCompositeStatus = (topics: ExamTopic[]): StepStatus => {
    const metrics = topics.map((topic) => metricByTopic[topic]);
    if (metrics.every((metric) => metric.total === 0)) {
      return 'not-started';
    }
    if (metrics.every((metric) => metric.total >= 8 && metric.accuracy >= 80)) {
      return 'strong';
    }
    return 'in-progress';
  };

  const bookBlockProgress = BOOK_BLOCKS.map((block) => {
    const uniqueTopics = [...new Set(block.topics)];
    const metrics = uniqueTopics.map((topic) => metricByTopic[topic]);
    const attempts = metrics.reduce((sum, metric) => sum + metric.total, 0);
    const accuracy = metrics.length > 0
      ? Math.round(metrics.reduce((sum, metric) => sum + metric.accuracy, 0) / metrics.length)
      : 0;
    const status = getCompositeStatus(uniqueTopics);

    return {
      ...block,
      attempts,
      accuracy,
      status,
    };
  });

  const examCriticalChecks = [
    {
      id: 'critical-equipment',
      label: 'VHF controls, dual watch, simplex/duplex and power discipline',
      ok: metricByTopic.equipment.total >= 8 && metricByTopic.equipment.accuracy >= 80,
    },
    {
      id: 'critical-priority',
      label: 'Distress / Urgency / Safety classification',
      ok: metricByTopic.priority.total >= 8 && metricByTopic.priority.accuracy >= 80,
    },
    {
      id: 'critical-channels',
      label: 'Channel 16 / 70 discipline and working-channel switch',
      ok: metricByTopic.channels.total >= 8 && metricByTopic.channels.accuracy >= 80,
    },
    {
      id: 'critical-dsc',
      label: 'DSC flow and voice follow-up actions',
      ok: metricByTopic.dsc.total >= 8 && metricByTopic.dsc.accuracy >= 80,
    },
    {
      id: 'critical-prowords',
      label: 'Procedure words and standard marine vocabulary',
      ok: metricByTopic.procedure.total >= 8 && metricByTopic.procedure.accuracy >= 80,
    },
    {
      id: 'critical-position',
      label: 'Position / MMSI / identity transmission clarity',
      ok: metricByTopic.position.total >= 8 && metricByTopic.position.accuracy >= 80,
    },
    {
      id: 'critical-traffic',
      label: 'Acknowledgement, Seelonce, Mayday Relay discipline',
      ok: metricByTopic.traffic.total >= 8 && metricByTopic.traffic.accuracy >= 80,
    },
    {
      id: 'critical-gmdss',
      label: 'RCC/SAR, NAVTEX, EPIRB and SART theory block',
      ok: metricByTopic.gmdss.total >= 8 && metricByTopic.gmdss.accuracy >= 80,
    },
    {
      id: 'critical-regulations',
      label: 'Licence, secrecy, logs, prohibited traffic, public correspondence/AAIC',
      ok: metricByTopic.regulations.total >= 8 && metricByTopic.regulations.accuracy >= 80,
    },
    {
      id: 'critical-mock-run',
      label: 'At least one full timed mock exam completed',
      ok: srcProgress.mockExam.attempts > 0,
    },
    {
      id: 'critical-mock-score',
      label: 'Best mock score is at least 80%',
      ok: srcProgress.mockExam.bestPercent >= 80,
    },
  ];

  const examCriticalDone = examCriticalChecks.filter((check) => check.ok).length;

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.Quiz:
        return <QuizMode onBack={() => setCurrentScreen(Screen.Home)} stats={stats} setStats={setStats} />;
      case Screen.Type:
        return <TypingMode onBack={() => setCurrentScreen(Screen.Home)} stats={stats} setStats={setStats} />;
      case Screen.Progress:
        return <Progress onBack={() => setCurrentScreen(Screen.Home)} stats={stats} srcProgress={srcProgress} />;
      case Screen.Vhf:
        return <VhfMode onBack={() => setCurrentScreen(Screen.Home)} />;
      case Screen.Exam:
        return <ExamLab onBack={() => setCurrentScreen(Screen.Home)} srcProgress={srcProgress} setSrcProgress={setSrcProgress} />;
      case Screen.Learn:
        return <LearnMode onBack={() => setCurrentScreen(Screen.Home)} />;
      case Screen.Mock:
        return <MockExamMode onBack={() => setCurrentScreen(Screen.Home)} setSrcProgress={setSrcProgress} />;
      case Screen.Equipment:
        return <EquipmentDrillMode onBack={() => setCurrentScreen(Screen.Home)} srcProgress={srcProgress} setSrcProgress={setSrcProgress} />;
      case Screen.Dsc:
        return <DscDrillMode onBack={() => setCurrentScreen(Screen.Home)} srcProgress={srcProgress} setSrcProgress={setSrcProgress} />;
      case Screen.Procedure:
        return <ProcedureWordsMode onBack={() => setCurrentScreen(Screen.Home)} srcProgress={srcProgress} setSrcProgress={setSrcProgress} />;
      case Screen.Channels:
        return <ChannelDrillMode onBack={() => setCurrentScreen(Screen.Home)} srcProgress={srcProgress} setSrcProgress={setSrcProgress} />;
      case Screen.Priority:
        return <PriorityDrillMode onBack={() => setCurrentScreen(Screen.Home)} srcProgress={srcProgress} setSrcProgress={setSrcProgress} />;
      case Screen.Position:
        return <PositionDrillMode onBack={() => setCurrentScreen(Screen.Home)} srcProgress={srcProgress} setSrcProgress={setSrcProgress} />;
      case Screen.Traffic:
        return <TrafficDrillMode onBack={() => setCurrentScreen(Screen.Home)} srcProgress={srcProgress} setSrcProgress={setSrcProgress} />;
      case Screen.Gmdss:
        return <GmdssDrillMode onBack={() => setCurrentScreen(Screen.Home)} srcProgress={srcProgress} setSrcProgress={setSrcProgress} />;
      case Screen.Regulations:
        return <RegulationsDrillMode onBack={() => setCurrentScreen(Screen.Home)} srcProgress={srcProgress} setSrcProgress={setSrcProgress} />;
      case Screen.ChannelPlan:
        return <ChannelPlanMode onBack={() => setCurrentScreen(Screen.Home)} srcProgress={srcProgress} setSrcProgress={setSrcProgress} />;
      case Screen.DscConsole:
        return <DscConsoleMode onBack={() => setCurrentScreen(Screen.Home)} srcProgress={srcProgress} setSrcProgress={setSrcProgress} />;
      case Screen.Revision:
        return <RevisionMode onBack={() => setCurrentScreen(Screen.Home)} srcProgress={srcProgress} setSrcProgress={setSrcProgress} />;
      case Screen.Home:
      default:
        return (
          <div
            className="glass-panel p-6 md:p-6 max-w-5xl mx-auto w-full relative overflow-hidden overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 8rem)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 mb-6">
              <div className="text-xs tracking-widest uppercase text-blue-200 mb-3">Based On RYA VHF SRC Course Handbook 2019</div>
              <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 tracking-tight text-white block">
                RYA SRC Prep
              </h1>
              <p className="text-gray-400 mb-6 text-lg max-w-2xl font-medium leading-relaxed block">
                The study route is now sequential: fundamentals first, then topic drills, followed by Exam Lab, Mock Exam, and targeted weak-area revision.
              </p>
            </div>

            <div className="relative z-10 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5 mb-6">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <div className="text-xs tracking-widest uppercase text-blue-200 mb-2">Next Recommended Step</div>
                  <div className="text-2xl font-extrabold text-white mb-2">{recommendedStep.title}</div>
                  <div className="text-sm text-slate-300 leading-relaxed">{recommendedReason}</div>
                </div>
                <button
                  onClick={() => setCurrentScreen(recommendedStep.screen)}
                  className="btn-primary px-5 py-3 text-sm rounded-lg flex items-center gap-2 shrink-0"
                >
                  <Play size={18} />
                  Open {SCREEN_LABELS[recommendedStep.screen]}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-blue-200 mb-2">
                  <Shield size={16} />
                  Topics Strong
                </div>
                <div className="text-4xl font-black text-white">{strongTopicCount} / {TOPIC_ORDER.length}</div>
                <div className="text-sm text-gray-400 mt-2">A topic is marked strong at 8+ attempts and 80%+ accuracy.</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-emerald-300 mb-2">
                  <BarChart2 size={16} />
                  Topic Attempts
                </div>
                <div className="text-4xl font-black text-white">{totalTopicAttempts}</div>
                <div className="text-sm text-gray-400 mt-2">Total training volume across exam topics.</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-blue-200 mb-2">
                  <Keyboard size={16} />
                  Alphabet Mastery
                </div>
                <div className="text-4xl font-black text-white">{alphabetMastery}%</div>
                <div className="text-sm text-gray-400 mt-2">Share of letters with a stable score of 8+.</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-red-200 mb-2">
                  <Radio size={16} />
                  Best Mock
                </div>
                <div className="text-4xl font-black text-white">{srcProgress.mockExam.bestPercent}%</div>
                <div className="text-sm text-gray-400 mt-2">{srcProgress.mockExam.attempts} timed attempts completed.</div>
              </div>
            </div>

            <div className="relative z-10 bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mb-6">
              <div className="flex justify-between items-center gap-4 mb-4">
                <div>
                  <div className="text-xs tracking-widest uppercase text-red-200 mb-1">Exam-Critical Block (Appendix 1 Focus)</div>
                  <div className="text-2xl font-extrabold text-white">{examCriticalDone} / {examCriticalChecks.length} checkpoints ready</div>
                </div>
                <button
                  onClick={() => setCurrentScreen(Screen.Mock)}
                  className="btn-secondary px-4 py-2 text-sm rounded-lg border border-white/10 shrink-0"
                >
                  Run Mock
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {examCriticalChecks.map((check) => (
                  <div
                    key={check.id}
                    className={`rounded-xl border p-3 text-sm ${
                      check.ok
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
                        : 'bg-black/20 border-white/10 text-slate-300'
                    }`}
                  >
                    {check.ok ? 'Ready: ' : 'Pending: '}
                    {check.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mb-6">
              <div className="text-xs tracking-widest uppercase text-white/50 mb-3">Book-Structured Training Blocks</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookBlockProgress.map((block) => {
                  const statusMeta = STATUS_META[block.status];
                  return (
                    <div key={block.id} className={`rounded-2xl border p-4 ${block.critical ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-black/20 border-white/10'}`}>
                      <div className="flex justify-between items-center gap-3 mb-3">
                        <div>
                          <div className="text-xs uppercase tracking-widest text-white/50 mb-1">
                            {block.chapter} · {block.pages}
                          </div>
                          <div className="text-white font-bold">{block.title}</div>
                        </div>
                        <span className={`text-xs uppercase tracking-widest border rounded-full px-3 py-2 ${statusMeta.className}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                      <div className="text-sm text-slate-300 leading-relaxed mb-3">{block.objective}</div>
                      <div className="text-xs tracking-widest uppercase text-blue-200 mb-4">
                        {block.attempts} attempts • {block.accuracy}% avg accuracy
                      </div>
                      <button
                        onClick={() => setCurrentScreen(block.startScreen)}
                        className="btn-secondary px-4 py-2 text-sm rounded-lg border border-white/10"
                      >
                        Start From {SCREEN_LABELS[block.startScreen]}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative z-10 mb-6">
              <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-white/50 mb-3">
                <Waves size={14} />
                Study Flow (What Goes Next)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STUDY_FLOW.map((step, index) => {
                  const status = getStepStatus(step);
                  const statusMeta = STATUS_META[status];
                  const progressText = getStepProgressText(step);
                  const isRecommended = step.id === recommendedStep.id;
                  return (
                    <div
                      key={step.id}
                      className={`rounded-2xl border p-4 ${isRecommended ? 'bg-blue-500/10 border-blue-500/30' : 'bg-black/20 border-white/10'}`}
                    >
                      <div className="flex justify-between items-center gap-3 mb-3">
                        <div>
                          <div className="text-xs uppercase tracking-widest text-white/50 mb-1">Step {index + 1}</div>
                          <div className="text-white font-bold">{step.title}</div>
                        </div>
                        <span className={`text-xs uppercase tracking-widest border rounded-full px-3 py-2 ${statusMeta.className}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                      <div className="text-sm text-slate-300 leading-relaxed mb-3">{step.description}</div>
                      {progressText && (
                        <div className="text-xs text-blue-200 tracking-widest uppercase mb-4">{progressText}</div>
                      )}
                      <button
                        onClick={() => setCurrentScreen(step.screen)}
                        className="btn-secondary px-4 py-2 text-sm rounded-lg border border-white/10"
                      >
                        Open {SCREEN_LABELS[step.screen]}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 mb-6">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
                <div className="text-xs tracking-widest uppercase text-emerald-300 mb-2">What You Know Well</div>
                <div className="grid grid-cols-1 gap-2">
                  {strongTopics.length === 0 ? (
                    <div className="text-sm text-slate-300 bg-black/20 border border-white/10 rounded-xl p-3">
                      No topics are strong yet.
                    </div>
                  ) : (
                    strongTopics.map((metric) => (
                      <div key={metric.topic} className="text-sm text-slate-200 bg-black/20 border border-white/10 rounded-xl p-3">
                        <span className="font-bold">{EXAM_TOPIC_LABELS[metric.topic]}</span> · {metric.accuracy}% · {metric.total} attempts
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                <div className="text-xs tracking-widest uppercase text-red-200 mb-2">Needs Work</div>
                <div className="grid grid-cols-1 gap-2">
                  {weakTopics.length === 0 ? (
                    <div className="text-sm text-slate-300 bg-black/20 border border-white/10 rounded-xl p-3">
                      No weak topics detected. Maintain readiness with mock + revision.
                    </div>
                  ) : (
                    weakTopics.map((metric) => (
                      <div key={metric.topic} className="text-sm text-slate-200 bg-black/20 border border-white/10 rounded-xl p-3">
                        <span className="font-bold">{EXAM_TOPIC_LABELS[metric.topic]}</span> · {metric.accuracy}% · {metric.total} attempts
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-xs tracking-widest uppercase text-white/50 mb-3">Quick Access Tools</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setCurrentScreen(Screen.Equipment)}
                  className="btn-secondary flex items-center justify-center gap-2 text-sm py-3 border border-white/10"
                >
                  <Shield size={18} />
                  Equipment
                </button>
                <button
                  onClick={() => setCurrentScreen(Screen.Gmdss)}
                  className="btn-secondary flex items-center justify-center gap-2 text-sm py-3 border border-white/10"
                >
                  <Waves size={18} />
                  GMDSS
                </button>
                <button
                  onClick={() => setCurrentScreen(Screen.Regulations)}
                  className="btn-secondary flex items-center justify-center gap-2 text-sm py-3 border border-white/10"
                >
                  <BookOpen size={18} />
                  Regulations
                </button>
                <button
                  onClick={() => setCurrentScreen(Screen.Vhf)}
                  className="btn-secondary flex items-center justify-center gap-2 text-sm py-3 border border-white/10"
                >
                  <Radio size={18} />
                  Builder
                </button>
                <button
                  onClick={() => setCurrentScreen(Screen.ChannelPlan)}
                  className="btn-secondary flex items-center justify-center gap-2 text-sm py-3 border border-white/10"
                >
                  <Waves size={18} />
                  Channel Plan
                </button>
                <button
                  onClick={() => setCurrentScreen(Screen.DscConsole)}
                  className="btn-secondary flex items-center justify-center gap-2 text-sm py-3 border border-white/10"
                >
                  <Radio size={18} />
                  DSC Console
                </button>
                <button
                  onClick={() => setCurrentScreen(Screen.Quiz)}
                  className="btn-secondary flex items-center justify-center gap-2 text-sm py-3 border border-white/10"
                >
                  <BookOpen size={18} />
                  Phonetic Quiz
                </button>
                <button
                  onClick={() => setCurrentScreen(Screen.Type)}
                  className="btn-secondary flex items-center justify-center gap-2 text-sm py-3 border border-white/10"
                >
                  <MessageSquareQuote size={18} />
                  Typing
                </button>
                <button
                  onClick={() => setCurrentScreen(Screen.Progress)}
                  className="btn-secondary flex items-center justify-center gap-2 text-sm py-3 border border-white/10"
                >
                  <BrainCircuit size={18} />
                  Progress
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  const showFooter = currentScreen === Screen.Home;

  return (
    <div className="app-wrapper page-shell min-h-screen overflow-x-hidden flex flex-col">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <button
        onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
        className="fixed top-4 right-4 z-20 btn-secondary px-3 py-2 rounded-lg text-sm flex items-center gap-2 border border-white/10"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
      </button>
      <div className={`container relative z-10 pt-16 ${showFooter ? 'pb-10' : 'pb-8'} w-full`}>
        {renderScreen()}
      </div>

      {showFooter && (
        <div className="w-full py-4 text-center text-sm font-medium text-white/40 tracking-wider flex justify-center items-center gap-2">
          <span>RYA SRC PREP</span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span>HANDBOOK-BASED VHF + DSC TRAINING</span>
        </div>
      )}
    </div>
  );
};

export default App;
