export function LoadingSpinner({ className = '', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-current border-t-transparent text-primary-600 dark:text-primary-400 ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner size="xl" />
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <LoadingSpinner size="xl" />
    </div>
  );
}