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

    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(200, 255, 0, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    points.forEach((p) => {
      ctx.fillStyle = p.cls === 'A' ? '#F5F2ED' : '#C8FF00';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = p.cls === 'A' ? '#9C9690' : '#A8D800';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.stroke();
    });
  }, [points]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      const w = Math.min(canvas.parentElement.getBoundingClientRect().width, 600);
      canvas.width = w;
      canvas.height = 380;
      drawCanvas();
    });
    ro.observe(canvas.parentElement);
    return () => ro.disconnect();
  }, [drawCanvas]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * canvas.height);
    const cls = e.button === 2 || e.ctrlKey || e.metaKey ? 'B' : 'A';
    setPoints((prev) => [...prev, { x, y, cls }]);
  };

  const handleContextMenu = (e) => { e.preventDefault(); handleCanvasClick({ ...e, button: 2 }); };
  const handleClear = () => { setPoints([]); setNarration(''); setError(''); };

  const handleAnalyze = async () => {
    if (points.length < 2) { setError('Add at least 2 data points.'); return; }
    setError('');
    setLoading(true);
    setNarration('');
    try {
      const data = await sandboxAnalysis(algorithm, points.map((p) => [p.x, p.y]),
        `I have ${classA.length} Class A and ${classB.length} Class B points. Explain how ${algorithm} would classify this data.`);
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
      <main className="max-w-3xl mx-auto px-6 py-6">
        <div className="flex items-center gap-3 mb-5 animate-fade-in-up">
          <button onClick={() => navigate('/home')} className="p-1.5 rounded-lg hover:bg-surface transition-colors cursor-pointer">
            <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="heading-display text-2xl">ML Sandbox</h1>
            <p className="text-xs text-text-muted">Click canvas to place points, then analyze</p>
          </div>
        </div>

        {/* Algo tabs */}
        <div className="flex gap-2 mb-4">
          {ALGORITHMS.map((alg) => (
            <button
              key={alg}
              onClick={() => setAlgorithm(alg)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                algorithm === alg ? 'bg-black text-white' : 'bg-white border-[1.5px] border-border text-text-secondary hover:border-black'
              }`}
            >
              {alg}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div className="relative rounded-xl overflow-hidden border-[1.5px] border-border">
          <canvas
            ref={canvasRef}
            width={600}
            height={380}
            onClick={handleCanvasClick}
            onContextMenu={handleContextMenu}
            className="w-full cursor-crosshair block"
            style={{ maxWidth: '600px', margin: '0 auto' }}
          />
          {points.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-[#1A1A1A]/80">
              <div className="text-center">
                <p className="text-[#9C9690] text-sm font-medium">Left click → Class A (white)</p>
                <p className="text-[#9C9690] text-sm mt-1">Right click → Class B (lime)</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
          <div className="flex items-center gap-5 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-surface border border-border" />
              <span className="text-text-secondary">Class A: <span className="font-bold text-text-primary">{classA.length}</span></span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-text-secondary">Class B: <span className="font-bold text-text-primary">{classB.length}</span></span>
            </span>
          </div>
          <div className="flex gap-3">
            <button onClick={handleClear} className="btn-secondary py-2 px-4 text-sm">Clear</button>
            <button onClick={handleAnalyze} disabled={loading} className="btn-primary w-auto py-2 px-6 flex items-center gap-2">
              {loading ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Analyzing...</> : 'Analyze'}
            </button>
          </div>
        </div>

        {error && <div className="mt-4 p-3 rounded-lg bg-[#FFF0F0] border border-[#C62828]/20 text-[#C62828] text-sm animate-fade-in">{error}</div>}

        {narration && (
          <div className="card mt-4 border-l-[3px] border-l-accent animate-fade-in-up">
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
