import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { runSpamSimulation } from '../services/api';

const PRESETS = [
  {
    label: 'Phishing Email',
    text: `Subject: URGENT - Your Account Has Been Compromised!

Dear Valued Customer,

We have detected unusual activity on your account. Your account will be suspended within 24 hours unless you verify your identity immediately.

Click here to verify: http://totally-not-suspicious-link.com/verify

Please provide your Social Security Number, bank account details, and password to confirm your identity.

Act NOW or lose access forever!

- Security Team`,
  },
  {
    label: 'Normal Email',
    text: `Subject: Meeting Tomorrow at 3 PM

Hi Team,

Just a reminder that we have our weekly standup meeting tomorrow at 3 PM in Conference Room B.

Please come prepared with your progress updates for the sprint. If you have any blockers, let's discuss them during the meeting.

See you there!

Best regards,
Sarah`,
  },
  {
    label: 'Promo Email',
    text: `Subject: 🔥 MEGA SALE - 80% OFF Everything!!!

CONGRATULATIONS! You've been SELECTED for our EXCLUSIVE deal!

BUY NOW and save up to 80% on EVERYTHING in our store! This offer expires in 2 HOURS!

🎁 FREE iPhone 15 Pro with every purchase over $50!
💰 UNLIMITED cashback rewards!
🏆 You are our 1,000,000th visitor!

CLICK HERE NOW >>> www.amazing-deals-not-scam.com

Unsubscribe? Why would you want to miss these AMAZING deals?!`,
  },
];

export default function SimulateScreen() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6 animate-fade-in-up">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          <h1 className="heading-display text-3xl mb-2">Spam Detector</h1>
          <p className="text-text-secondary text-sm">Enter any text or email content and let AI analyze it for spam</p>
        </div>

        {/* Preset buttons */}
        <div className="flex flex-wrap gap-2 mb-4 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => { setText(preset.text); setResult(null); setError(''); }}
              className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-medium text-text-secondary hover:border-black hover:text-text-primary transition-all cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <div className="animate-fade-in-up" style={{ animationDelay: '160ms' }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste an email or any text content here..."
            rows={8}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10 transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full mt-4 py-3.5 rounded-xl bg-black text-white font-semibold text-sm hover:bg-[#1F1F1F] transition-all duration-200 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Analyzing...
            </span>
          ) : (
            'Analyze Text'
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-[#FFF0F0] border border-[#C62828]/30 text-[#C62828] text-xs animate-fade-in">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 animate-scale-in">
            {/* Verdict card */}
            <div className={`p-6 rounded-2xl border ${
              result.is_spam
                ? 'bg-[#FFF0F0] border-[#C62828]/30'
                : 'bg-[#F0FFF0] border-[#2E7D32]/30'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  result.is_spam ? 'bg-[#C62828]/10' : 'bg-[#2E7D32]/10'
                }`}>
                  {result.is_spam ? '🚨' : '✅'}
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${result.is_spam ? 'text-[#C62828]' : 'text-[#2E7D32]'}`}>
                    {result.is_spam ? 'SPAM DETECTED' : 'NOT SPAM'}
                  </h3>
                  <p className="text-xs text-text-muted">AI Confidence</p>
                </div>
              </div>

              {/* Confidence bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="section-label">Confidence Level</span>
                  <span className={`text-sm font-bold ${result.is_spam ? 'text-[#C62828]' : 'text-[#2E7D32]'}`}>
                    {confidence}%
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                      result.is_spam ? 'bg-[#C62828]' : 'bg-[#2E7D32]'
                    }`}
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Reasoning */}
            {result.reason && (
              <div className="mt-4 p-5 rounded-xl bg-surface border-l-2 border-accent animate-fade-in-up" style={{ animationDelay: '200ms' }}>
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
