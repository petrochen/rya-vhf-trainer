import { useEffect, useState } from 'react';
import { NATO_ALPHABET, LETTERS } from './data';
import type { UserStats } from './data';
import { Shield, Target, Trophy, XCircle, Radio, BookCheck, Signal, MessageSquareQuote, MapPinned, Siren } from 'lucide-react';
import { EXAM_TOPIC_LABELS } from './srcData';
import type { SrcProgress } from './topicProgress';

interface ProgressProps {
  onBack: () => void;
  stats: UserStats;
  srcProgress: SrcProgress;
}

const TOPIC_ICONS = {
  equipment: BookCheck,
  priority: Shield,
  channels: Signal,
  dsc: Radio,
  procedure: MessageSquareQuote,
  position: MapPinned,
  traffic: Siren,
  gmdss: Radio,
  regulations: Shield,
} as const;

export const Progress = ({ onBack, stats, srcProgress }: ProgressProps) => {
  const [now, setNow] = useState(() => Date.now());
  const sortedLetters = [...LETTERS].sort((a, b) => stats[b].score - stats[a].score);
  
  const totalScore = LETTERS.reduce((acc, l) => acc + stats[l].score, 0);
  const maxScore = LETTERS.length * 10;
  const masteryPercentage = Math.round((totalScore / maxScore) * 100) || 0;
  const masteredLetters = LETTERS.filter((l) => stats[l].score >= 8).length;
  const topicCards = (Object.keys(srcProgress.topics) as Array<keyof typeof srcProgress.topics>).map((topic) => {
    const total = srcProgress.topics[topic].correct + srcProgress.topics[topic].wrong;
    const accuracy = total > 0 ? Math.round((srcProgress.topics[topic].correct / total) * 100) : 0;
    return {
      topic,
      total,
      accuracy,
      correct: srcProgress.topics[topic].correct,
    };
  });
  const totalTopicAttempts = topicCards.reduce((sum, card) => sum + card.total, 0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="glass-panel p-8 max-w-5xl mx-auto w-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="flex justify-between items-center mb-8 relative z-10">
        <button onClick={onBack} className="btn-secondary px-4 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors">
          <XCircle size={18} />
          Close
        </button>
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center gap-3">
          <Trophy className="text-indigo-400" />
          Stats & Command Center
        </span>
        <div className="w-24"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center">
          <Shield className="w-12 h-12 text-emerald-400 mb-4" />
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            {masteryPercentage}%
          </div>
          <div className="text-sm text-gray-400 mt-2 font-medium tracking-wide uppercase">Global Mastery</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center">
          <Target className="w-12 h-12 text-blue-400 mb-4" />
          <div className="text-4xl font-black text-white">
            {masteredLetters} / 26
          </div>
          <div className="text-sm text-gray-400 mt-2 font-medium tracking-wide uppercase">Letters Mastered</div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center">
          <div className="w-full bg-black/40 rounded-full h-8 overflow-hidden relative border border-white/5">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${masteryPercentage}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white shadow-sm drop-shadow-md">
              Retention Health
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-4 text-center max-w-[200px]">
             Powered by Spaced Repetition
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center">
          <BookCheck className="w-12 h-12 text-yellow-400 mb-4" />
          <div className="text-4xl font-black text-white">{totalTopicAttempts}</div>
          <div className="text-sm text-gray-400 mt-2 font-medium tracking-wide uppercase">SRC Topic Attempts</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center">
          <Trophy className="w-12 h-12 text-red-300 mb-4" />
          <div className="text-4xl font-black text-white">{srcProgress.mockExam.bestPercent}%</div>
          <div className="text-sm text-gray-400 mt-2 font-medium tracking-wide uppercase">Best Mock Exam</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center">
          <Radio className="w-12 h-12 text-blue-300 mb-4" />
          <div className="text-4xl font-black text-white">{srcProgress.mockExam.attempts}</div>
          <div className="text-sm text-gray-400 mt-2 font-medium tracking-wide uppercase">Mock Exams Taken</div>
        </div>
      </div>

      <div className="bg-black/20 rounded-xl p-6 border border-white/5 relative z-10 mb-8">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Radio size={20} className="text-primary" /> SRC Topic Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topicCards.map((card) => {
            const Icon = TOPIC_ICONS[card.topic];
            return (
              <div key={card.topic} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-3 gap-3">
                  <div className="flex items-center gap-2">
                    <Icon size={18} className="text-blue-300" />
                    <span className="text-white font-bold">{EXAM_TOPIC_LABELS[card.topic]}</span>
                  </div>
                  <span className="text-xs uppercase tracking-widest text-blue-200">{card.total} attempts</span>
                </div>
                <div className="text-3xl font-black text-white mb-2">{card.accuracy}%</div>
                <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-emerald-400" style={{ width: `${card.accuracy}%` }} />
                </div>
                <div className="text-sm text-gray-400">
                  {card.correct} correct, {card.total - card.correct} wrong
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-black/20 rounded-xl p-6 border border-white/5 relative z-10">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Target size={20} className="text-primary" /> Alphabet Analytics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {sortedLetters.map(letter => {
            const score = stats[letter].score;
            let color = 'text-gray-500 border-white/10 custom-bg-gray/5';
            
            if (score >= 8) color = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50';
            else if (score >= 4) color = 'text-blue-400 border-blue-500/30 bg-blue-500/10';
            else if (score > 0) color = 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
            else color = 'text-gray-400 border-white/10 bg-white/5';

            const ease = (stats[letter].easeFactor ?? 2.5).toFixed(1);
            const nextReview = stats[letter].nextReview ?? now;
            const dueInMins = Math.max(0, Math.floor((nextReview - now) / 60000));
            const isDue = nextReview <= now;

            return (
              <div 
                key={letter}
                className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center transition-all cursor-default scale-110-hover ${color}`}
                title={`Ease: ${ease} | Due in: ${dueInMins}m`}
              >
                <span className="text-2xl font-black mb-1">{letter}</span>
                <span className="text-xs font-bold tracking-wider uppercase opacity-80">{NATO_ALPHABET[letter]}</span>
                <div className="w-full h-1 bg-black/30 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-current transition-all duration-500" style={{ width: `${score * 10}%` }} />
                </div>
                {isDue ? (
                   <span className="text-[9px] mt-1 text-red-400 font-bold uppercase animate-pulse">Due</span>
                ) : (
                   <span className="text-[9px] mt-1 text-gray-500 font-medium uppercase">{dueInMins}m</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
