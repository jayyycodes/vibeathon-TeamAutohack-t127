import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getLeaderboard } from '../services/api';

export default function LeaderboardScreen() {
  const navigate = useNavigate();
  const { username } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const data = await getLeaderboard();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getBorderStyle = (rank) => {
    if (rank === 1) return 'border-l-[3px] border-l-accent';
    if (rank <= 3) return 'border-l-[3px] border-l-border';
    return '';
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          <h1 className="heading-display text-3xl sm:text-4xl mb-2">Leaderboard</h1>
          <p className="text-text-secondary text-sm">Top learners ranked by XP score · Auto-refreshes every 30s</p>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading leaderboard..." />
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-danger text-sm mb-4">{error}</p>
            <button onClick={() => { setLoading(true); fetchData(); }} className="px-4 py-2 rounded-lg bg-black text-white text-sm cursor-pointer">Retry</button>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <table className="w-full">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="px-4 py-3 text-left section-label">Rank</th>
                  <th className="px-4 py-3 text-left section-label">Player</th>
                  <th className="px-4 py-3 text-right section-label">Score</th>
                  <th className="px-4 py-3 text-right section-label hidden sm:table-cell">Modules</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, idx) => (
                  <tr
                    key={user.username}
                    className={`border-b border-border/50 transition-colors ${
                      user.username === username
                        ? 'bg-accent/10 border-l-[3px] border-l-accent'
                        : `${idx % 2 === 0 ? 'bg-card' : 'bg-bg'} ${getBorderStyle(user.rank)} hover:bg-surface`
                    }`}
                  >
                    <td className="px-4 py-3.5 text-sm text-text-muted font-mono">
                      {user.rank === 1 ? '👑' : `#${user.rank}`}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-bold text-text-secondary">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className={`text-sm font-medium ${
                          user.username === username ? 'text-text-primary font-bold' : 'text-text-primary'
                        }`}>
                          {user.username}
                          {user.username === username && (
                            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-accent text-black font-bold">You</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right text-sm font-semibold text-text-primary font-display">{user.score} XP</td>
                    <td className="px-4 py-3.5 text-right text-sm text-text-muted hidden sm:table-cell">{user.modules_completed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
