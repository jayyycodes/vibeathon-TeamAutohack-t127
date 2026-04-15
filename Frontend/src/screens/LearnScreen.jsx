import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TopicCard from '../components/TopicCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getModules } from '../services/api';

export default function LearnScreen() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await getModules();
        setModules(data.modules || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  const groupByDifficulty = (mods) => {
    return {
      easy: mods.filter((m) => m.difficulty === 'easy'),
      medium: mods.filter((m) => m.difficulty === 'medium'),
      hard: mods.filter((m) => m.difficulty === 'hard'),
    };
  };

  const grouped = groupByDifficulty(modules);

  const sections = [
    { key: 'easy', title: 'Beginner', subtitle: 'Start your ML journey', modules: grouped.easy },
    { key: 'medium', title: 'Intermediate', subtitle: 'Deepen your understanding', modules: grouped.medium },
    { key: 'hard', title: 'Advanced', subtitle: 'Challenge yourself', modules: grouped.hard },
  ];

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <h1 className="heading-display text-3xl sm:text-4xl mb-2">Learning Modules</h1>
          <p className="text-text-secondary text-sm">Choose a topic and learn with your AI tutor</p>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner text="Loading modules..." />
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-danger text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-[#1F1F1F] transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.key} className="animate-fade-in-up">
                <div className="mb-4">
                  <h2 className="text-xl font-display font-bold text-text-primary">{section.title}</h2>
                  <p className="section-label mt-0.5">{section.subtitle}</p>
                </div>

                {section.modules.length === 0 ? (
                  <p className="text-sm text-text-muted py-4">No modules in this level yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.modules.map((mod, idx) => (
                      <TopicCard
                        key={mod.id}
                        title={mod.title}
                        description={mod.description}
                        difficulty={mod.difficulty}
                        estimatedTime={mod.estimated_time}
                        index={idx}
                        onClick={() => navigate(`/tutor?topic=${encodeURIComponent(mod.title)}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skeleton fallback */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-36 rounded-xl" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
