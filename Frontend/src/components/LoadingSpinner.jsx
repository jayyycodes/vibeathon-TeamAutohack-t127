export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`${sizeClasses[size]} rounded-full border-2 border-border border-t-black animate-spin-slow`}
      />
      {text && (
        <p className="text-sm text-text-secondary">{text}</p>
      )}
    </div>
  );
}
