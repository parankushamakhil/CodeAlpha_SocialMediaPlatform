import { Avatar } from './Avatar';

export function StoryCircle({
  story,
  onClick,
  size = 'md',
  showStatus = true,
  isCreate = false,
}) {
  const sizeClasses = {
    sm: 'h-14 w-14',
    md: 'h-16 w-16',
    lg: 'h-20 w-20',
  };

  const ringClasses = story?.isViewed
    ? 'ring-gray-300 dark:ring-gray-600'
    : 'ring-gradient-to-tr from-primary-500 to-secondary-500';

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-1 focus:outline-none"
    >
      <div
        className={`relative rounded-full ${sizeClasses[size]} ${!isCreate && 'p-1 ring-2'} ${ringClasses}`}
      >
        <Avatar
          src={story?.user.avatar}
          alt={story?.user.name || 'Create Story'}
          fallback={story?.user.name}
          size={size}
          className={isCreate ? 'ring-2 ring-gray-200 dark:ring-gray-700' : ''}
        />
        {isCreate && (
          <div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 ring-4 ring-white dark:ring-gray-900">
            <span className="text-lg font-semibold leading-none text-white">+</span>
          </div>
        )}
        {showStatus && story?.isLive && (
          <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900" />
        )}
      </div>
      <span className="max-w-[76px] truncate text-xs text-gray-700 dark:text-gray-300">
        {isCreate ? 'Create Story' : story?.user.name}
      </span>
    </button>
  );
}