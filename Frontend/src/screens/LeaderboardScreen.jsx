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

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <button onClick={() => navigate('/home')} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6 cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </button>

        <h1 className="heading-display text-3xl mb-1">Leaderboard</h1>
        <p className="text-text-secondary text-sm mb-8">Top learners ranked by XP · Auto-refreshes every 30s</p>

        {loading ? (
          <LoadingSpinner text="Loading leaderboard..." />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-danger text-sm mb-4">{error}</p>
            <button onClick={() => { setLoading(true); fetchData(); }} className="btn-primary w-auto px-6">Retry</button>
          </div>
        ) : (
          <div className="space-y-2 animate-fade-in-up">
            {leaderboard.map((user, idx) => {
              const isMe = user.username === username;
              return (
                <div
                  key={user.username}
                  className={`card py-4 flex items-center gap-4 transition-all ${
                    isMe ? 'border-accent bg-accent/5' : ''
                  } ${user.rank <= 3 ? 'border-l-[3px] border-l-accent' : ''}`}
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  {/* Rank */}
                  <div className="w-10 text-center text-base font-bold text-text-primary">
                    {getRankIcon(user.rank)}
                  </div>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-sm font-bold text-text-secondary">
                    {user.username.charAt(0).toUpperCase()}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isMe ? 'text-text-primary' : 'text-text-primary'}`}>
                      {user.username}
                      {isMe && (
                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-accent text-black font-bold align-middle">You</span>
                      )}
                    </p>
                    <p className="text-xs text-text-muted">{user.modules_completed || 0} modules</p>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p className="text-base font-display font-bold text-text-primary">{user.score}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">XP</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
