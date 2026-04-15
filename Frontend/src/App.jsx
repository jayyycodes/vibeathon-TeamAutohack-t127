import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import LearnScreen from './screens/LearnScreen';
import TutorScreen from './screens/TutorScreen';
import QuizScreen from './screens/QuizScreen';
import CodeLabScreen from './screens/CodeLabScreen';
import SandboxScreen from './screens/SandboxScreen';
import SimulateScreen from './screens/SimulateScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import DashboardScreen from './screens/DashboardScreen';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-border border-t-black animate-spin mb-4" />
          <p className="text-text-muted text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <div className="page-enter">{children}</div>;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoute><AuthScreen /></PublicRoute>} />
        <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute><LearnScreen /></ProtectedRoute>} />
        <Route path="/tutor" element={<ProtectedRoute><TutorScreen /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><QuizScreen /></ProtectedRoute>} />
        <Route path="/codelab" element={<ProtectedRoute><CodeLabScreen /></ProtectedRoute>} />
        <Route path="/sandbox" element={<ProtectedRoute><SandboxScreen /></ProtectedRoute>} />
        <Route path="/simulate" element={<ProtectedRoute><SimulateScreen /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardScreen /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
