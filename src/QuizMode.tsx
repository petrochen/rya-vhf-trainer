import { useState } from 'react';
import confetti from 'canvas-confetti';
import { NATO_ALPHABET, LETTERS, MISLEADING_WORDS, updateStats } from './data';
import type { UserStats } from './data';

interface QuizModeProps {
  onBack: () => void;
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;
    window.speechSynthesis.speak(utterance);
  }
};

function getLowestScoreLetters(stats: UserStats) {
  return [...LETTERS].sort((a, b) => stats[a].score - stats[b].score).slice(0, 5);
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function buildQuestion(stats: UserStats) {
  const pool = Math.random() < 0.7 ? getLowestScoreLetters(stats) : LETTERS;
  const letter = pool[Math.floor(Math.random() * pool.length)];
  const correctWord = NATO_ALPHABET[letter];
  const wrongOptions = shuffle(MISLEADING_WORDS[letter]).slice(0, 3);
  return {
    letter,
    options: shuffle([correctWord, ...wrongOptions]),
  };
}

export const QuizMode = ({ onBack, stats, setStats }: QuizModeProps) => {
  const [question, setQuestion] = useState(() => buildQuestion(stats));
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasErrored, setHasErrored] = useState(false);
  const currentLetter = question.letter;
  const options = question.options;

  const nextQuestion = () => {
    setQuestion(buildQuestion(stats));
    setSelected(null);
    setIsCorrect(null);
    setHasErrored(false);
  };

  const handleSelect = (option: string) => {
    if (selected && isCorrect) return; // Already finished this question
    
    const correct = option === NATO_ALPHABET[currentLetter];
    
    // Only record stats on the FIRST attempt
    if (!hasErrored && !selected) {
      setStats((value) => updateStats(value, currentLetter, correct));
    }
    
    setSelected(option);
    setIsCorrect(correct);
    
    if (correct) {
      speakText(NATO_ALPHABET[currentLetter]);
      const scoreAfterAnswer = (stats[currentLetter]?.score ?? 0) + 1;
      const shouldCelebrate = !hasErrored && scoreAfterAnswer % 3 === 0;
      if (shouldCelebrate) {
        confetti({ particleCount: 50, spread: 60 });
      }
      
      // Only proceed after they hit the correct one
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    } else {
      setHasErrored(true);
      if ('vibrate' in navigator) navigator.vibrate(200);
    }
  };

  return (
    <div className={`glass-panel p-8 max-w-lg mx-auto w-full text-center ${isCorrect === true ? 'correct-flash' : isCorrect === false ? 'wrong-flash' : ''}`}>
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="btn-secondary px-4 py-2 text-sm rounded-lg">Back</button>
        <span className="text-xl font-bold text-gray-400">Quiz Mode</span>
        <button className="btn-secondary px-4 py-2 opacity-0 cursor-default">Back</button>
      </div>
      
      <div className="mb-6">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-2 block">What is the word for</span>
        <div className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary drop-shadow-md pb-4 transition-all scale-110">
          {currentLetter}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 relative">
        {options.map((opt) => {
          let bgClass = "bg-white/5 border border-white/10 hover-bg-white-10";
          if (selected) {
            if (opt === NATO_ALPHABET[currentLetter] && isCorrect) {
              bgClass = "bg-emerald-500/20 border-emerald-500 text-emerald-300";
            } else if (opt === selected && !isCorrect) {
              bgClass = "bg-red-500/20 border-red-500 text-red-300";
            } else if (hasErrored && opt === NATO_ALPHABET[currentLetter]) {
              // Highlight the correct one so they know they need to click it
              bgClass = "bg-primary/20 border-primary text-primary animate-pulse shadow-[0_0_15px_rgba(79,70,229,0.5)]";
            } else {
              bgClass = "opacity-50 pointer-events-none bg-white/5 border-white/5";
            }
          }

          return (
            <button 
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`p-4 rounded-xl text-lg font-medium transition-all ${bgClass}`}
            >
              {opt}
            </button>
          );
        })}
        {hasErrored && !isCorrect && (
          <div className="absolute -bottom-10 left-0 right-0 text-amber-400 text-sm font-medium transition-all bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
            Click the correct answer: {NATO_ALPHABET[currentLetter]}
          </div>
        )}
      </div>
    </div>
  );
};
