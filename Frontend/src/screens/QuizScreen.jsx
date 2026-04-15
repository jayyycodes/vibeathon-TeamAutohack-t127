import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import QuizCard from '../components/QuizCard';
import ScoreCard from '../components/ScoreCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateQuiz, updateProgress } from '../services/api';

export default function QuizScreen() {
  const navigate = useNavigate();
  const { username } = useAuth();
  const [step, setStep] = useState('setup');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await generateQuiz(topic.trim(), difficulty);
      if (data.quiz && data.quiz.length > 0) {
        setQuestions(data.quiz);
        setAnswers([]);
        setCurrentQ(0);
        setStep('quiz');
        setShowResult(false);
        setScore(0);
      } else {
        setError('No questions generated. Try a different topic.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionLetter) => {
    const correct = questions[currentQ].correct;
    const isCorrect = optionLetter.toUpperCase() === correct.toUpperCase();
    setAnswers((prev) => [...prev, { selected: optionLetter, correct, isCorrect }]);
    if (isCorrect) setScore((s) => s + 1);
    setShowResult(true);
  };

  const handleNext = async () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setShowResult(false);
    } else {
      const finalScore = score;
      const xp = finalScore * 10;
      try {
        await updateProgress(username, 99, xp);
      } catch {
        // silently fail
      }
      setStep('result');
    }
  };

  const getPerformanceMessage = () => {
    const pct = (score / questions.length) * 100;
    if (pct === 100) return 'Perfect Score! You\'re a genius!';
    if (pct >= 80) return 'Excellent! Nearly flawless!';
    if (pct >= 60) return 'Great job! Keep learning!';
    if (pct >= 40) return 'Good effort! Review the topics.';
    return 'Keep practicing, you\'ll get there!';
  };

  const quickTopics = ['Neural Networks', 'Linear Regression', 'Decision Trees', 'NLP', 'Computer Vision'];

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <button
          onClick={() => step === 'setup' ? navigate('/home') : setStep('setup')}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {step === 'setup' ? 'Back to Home' : 'New Quiz'}
        </button>

        {/* Step 1: Setup */}
        {step === 'setup' && (
          <div className="animate-fade-in-up">
            <h1 className="heading-display text-3xl sm:text-4xl mb-2">AI Quiz Generator</h1>
            <p className="text-text-secondary text-sm mb-8">Pick a topic and difficulty. The AI will generate 5 custom questions.</p>

            <div className="space-y-5">
              {/* Topic input */}
              <div>
                <label htmlFor="quiz-topic" className="section-label block mb-1.5">Topic</label>
                <input
                  id="quiz-topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Neural Networks, KNN, Transformers..."
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10 transition-all"
                />
                {/* Quick topic pills */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {quickTopics.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-secondary hover:border-black hover:text-text-primary transition-all cursor-pointer"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="section-label block mb-1.5">Difficulty</label>
                <div className="flex gap-3">
                  {[
                    { value: 'easy', label: 'Easy' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'hard', label: 'Hard' },
                  ].map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDifficulty(d.value)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${
                        difficulty === d.value
                          ? 'border-black bg-black text-white'
                          : 'border-border bg-card text-text-secondary hover:border-black'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-[#FFF0F0] border border-[#C62828]/30 text-[#C62828] text-xs animate-fade-in">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-black text-white font-semibold text-sm hover:bg-[#1F1F1F] transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Generating Quiz...
                  </span>
                ) : (
                  'Generate Quiz'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Quiz */}
        {step === 'quiz' && questions[currentQ] && (
          <div>
            <QuizCard
              question={questions[currentQ].question}
              options={questions[currentQ].options}
              correctAnswer={questions[currentQ].correct}
              onAnswer={handleAnswer}
              showResult={showResult}
              questionNumber={currentQ + 1}
              totalQuestions={questions.length}
            />

            {/* Explanation */}
            {showResult && questions[currentQ].explanation && (
              <div className="mt-4 p-4 rounded-xl bg-surface border border-border animate-fade-in-up">
                <h4 className="section-label mb-1.5">Explanation</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{questions[currentQ].explanation}</p>
              </div>
            )}

            {/* Next button */}
            {showResult && (
              <button
                onClick={handleNext}
                className="w-full mt-4 py-3 rounded-xl bg-black text-white font-semibold text-sm hover:bg-[#1F1F1F] transition-all duration-200 animate-fade-in cursor-pointer"
              >
                {currentQ < questions.length - 1 ? 'Next Question →' : 'See Results'}
              </button>
            )}
          </div>
        )}

        {/* Step 3: Results */}
        {step === 'result' && (
          <div className="animate-scale-in">
            <ScoreCard
              score={score}
              total={questions.length}
              xpEarned={score * 10}
              message={getPerformanceMessage()}
            />

            <div className="flex gap-3 mt-8 justify-center">
              <button
                onClick={() => { setStep('setup'); setTopic(''); }}
                className="px-6 py-3 rounded-xl border border-black text-text-primary text-sm font-medium hover:bg-black hover:text-white transition-all cursor-pointer"
              >
                New Quiz
              </button>
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-[#1F1F1F] transition-all cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
