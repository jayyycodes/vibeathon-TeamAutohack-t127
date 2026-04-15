import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin, register as apiRegister } from '../services/api';

export default function AuthScreen() {
  const [tab, setTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const fn = tab === 'login' ? apiLogin : apiRegister;
      const data = await fn(username.trim(), password);
      login(data.username || username.trim(), data.token);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-bg">
      {/* Left — Editorial hero */}
      <div className="hidden lg:flex lg:w-[55%] items-center justify-center px-16 py-20 border-r border-border">
        <div className="max-w-lg animate-fade-in-up">
          <p className="section-label mb-6">AI & ML Learning Platform</p>
          <h1 className="heading-display text-6xl xl:text-7xl leading-[1.05] mb-8">
            Learn AI.<br />Actually.
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed max-w-md">
            Master machine learning through interactive quizzes, hands-on code labs, and AI-powered Socratic tutoring.
          </p>
          <div className="flex items-center gap-8 mt-14 pt-8 border-t border-border">
            {[
              { icon: '🧠', label: 'AI Tutor' },
              { icon: '⚡', label: 'Quizzes' },
              { icon: '🎮', label: 'Sandbox' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2.5">
                <span className="text-2xl">{f.icon}</span>
                <span className="text-sm text-text-secondary font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Auth form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0 bg-white lg:bg-card">
        <div className="w-full max-w-sm animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <h1 className="heading-display text-4xl mb-2">AIML Quest</h1>
            <p className="text-text-secondary text-sm">Master Machine Learning Through Play</p>
          </div>

          {/* Desktop title */}
          <div className="hidden lg:block mb-8">
            <h2 className="heading-display text-2xl mb-1">Welcome back</h2>
            <p className="text-text-secondary text-sm">Sign in to continue your quest</p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl bg-surface p-1 mb-8">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                tab === 'login'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setTab('register'); setError(''); }}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                tab === 'register'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="auth-username" className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">
                Username
              </label>
              <input
                id="auth-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="input-field"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input-field"
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-[#FFF0F0] border border-[#C62828]/20 text-[#C62828] text-sm animate-fade-in">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  {tab === 'login' ? 'Logging in...' : 'Creating account...'}
                </span>
              ) : (
                tab === 'login' ? 'Enter the Quest' : 'Begin Your Journey'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-text-muted mt-6">
            {tab === 'login'
              ? "Don't have an account? Switch to Register"
              : 'Already have an account? Switch to Login'}
          </p>
        </div>
      </div>
    </div>
  );
}
