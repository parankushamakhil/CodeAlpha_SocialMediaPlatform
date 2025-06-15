import { forwardRef } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600',
  secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 dark:bg-secondary-500 dark:hover:bg-secondary-600',
  outline: 'border-2 border-gray-200 bg-transparent hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
  danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
};

const sizes = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-2 text-base',
  xl: 'px-6 py-3 text-base',
};

export const Button = forwardRef(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isDisabled = false,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:pointer-events-none disabled:opacity-50';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={isDisabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner
            size={size === 'xl' || size === 'lg' ? 'md' : 'sm'}
            className={children ? 'mr-2' : ''}
          />
        ) : (
          leftIcon && <span className={`mr-2 ${size === 'xs' ? 'text-xs' : 'text-sm'}`}>{leftIcon}</span>
        )}
        {children}
        {rightIcon && !isLoading && (
          <span className={`ml-2 ${size === 'xs' ? 'text-xs' : 'text-sm'}`}>{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';