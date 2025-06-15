export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCircle({ size = 12, className = '' }) {
  return <Skeleton className={`h-${size} w-${size} rounded-full ${className}`} />;
}

export function SkeletonButton({ className = '' }) {
  return <Skeleton className={`h-10 w-20 ${className}`} />;
}

export function SkeletonImage({ className = '' }) {
  return <Skeleton className={`h-48 w-full ${className}`} />;
}

export function SkeletonCard({ className = '' }) {
  return (
    <div
      className={`space-y-5 rounded-xl border border-gray-200 p-4 dark:border-gray-700 ${className}`}
    >
      <div className="flex items-center space-x-4">
        <SkeletonCircle size={12} />
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <SkeletonText lines={2} />
      <SkeletonImage />
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCircle key={i} size={8} className="ring-2 ring-white dark:ring-gray-900" />
          ))}
        </div>
        <SkeletonButton />
      </div>
    </div>
  );
}