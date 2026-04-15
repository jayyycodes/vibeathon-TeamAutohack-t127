import { useEffect, useState } from 'react';

export default function ScoreCard({ score, total, xpEarned, message }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    let current = 0;
    const increment = score / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [score]);

  const getPerformanceEmoji = () => {
    if (percentage === 100) return '🏆';
    if (percentage >= 80) return '🔥';
    if (percentage >= 60) return '💪';
    if (percentage >= 40) return '📚';
    return '🎯';
  };

  return (
    <div className="text-center py-8 animate-scale-in">
      {/* Emoji */}
      <div className="text-6xl mb-4">{getPerformanceEmoji()}</div>

      {/* Score circle */}
      <div className="relative w-40 h-40 mx-auto mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Background ring */}
          <circle
            cx="60" cy="60" r="50"
            fill="none"
            stroke="#EDEAE4"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <circle
            cx="60" cy="60" r="50"
            fill="none"
            stroke="#C8FF00"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 3.14} 314`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-text-primary font-display animate-count-up">
            {animatedScore}
          </span>
          <span className="text-sm text-text-muted">/ {total}</span>
        </div>
      </div>

      {/* Message */}
      <h3 className="text-xl font-bold text-text-primary mb-2">{message}</h3>

      {/* XP Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-black mt-4">
        <span className="text-sm font-bold">+{xpEarned} XP Earned</span>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
    </div>
  );
}
