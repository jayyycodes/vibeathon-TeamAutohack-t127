import { useState } from 'react';

export default function QuizCard({ question, options, correctAnswer, onAnswer, showResult, questionNumber, totalQuestions }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (optionLetter) => {
    if (showResult) return;
    setSelected(optionLetter);
    onAnswer(optionLetter);
  };

  const getOptionStyle = (optionLetter) => {
    const base = 'w-full text-left p-4 rounded-xl border transition-all duration-200 text-sm font-medium cursor-pointer';

    if (!showResult) {
      if (selected === optionLetter) {
        return `${base} border-black bg-surface text-text-primary`;
      }
      return `${base} border-border bg-card hover:border-black text-text-primary`;
    }

    if (optionLetter === correctAnswer) {
      return `${base} border-[#2E7D32] bg-[#F0FFF0] text-[#1B5E20]`;
    }
    if (selected === optionLetter && optionLetter !== correctAnswer) {
      return `${base} border-[#C62828] bg-[#FFF0F0] text-[#7F0000]`;
    }
    return `${base} border-border bg-card text-text-muted opacity-60`;
  };

  const getIcon = (optionLetter) => {
    if (!showResult) return null;
    if (optionLetter === correctAnswer) {
      return (
        <svg className="w-5 h-5 text-[#2E7D32] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    if (selected === optionLetter && optionLetter !== correctAnswer) {
      return (
        <svg className="w-5 h-5 text-[#C62828] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in-up">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="section-label">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                i < questionNumber ? 'bg-accent' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary leading-relaxed">
          {question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const optionLetter = option.match(/^([A-D]):/)?.[1] || letter;

          return (
            <button
              key={idx}
              onClick={() => handleSelect(optionLetter)}
              disabled={showResult}
              className={getOptionStyle(optionLetter)}
            >
              <div className="flex items-center justify-between gap-3">
                <span>{option}</span>
                {getIcon(optionLetter)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
