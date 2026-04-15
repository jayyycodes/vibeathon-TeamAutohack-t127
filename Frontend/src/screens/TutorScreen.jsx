import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ChatBubble from '../components/ChatBubble';
import { getTutorResponse, updateProgress } from '../services/api';

export default function TutorScreen() {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic') || 'Machine Learning';
  const { username } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  useEffect(() => {
    const sendInitial = async () => {
      const question = `Explain ${topic} to me`;
      setMessages([{ text: question, isUser: true }]);
      setLoading(true);
      try {
        const data = await getTutorResponse(topic, question);
        setMessages((prev) => [...prev, { text: data.response, isUser: false }]);
      } catch {
        setMessages((prev) => [...prev, { text: `I'd love to explain ${topic}, but I'm having trouble connecting. Please try again!`, isUser: false }]);
      } finally {
        setLoading(false);
      }
    };
    sendInitial();
  }, [topic]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { text: question, isUser: true }]);
    setLoading(true);
    try {
      const data = await getTutorResponse(topic, question);
      setMessages((prev) => [...prev, { text: data.response, isUser: false }]);
    } catch {
      setMessages((prev) => [...prev, { text: 'Sorry, I had trouble processing that. Please try again.', isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleMarkComplete = async () => {
    setCompleting(true);
    try { await updateProgress(username, topic.hashCode?.() || 1, 10); setCompleted(true); } catch { setCompleted(true); } finally { setCompleting(false); }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />

      {/* Topic banner */}
      <div className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/learn')} className="p-1.5 rounded-lg hover:bg-surface transition-colors cursor-pointer">
              <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">AI Tutor</h2>
              <p className="text-xs text-text-muted">{topic}</p>
            </div>
          </div>
          <button
            onClick={handleMarkComplete}
            disabled={completing || completed}
            className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              completed ? 'bg-[#F0FFF0] text-[#2E7D32] border border-[#2E7D32]/30' : 'bg-black text-white hover:bg-[#1F1F1F]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {completed ? '✓ Completed' : completing ? 'Saving...' : 'Mark Complete (+10 XP)'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} message={msg.text} isUser={msg.isUser} />
          ))}
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex gap-3 max-w-[70%]">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-black flex items-center justify-center">
                  <span className="text-xs text-white font-bold">G</span>
                </div>
                <div className="bg-surface border-l-2 border-accent px-4 py-3 rounded-2xl rounded-tl-md">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-border bg-white">
        <div className="max-w-3xl mx-auto px-6 py-3 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question..."
            className="input-field"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-black text-white font-medium text-sm hover:bg-[#1F1F1F] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
