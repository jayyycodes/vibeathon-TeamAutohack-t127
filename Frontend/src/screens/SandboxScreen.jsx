import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { sandboxAnalysis } from '../services/api';

const ALGORITHMS = ['KNN', 'Linear Regression', 'Decision Tree'];

export default function SandboxScreen() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [algorithm, setAlgorithm] = useState('KNN');
  const [points, setPoints] = useState([]);
  const [narration, setNarration] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const classA = points.filter((p) => p.cls === 'A');
  const classB = points.filter((p) => p.cls === 'B');

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Clear — dark canvas
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(200, 255, 0, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw points
    points.forEach((p) => {
      const isA = p.cls === 'A';

      // Point
      ctx.fillStyle = isA ? '#0D0D0D' : '#C8FF00';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = isA ? '#5C5750' : '#A8D800';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.stroke();
    });
  }, [points]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Resize canvas for responsive
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeObserver = new ResizeObserver(() => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = Math.min(rect.width, 600);
      canvas.height = 400;
      drawCanvas();
    });
    resizeObserver.observe(canvas.parentElement);
    return () => resizeObserver.disconnect();
  }, [drawCanvas]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * canvas.height);
    const cls = e.button === 2 || e.ctrlKey || e.metaKey ? 'B' : 'A';
    setPoints((prev) => [...prev, { x, y, cls }]);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    handleCanvasClick({ ...e, button: 2 });
  };

  const handleClear = () => {
    setPoints([]);
    setNarration('');
    setError('');
  };

  const handleAnalyze = async () => {
    if (points.length < 2) {
      setError('Add at least 2 data points to analyze.');
      return;
    }
    setError('');
    setLoading(true);
    setNarration('');
    try {
      const datapoints = points.map((p) => [p.x, p.y]);
      const data = await sandboxAnalysis(
        algorithm,
        datapoints,
        `I have ${classA.length} Class A points and ${classB.length} Class B points. Explain how ${algorithm} would classify this data.`
      );
      setNarration(data.narration);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
          <button
            onClick={() => navigate('/home')}
            className="p-1.5 rounded-lg hover:bg-surface transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="heading-display text-2xl">ML Sandbox</h1>
            <p className="text-xs text-text-muted">Click to place data points, then analyze with AI</p>
          </div>
        </div>

        {/* Algorithm tabs */}
        <div className="flex gap-2 mb-4 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          {ALGORITHMS.map((alg) => (
            <button
              key={alg}
              onClick={() => setAlgorithm(alg)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                algorithm === alg
                  ? 'bg-black text-white'
                  : 'bg-card border border-border text-text-secondary hover:border-black'
              }`}
            >
              {alg}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div className="relative rounded-xl overflow-hidden border border-border animate-fade-in-up" style={{ animationDelay: '160ms' }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            onClick={handleCanvasClick}
            onContextMenu={handleContextMenu}
            className="w-full cursor-crosshair block"
            style={{ maxWidth: '600px', margin: '0 auto' }}
          />

          {/* Instructions overlay */}
          {points.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-[#9C9690] text-sm">Left click → Class A (black)</p>
                <p className="text-[#9C9690] text-sm mt-1">Right click → Class B (lime)</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between mt-4 gap-3 animate-fade-in-up" style={{ animationDelay: '240ms' }}>
          {/* Point counter */}
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-black" />
              <span className="text-text-secondary">Class A: <span className="text-text-primary font-semibold">{classA.length}</span></span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-text-secondary">Class B: <span className="text-text-primary font-semibold">{classB.length}</span></span>
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-xl border border-border text-text-secondary text-sm hover:border-black hover:text-text-primary transition-all cursor-pointer"
            >
              Clear Canvas
            </button>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-[#1F1F1F] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>Analyze</>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-[#FFF0F0] border border-[#C62828]/30 text-[#C62828] text-xs animate-fade-in">
            {error}
          </div>
        )}

        {/* Narration */}
        {narration && (
          <div className="mt-4 p-5 rounded-xl bg-surface border-l-2 border-accent animate-fade-in-up">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">G</span>
              </div>
              <h3 className="text-sm font-semibold text-text-primary">AI Analysis</h3>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{narration}</p>
          </div>
        )}
      </main>
    </div>
  );
}
