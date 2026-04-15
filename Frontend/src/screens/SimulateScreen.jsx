import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { runSpamSimulation } from '../services/api';

const PRESETS = [
  {
    label: '🎣 Phishing Email',
    text: `Subject: URGENT - Your Account Has Been Compromised!\n\nDear Valued Customer,\n\nWe have detected unusual activity on your account. Your account will be suspended within 24 hours unless you verify your identity immediately.\n\nClick here to verify: http://totally-not-suspicious-link.com/verify\n\nPlease provide your Social Security Number, bank account details, and password to confirm your identity.\n\nAct NOW or lose access forever!\n\n- Security Team`,
  },
  {
    label: '✉️ Normal Email',
    text: `Subject: Meeting Tomorrow at 3 PM\n\nHi Team,\n\nJust a reminder that we have our weekly standup meeting tomorrow at 3 PM in Conference Room B.\n\nPlease come prepared with your progress updates for the sprint.\n\nBest regards,\nSarah`,
  },
  {
    label: '🔥 Promo Spam',
    text: `Subject: MEGA SALE - 80% OFF Everything!!!\n\nCONGRATULATIONS! You've been SELECTED for our EXCLUSIVE deal!\n\nBUY NOW and save up to 80% on EVERYTHING!\n\nFREE iPhone 15 Pro with every purchase over $50!\nUNLIMITED cashback rewards!\n\nCLICK HERE NOW >>> www.amazing-deals-not-scam.com`,
  },
];

export default function SimulateScreen() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim()) { setError('Please enter some text to analyze.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const data = await runSpamSimulation(text.trim());
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confidence = result ? Math.round((result.confidence || 0) * 100) : 0;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <button onClick={() => navigate('/home')} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6 cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </button>

        <h1 className="heading-display text-3xl mb-1">Spam Detector</h1>
        <p className="text-text-secondary text-sm mb-6">Enter any text or email — let AI analyze it for spam</p>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => { setText(preset.text); setResult(null); setError(''); }}
              className="px-4 py-2 rounded-lg bg-white border-[1.5px] border-border text-xs font-medium text-text-secondary hover:border-black hover:text-text-primary transition-all cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste an email or any text content here..."
          rows={7}
          className="input-field resize-none mb-4"
          style={{ minHeight: 160 }}
        />

        <button onClick={handleAnalyze} disabled={loading} className="btn-primary">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Analyzing...
            </span>
          ) : 'Analyze Text'}
        </button>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-[#FFF0F0] border border-[#C62828]/20 text-[#C62828] text-sm animate-fade-in">{error}</div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 space-y-4 animate-scale-in">
            <div className={`card ${result.is_spam ? 'border-[#C62828]/30 bg-[#FFFAFA]' : 'border-[#2E7D32]/30 bg-[#FAFFFA]'}`}>
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${result.is_spam ? 'bg-[#C62828]/10' : 'bg-[#2E7D32]/10'}`}>
                  {result.is_spam ? '🚨' : '✅'}
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${result.is_spam ? 'text-[#C62828]' : 'text-[#2E7D32]'}`}>
                    {result.is_spam ? 'SPAM DETECTED' : 'NOT SPAM'}
                  </h3>
                  <p className="text-xs text-text-muted">AI Classification Result</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="section-label">Confidence</span>
                  <span className={`text-sm font-bold ${result.is_spam ? 'text-[#C62828]' : 'text-[#2E7D32]'}`}>{confidence}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface overflow-hidden">
                  <div className={`h-3 rounded-full transition-all duration-1000 ease-out ${result.is_spam ? 'bg-[#C62828]' : 'bg-[#2E7D32]'}`} style={{ width: `${confidence}%` }} />
                </div>
              </div>
            </div>

            {result.reason && (
              <div className="card border-l-[3px] border-l-accent">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">G</span>
                  </div>
                  <h4 className="text-sm font-semibold text-text-primary">AI Reasoning</h4>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{result.reason}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
