export default function ChatBubble({ message, isUser }) {
  if (isUser) {
    return (
      <div className="flex justify-end animate-slide-in-right">
        <div className="max-w-[80%] sm:max-w-[70%]">
          <div className="bg-black text-white px-4 py-3 rounded-2xl rounded-br-md">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          </div>
          <p className="text-[10px] text-text-muted text-right mt-1 mr-1">You</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start animate-slide-in-left">
      <div className="max-w-[80%] sm:max-w-[70%]">
        <div className="flex gap-3">
          {/* AI avatar */}
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-black flex items-center justify-center mt-1">
            <span className="text-xs text-white font-bold">G</span>
          </div>

          <div className="flex-1">
            <div className="bg-surface border-l-2 border-accent px-4 py-3 rounded-2xl rounded-tl-md">
              <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{message}</p>
            </div>
            <p className="text-[10px] text-text-muted mt-1 ml-1">Grok AI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
