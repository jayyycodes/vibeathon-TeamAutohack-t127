import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-bg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 group">
            <span className="text-xl font-display font-extrabold text-text-primary tracking-tight">
              AIML Quest
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-sm text-text-secondary hover:text-text-primary hover:underline underline-offset-4 transition-colors duration-200 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              My Progress
            </Link>

            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold uppercase">
                  {username?.charAt(0) || '?'}
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {username}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs px-3 py-1.5 rounded-lg border border-border text-text-secondary hover:bg-black hover:text-white hover:border-black transition-all duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border animate-fade-in">
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold uppercase">
                {username?.charAt(0) || '?'}
              </div>
              <span className="text-sm font-medium">{username}</span>
            </div>
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-text-secondary hover:text-text-primary py-2 transition-colors"
            >
              My Progress
            </Link>
            <Link
              to="/home"
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-text-secondary hover:text-text-primary py-2 transition-colors"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left text-sm text-text-secondary hover:text-text-primary py-2 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
