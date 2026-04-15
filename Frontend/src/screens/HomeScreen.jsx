import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getProgress } from '../services/api';

const features = [
  { title: 'Learn', description: 'AI-powered tutoring with structured modules', icon: '📚', path: '/learn' },
  { title: 'Quiz', description: 'Test knowledge with adaptive AI quizzes', icon: '🧠', path: '/quiz' },
  { title: 'Code Lab', description: 'Write & run ML code in-browser', icon: '💻', path: '/codelab' },
  { title: 'ML Sandbox', description: 'Visualize algorithms interactively', icon: '🎮', path: '/sandbox' },
  { title: 'Spam Detector', description: 'AI-powered spam detection', icon: '🛡️', path: '/simulate' },
  { title: 'Leaderboard', description: 'Compete and climb the rankings', icon: '🏆', path: '/leaderboard' },
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

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 animate-fade-in-up">
          <div>
            <p className="section-label mb-2">Dashboard</p>
            <h1 className="heading-display text-3xl sm:text-4xl">
              Welcome back, {username}
            </h1>
          </div>
          <div className="card flex items-center gap-3 py-3 px-5 w-fit">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Score</p>
              <p className="text-lg font-display font-extrabold text-text-primary leading-tight">{totalScore} XP</p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <button
              key={feature.title}
              onClick={() => navigate(feature.path)}
              className="card card-hover group text-left transition-all duration-200 animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-base font-bold text-text-primary mb-1">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                Enter →
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
