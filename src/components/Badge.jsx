import { forwardRef } from 'react';

const variants = {
  primary: 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
  secondary: 'bg-secondary-50 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-300',
  success: 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300',
  danger: 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300',
  warning: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  gray: 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base',
};

export const Badge = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className = '',
      dot,
      removable,
      onRemove,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1 rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {dot && (
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              variant === 'gray'
                ? 'bg-gray-400 dark:bg-gray-500'
                : `bg-${variant}-400 dark:bg-${variant}-500`
            }`}
          />
        )}
        {children}
        {removable && (
          <button
            type="button"
            className={`-mr-0.5 ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-${variant}-100 dark:hover:bg-${variant}-800`}
            onClick={onRemove}
          >
            <span className="sr-only">Remove</span>
            <svg
              className="h-3 w-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';