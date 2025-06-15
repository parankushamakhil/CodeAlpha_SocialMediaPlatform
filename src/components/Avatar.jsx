import { forwardRef } from 'react';

const sizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-14 w-14 text-xl',
  '2xl': 'h-16 w-16 text-2xl',
};

const statusStyles = {
  online: 'bg-green-500',
  offline: 'bg-gray-300 dark:bg-gray-600',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
};

export const Avatar = forwardRef(
  (
    {
      src,
      alt,
      size = 'md',
      status,
      className = '',
      fallback,
      ...props
    },
    ref
  ) => {
    const getFallbackInitials = (name) => {
      if (!name) return '';
      const names = name.split(' ');
      if (names.length === 1) return names[0].charAt(0).toUpperCase();
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    };

    return (
      <div className="relative inline-block" ref={ref} {...props}>
        {src ? (
          <img
            src={src}
            alt={alt}
            className={`rounded-full object-cover ${sizes[size]} ${className}`}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`${!src ? 'flex' : 'hidden'} ${sizes[size]} ${className} items-center justify-center rounded-full bg-primary-100 font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300`}
          aria-hidden="true"
        >
          {getFallbackInitials(fallback || alt)}
        </div>
        {status && (
          <span
            className={`absolute right-0 top-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-800 ${statusStyles[status]}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';