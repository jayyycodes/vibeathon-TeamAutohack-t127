import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getProgress } from '../services/api';

const features = [
  {
    title: 'Learn',
    description: 'Master ML concepts with AI-powered tutoring and structured modules',
    icon: '📚',
    path: '/learn',
  },
  {
    title: 'Quiz',
    description: 'Test your knowledge with adaptive AI-generated quizzes',
    icon: '🧠',
    path: '/quiz',
  },
  {
    title: 'Code Lab',
    description: 'Write and run ML code in-browser with Pyodide & AI review',
    icon: '💻',
    path: '/codelab',
  },
  {
    title: 'ML Sandbox',
    description: 'Visualize algorithms with interactive data point canvas',
    icon: '🎮',
    path: '/sandbox',
  },
  {
    title: 'Spam Simulator',
    description: 'Test AI-powered spam detection on real-world emails',
    icon: '🛡️',
    path: '/simulate',
  },
  {
    title: 'Leaderboard',
    description: 'Compete with fellow learners and climb the rankings',
    icon: '🏆',
    path: '/leaderboard',
  },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const { username } = useAuth();
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getProgress(username);
        setTotalScore(data.total_score || 0);
      } catch {
        setTotalScore(0);
      }
    };
    if (username) fetchProgress();
  }, [username]);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome section */}
        <div className="mb-12 animate-fade-in-up">
          <p className="section-label mb-3">Dashboard</p>
          <h1 className="heading-display text-4xl sm:text-5xl mb-3">
            Welcome back, {username}
          </h1>
          <p className="text-text-secondary text-base">Choose your next quest and level up your ML skills</p>
        </div>

        {/* Score Badge */}
        <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-border">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <p className="section-label">Total Score</p>
              <p className="text-xl font-display font-extrabold text-text-primary">{totalScore} XP</p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {features.map((feature, index) => (
            <button
              key={feature.title}
              onClick={() => navigate(feature.path)}
              className="group text-left p-6 rounded-2xl bg-card border border-border hover:border-black transition-all duration-200 animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${(index + 2) * 80}ms` }}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-1.5">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-all duration-200">
                Enter
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
