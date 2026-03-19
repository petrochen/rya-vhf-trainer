export const NATO_ALPHABET: Record<string, string> = {
  A: 'Alfa',
  B: 'Bravo',
  C: 'Charlie',
  D: 'Delta',
  E: 'Echo',
  F: 'Foxtrot',
  G: 'Golf',
  H: 'Hotel',
  I: 'India',
  J: 'Juliett',
  K: 'Kilo',
  L: 'Lima',
  M: 'Mike',
  N: 'November',
  O: 'Oscar',
  P: 'Papa',
  Q: 'Quebec',
  R: 'Romeo',
  S: 'Sierra',
  T: 'Tango',
  U: 'Uniform',
  V: 'Victor',
  W: 'Whiskey',
  X: 'X-ray',
  Y: 'Yankee',
  Z: 'Zulu',
};

export const MISLEADING_WORDS: Record<string, string[]> = {
  A: ['Alpha', 'Apple', 'Archer', 'Aqua'],
  B: ['Beta', 'Baker', 'Boston', 'Bear'],
  C: ['Coco', 'Carol', 'Cipher', 'Carter'],
  D: ['Dog', 'Denver', 'Dexter', 'Diver'],
  E: ['Eagle', 'Easy', 'Epic', 'Edward'],
  F: ['Fox', 'Florida', 'Falcon', 'Frank'],
  G: ['Gamma', 'George', 'Giant', 'Ghost'],
  H: ['Henry', 'Halo', 'Hunter', 'Hector'],
  I: ['Igloo', 'Indigo', 'Iron', 'Ivan'],
  J: ['Jack', 'Joker', 'Jupiter', 'Jungle'],
  K: ['King', 'Kite', 'Knight', 'Kong'],
  L: ['Laser', 'London', 'Lion', 'Lemon'],
  M: ['Mary', 'Mango', 'Master', 'Magic'],
  N: ['Nova', 'Nancy', 'Neon', 'Ninja'],
  O: ['Ocean', 'Omega', 'Orion', 'Orbit'],
  P: ['Peter', 'Paris', 'Piper', 'Panda'],
  Q: ['Queen', 'Quark', 'Quill', 'Quasar'],
  R: ['River', 'Rocket', 'Roger', 'Radar'],
  S: ['Sam', 'Sugar', 'Saturn', 'Silver'],
  T: ['Thomas', 'Tiger', 'Target', 'Titan'],
  U: ['Union', 'Utah', 'Ultra', 'Uncle'],
  V: ['Venus', 'Viper', 'Velvet', 'Volt'],
  W: ['Water', 'Washington', 'Winter', 'Wolf'],
  X: ['Xylophone', 'Xeno', 'Xerox', 'Xylem'],
  Y: ['Yellow', 'York', 'Yogurt', 'Yard'],
  Z: ['Zebra', 'Zero', 'Zenith', 'Zeus'],
};

export const LETTERS = Object.keys(NATO_ALPHABET);

export interface UserStats {
  [letter: string]: {
    correct: number;
    wrong: number;
    score: number; // For backward compatibility/display 0-10
    interval: number; // Days until next review
    easeFactor: number; // Difficulty multiplier
    nextReview: number; // Timestamp
  };
}

export const INITIAL_STATS: UserStats = LETTERS.reduce((acc, letter) => {
  acc[letter] = { 
    correct: 0, 
    wrong: 0, 
    score: 0,
    interval: 0,
    easeFactor: 2.5,
    nextReview: Date.now()
  };
  return acc;
}, {} as UserStats);

export function updateStats(stats: UserStats, letter: string, isCorrect: boolean): UserStats {
  const previous = stats[letter] ?? INITIAL_STATS[letter];
  const current = { ...previous };
  
  // SRS SM-2 inspired logic (MODIFIED for fast-paced game sessions)
  if (isCorrect) {
    current.correct += 1;
    current.score = Math.min(10, current.score + 1);
    
    // Calculate new interval (in minutes)
    // We cap it heavily so the user sees reviews naturally in a 10-15 minute game.
    if (current.interval === 0) {
      current.interval = 1;
    } else if (current.interval === 1) {
      current.interval = 2;
    } else {
      // Slower growth for game minutes vs real-world days
      const newInterval = Math.round(current.interval * (current.easeFactor * 0.6));
      current.interval = Math.min(newInterval, 15); // Max interval is 15 minutes before Review
    }
    
    current.easeFactor = Math.min(2.5, current.easeFactor + 0.1);
  } else {
    current.wrong += 1;
    // Harsher penalty on error to force review immediately
    current.score = Math.max(0, current.score - 2); 
    
    current.interval = 0; // Reset interval to immediately due
    current.easeFactor = Math.max(1.3, current.easeFactor - 0.2); // Decrease ease
  }
  
  // Set next review time (convert interval days to milliseconds, but for game testing we speed it up)
  // Real SRS uses days. We will use a fast-paced game version where "1 day" = 1 minute for rapid testing/learning in 1 session.
  const GAME_MINUTE = 60 * 1000; 
  current.nextReview = Date.now() + (current.interval * GAME_MINUTE);
  
  return {
    ...stats,
    [letter]: current,
  };
}

export const DICTIONARY = [
  "REACT", "WORLD", "HELLO", "SYSTEM", "DESIGN", "CODE", "FRONTEND", "BACKEND",
  "APPLE", "BANANA", "CHERRY", "ORANGE", "GRAPE", "MELON", "WATER", "FIRE",
  "EARTH", "WIND", "LIGHT", "DARK", "SPACE", "TIME", "FUTURE", "PAST",
  "ROCKET", "PLANET", "STAR", "GALAXY", "UNIVERSE", "COSMOS", "METEOR",
  "PYTHON", "JAVA", "RUST", "GOLANG", "SWIFT", "KOTLIN", "RUBY", "PERL",
  "MOUNTAIN", "OCEAN", "FOREST", "DESERT", "RIVER", "VALLEY", "ISLAND",
  "ALPHA", "BRAVO", "CHARLIE", "DELTA", "ECHO", "FOXTROT", "GOLF", "HOTEL",
  "INDIA", "JULIETT", "KILO", "LIMA", "MIKE", "NOVEMBER", "OSCAR", "PAPA",
  "QUEBEC", "ROMEO", "SIERRA", "TANGO", "UNIFORM", "VICTOR", "WHISKEY",
  "XRAY", "YANKEE", "ZULU", "PROGRAM", "SOFTWARE", "HARDWARE", "NETWORK",
  "DATABASE", "SERVER", "CLIENT", "ROUTER", "SWITCH", "MODEM", "CABLE"
];

export function generateSmartWord(stats: UserStats): string {
  // Find letters that are due for review
  const now = Date.now();
  const dueLetters = LETTERS.filter(l => {
    const nextReview = stats[l]?.nextReview ?? now;
    const score = stats[l]?.score ?? 0;
    return nextReview <= now || score < 5;
  });
  
  // Scorer for words: words with more due letters get higher score
  const scoredWords = DICTIONARY.map(word => {
    let score = 0;
    const uniqueLetters = new Set(word.split(''));
    uniqueLetters.forEach(l => {
      if (dueLetters.includes(l)) score += 2;
      else if (stats[l].score < 8) score += 1;
    });
    // Add some randomness
    score += Math.random() * 2;
    return { word, score };
  });

  // Sort by score and pick from top 5
  scoredWords.sort((a, b) => b.score - a.score);
  const topWords = scoredWords.slice(0, 5);
  return topWords[Math.floor(Math.random() * topWords.length)].word;
}
