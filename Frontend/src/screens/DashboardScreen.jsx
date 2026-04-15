import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import BadgeCard from '../components/BadgeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getProgress } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BADGES = [
  { id: 'first_step', title: 'First Step', description: 'Completed 1 module', icon: '🎯', check: (p) => (p.completed_modules?.length || 0) >= 1 },
  { id: 'quiz_master', title: 'Quiz Master', description: 'Scored 5/5 on a quiz', icon: '🧠', check: (p) => p.quiz_scores?.some((q) => q.score >= 50) },
  { id: 'code_warrior', title: 'Code Warrior', description: 'Used Code Lab', icon: '⚔️', check: (p) => p.achievements?.includes('code_warrior') || localStorage.getItem('aiml_used_codelab') === 'true' },
  { id: 'explorer', title: 'Explorer', description: 'Used ML Sandbox', icon: '🗺️', check: (p) => p.achievements?.includes('explorer') || localStorage.getItem('aiml_used_sandbox') === 'true' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card py-2 px-3">
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-sm font-semibold text-text-primary">{payload[0].value} XP</p>
      </div>
    );
  }
  return null;
};

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { username } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getProgress(username);
        setProgress(data);
      } catch {
        setProgress({ username, total_score: 0, completed_modules: [], quiz_scores: [], achievements: [] });
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchProgress();
  }, [username]);

  const totalModules = 7;
  const completedCount = progress?.completed_modules?.length || 0;
  const progressPct = Math.round((completedCount / totalModules) * 100);
  const chartData = (progress?.quiz_scores || []).slice(-10).map((q, idx) => ({ name: `Q${idx + 1}`, score: q.score || 0 }));
  if (chartData.length === 0) chartData.push({ name: 'No data', score: 0 });

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <button onClick={() => navigate('/home')} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6 cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </button>

        <h1 className="heading-display text-3xl mb-1">My Progress</h1>
        <p className="text-text-secondary text-sm mb-8">Track your learning journey and achievements</p>

        {loading ? (
          <LoadingSpinner text="Loading your progress..." />
        ) : (
          <div className="space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up">
              <div className="card text-center border-t-[3px] border-t-accent">
                <p className="section-label mb-2">Total XP</p>
                <p className="text-4xl font-display font-extrabold text-text-primary">{progress?.total_score || 0}</p>
              </div>

              <div className="card">
                <p className="section-label mb-3">Modules</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-text-primary font-display">{completedCount}<span className="text-text-muted text-sm font-normal">/{totalModules}</span></span>
                  <span className="text-sm font-semibold text-text-primary">{progressPct}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-surface overflow-hidden">
                  <div className="h-2.5 rounded-full bg-accent transition-all duration-1000" style={{ width: `${progressPct}%` }} />
                </div>
              </div>

              <div className="card text-center">
                <p className="section-label mb-2">Badges</p>
                <p className="text-4xl font-display font-extrabold text-text-primary">{progress ? BADGES.filter((b) => b.check(progress)).length : 0}</p>
                <p className="text-xs text-text-muted mt-1">of {BADGES.length} total</p>
              </div>
            </div>

            {/* Chart */}
            <div className="card animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <p className="section-label mb-4">Quiz Score History</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D5D0C8" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9C9690' }} axisLine={{ stroke: '#D5D0C8' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#9C9690' }} axisLine={{ stroke: '#D5D0C8' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="score" fill="#C8FF00" radius={[4, 4, 0, 0]} maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Badges */}
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <p className="section-label mb-3">Achievement Badges</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {BADGES.map((badge) => (
                  <BadgeCard key={badge.id} title={badge.title} description={badge.description} icon={badge.icon} earned={progress ? badge.check(progress) : false} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
