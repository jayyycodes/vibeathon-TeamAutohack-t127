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
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center px-16 py-20">
        <div className="max-w-lg animate-fade-in-up">
          <p className="section-label mb-6">AI & ML Learning Platform</p>
          <h1 className="heading-display text-6xl xl:text-7xl leading-[1.05] mb-8">
            Learn AI.<br />Actually.
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed max-w-md">
            Master machine learning through interactive quizzes, hands-on code labs, and AI-powered Socratic tutoring.
          </p>
          <div className="flex items-center gap-6 mt-12">
            {[
              { icon: '🧠', label: 'AI Tutor' },
              { icon: '⚡', label: 'Quizzes' },
              { icon: '🎮', label: 'Sandbox' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2">
                <span className="text-xl">{f.icon}</span>
                <span className="text-sm text-text-muted font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Auth form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 lg:py-0">
        <div className="w-full max-w-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="heading-display text-4xl mb-2">AIML Quest</h1>
            <p className="text-text-secondary text-sm">Master Machine Learning Through Play</p>
          </div>

          {/* Card */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            {/* Tabs */}
            <div className="flex rounded-xl bg-surface p-1 mb-6">
              <button
                onClick={() => { setTab('login'); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  tab === 'login'
                    ? 'bg-black text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => { setTab('register'); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  tab === 'register'
                    ? 'bg-black text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Register
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="auth-username" className="section-label block mb-1.5">
                  Username
                </label>
                <input
                  id="auth-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10 transition-all duration-200"
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="auth-password" className="section-label block mb-1.5">
                  Password
                </label>
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10 transition-all duration-200"
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-[#FFF0F0] border border-[#C62828]/30 text-[#C62828] text-xs animate-fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-black text-white font-semibold text-sm hover:bg-[#1F1F1F] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
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

            {/* Footer notice */}
            <p className="text-center text-[11px] text-text-muted mt-4">
              {tab === 'login'
                ? "Don't have an account? Switch to Register"
                : 'Already have an account? Switch to Login'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
