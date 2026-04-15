const difficultyConfig = {
  easy: { label: 'Beginner', color: 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]' },
  medium: { label: 'Intermediate', color: 'bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]' },
  hard: { label: 'Advanced', color: 'bg-[#FCE4EC] text-[#880E4F] border-[#F8BBD0]' },
};

export default function TopicCard({ title, description, difficulty, estimatedTime, onClick, index = 0 }) {
  const config = difficultyConfig[difficulty] || difficultyConfig.easy;

  return (
    <button
      onClick={onClick}
      className="w-full text-left group cursor-pointer"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="h-full p-5 rounded-xl bg-card border border-border hover:border-black transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-text-primary">
            {title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full border ${config.color} font-medium whitespace-nowrap ml-2`}>
            {config.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary mb-4 line-clamp-2">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {estimatedTime}
          </div>
          <div className="text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
            Start Learning
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}
