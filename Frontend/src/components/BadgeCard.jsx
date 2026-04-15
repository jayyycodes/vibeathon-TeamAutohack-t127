export default function BadgeCard({ title, description, icon, earned }) {
  return (
    <div
      className={`p-4 rounded-xl border text-center transition-all duration-200 ${
        earned
          ? 'bg-card border-accent hover:border-black'
          : 'bg-surface border-border opacity-50 grayscale'
      }`}
    >
      {/* Icon */}
      <div className="text-4xl mb-3">
        {icon}
      </div>

      {/* Title */}
      <h4 className={`text-sm font-bold mb-1 ${earned ? 'text-text-primary' : 'text-text-muted'}`}>
        {title}
      </h4>

      {/* Description */}
      <p className="text-xs text-text-muted">{description}</p>

      {/* Status */}
      <div className="mt-3">
        {earned ? (
          <span className="inline-flex items-center gap-1 text-xs text-[#2E7D32] font-medium">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Unlocked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-text-muted">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Locked
          </span>
        )}
      </div>
    </div>
  );
}
