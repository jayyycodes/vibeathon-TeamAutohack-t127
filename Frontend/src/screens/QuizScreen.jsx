import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import QuizCard from '../components/QuizCard';
import ScoreCard from '../components/ScoreCard';
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
    if (!topic.trim()) { setError('Please enter a topic'); return; }
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
      const xp = score * 10;
      try { await updateProgress(username, 99, xp); } catch {}
      setStep('result');
    }
  };

  const getPerformanceMessage = () => {
    const pct = (score / questions.length) * 100;
    if (pct === 100) return "Perfect Score!";
    if (pct >= 80) return "Excellent!";
    if (pct >= 60) return "Great job!";
    if (pct >= 40) return "Good effort!";
    return "Keep practicing!";
  };

  const quickTopics = ['Neural Networks', 'Linear Regression', 'Decision Trees', 'NLP', 'Computer Vision'];

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <button
          onClick={() => step === 'setup' ? navigate('/home') : setStep('setup')}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          {step === 'setup' ? 'Back to Home' : 'New Quiz'}
        </button>

        {/* Setup */}
        {step === 'setup' && (
          <div className="animate-fade-in-up">
            <h1 className="heading-display text-3xl mb-1">AI Quiz Generator</h1>
            <p className="text-text-secondary text-sm mb-8">Pick a topic and difficulty — AI generates 5 custom questions.</p>

            <div className="card space-y-6">
              <div>
                <label htmlFor="quiz-topic" className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">Topic</label>
                <input
                  id="quiz-topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Neural Networks, KNN, Transformers..."
                  className="input-field"
                />
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

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">Difficulty</label>
                <div className="flex gap-3">
                  {['easy', 'medium', 'hard'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-3 rounded-xl border-[1.5px] text-sm font-medium transition-all duration-200 cursor-pointer capitalize ${
                        difficulty === d
                          ? 'border-black bg-black text-white'
                          : 'border-border bg-white text-text-secondary hover:border-black'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-[#FFF0F0] border border-[#C62828]/20 text-[#C62828] text-sm animate-fade-in">
                  {error}
                </div>
              )}

              <button onClick={handleGenerate} disabled={loading} className="btn-primary">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Generating Quiz...
                  </span>
                ) : 'Generate Quiz'}
              </button>
            </div>
          </div>
        )}

        {/* Quiz */}
        {step === 'quiz' && questions[currentQ] && (
          <div className="card">
            <QuizCard
              question={questions[currentQ].question}
              options={questions[currentQ].options}
              correctAnswer={questions[currentQ].correct}
              onAnswer={handleAnswer}
              showResult={showResult}
              questionNumber={currentQ + 1}
              totalQuestions={questions.length}
            />
            {showResult && questions[currentQ].explanation && (
              <div className="mt-5 p-4 rounded-xl bg-surface border border-border animate-fade-in-up">
                <p className="section-label mb-1">Explanation</p>
                <p className="text-sm text-text-secondary leading-relaxed">{questions[currentQ].explanation}</p>
              </div>
            )}
            {showResult && (
              <button onClick={handleNext} className="btn-primary mt-5">
                {currentQ < questions.length - 1 ? 'Next Question →' : 'See Results'}
              </button>
            )}
          </div>
        )}

        {/* Results */}
        {step === 'result' && (
          <div className="card animate-scale-in">
            <ScoreCard score={score} total={questions.length} xpEarned={score * 10} message={getPerformanceMessage()} />
            <div className="flex gap-3 mt-6 justify-center">
              <button onClick={() => { setStep('setup'); setTopic(''); }} className="btn-secondary">New Quiz</button>
              <button onClick={() => navigate('/home')} className="btn-primary w-auto">Back to Home</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
