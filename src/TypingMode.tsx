import { useRef, useState } from 'react';
import { NATO_ALPHABET, updateStats, generateSmartWord } from './data';
import type { UserStats } from './data';

interface TypingModeProps {
  onBack: () => void;
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

export const TypingMode = ({ onBack, stats, setStats }: TypingModeProps) => {
  const [targetSequence, setTargetSequence] = useState<string>(() => generateSmartWord(stats));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);
  const [correctionMode, setCorrectionMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetSequence = () => {
    setTargetSequence(generateSmartWord(stats));
    setCurrentIndex(0);
    setInputValue('');
    setError(false);
    setCorrectionMode(false);
  };

  const completeLetter = (currentLetter: string) => {
    if (!correctionMode) {
      setStats((prev) => updateStats(prev, currentLetter, true));
    }
    setInputValue('');
    setError(false);
    setCorrectionMode(false);

    if (currentIndex < targetSequence.length - 1) {
      setCurrentIndex((value) => value + 1);
      return;
    }

    window.setTimeout(() => resetSequence(), 500);
  };

  const failLetter = (currentLetter: string) => {
    setError(true);
    if (!correctionMode) {
      setStats((prev) => updateStats(prev, currentLetter, false));
      setCorrectionMode(true);
    }
    setInputValue('');
    if ('vibrate' in navigator) navigator.vibrate(200);
  };

  const submitWord = (value: string, forceSubmit: boolean) => {
    const currentLetter = targetSequence[currentIndex];
    if (!currentLetter) {
      return;
    }

    const targetWord = NATO_ALPHABET[currentLetter].toLowerCase();
    const typed = value.trim().toLowerCase();
    if (typed === targetWord) {
      completeLetter(currentLetter);
      return;
    }

    if (forceSubmit) {
      failLetter(currentLetter);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setError(false);
    const forceSubmit = val.endsWith(' ') || val.endsWith('\n');
    submitWord(val, forceSubmit);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitWord(inputValue, true);
    }
  };

  return (
    <div className={`glass-panel p-8 max-w-2xl mx-auto w-full text-center ${error ? 'wrong-flash' : ''}`}>
      <div className="flex justify-between items-center mb-10">
        <button onClick={onBack} className="btn-secondary px-4 py-2 text-sm rounded-lg opacity-80 hover-opacity-100">
          Back
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            Smart Typing
          </span>
        </div>
        <div className="w-16"></div>
      </div>

      <div className="mb-4 text-sm text-gray-400 font-medium">Type the NATO word for each letter</div>
      
      <div className="flex justify-center flex-wrap gap-2 mb-10">
        {targetSequence.split('').map((char, i) => (
          <div 
            key={`${i}-${char}`}
            className={`w-16 h-20 flex items-center justify-center text-4xl font-bold rounded-xl border-2 transition-all duration-300
              ${i === currentIndex ? 'border-primary bg-primary/20 scale-110 shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 
                i < currentIndex ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' : 'border-white/10 bg-white/5 text-gray-400'}
              ${i < currentIndex ? 'opacity-30' : 'opacity-100'}  
              `}
          >
            {char}
          </div>
        ))}
      </div>

      <div className="relative max-w-xs mx-auto">
        <input 
          ref={inputRef}
          autoFocus
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type the NATO word"
          className={`w-full bg-white/5 border-2 ${error ? 'border-red-500 text-red-200' : 'border-white/20 text-white'} rounded-xl px-6 py-4 text-center text-xl font-semibold shadow-inner focus-outline-none focus-border-primary focus-bg-white-10 transition-all`}
        />
        {correctionMode && (
          <div className="absolute -bottom-10 left-0 right-0 text-red-400 text-sm font-medium transition-all bg-red-500/10 p-2 rounded-lg border border-red-500/20">
            Correct: {NATO_ALPHABET[targetSequence[currentIndex]].toUpperCase()}. Type it to continue!
          </div>
        )}
      </div>
      
      <div className="mt-12 text-sm text-gray-500 opacity-80">
        Progress is automatically saved. Focus on speed and accuracy.
      </div>
    </div>
  );
};
