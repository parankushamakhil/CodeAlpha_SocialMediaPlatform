import { forwardRef } from 'react';

const sizes = {
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-2.5 text-lg',
};

export const Input = forwardRef(
  (
    {
      className = '',
      size = 'md',
      error,
      leftIcon,
      rightIcon,
      isDisabled = false,
      isReadOnly = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'block w-full rounded-lg border border-gray-300 bg-white transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-400 dark:focus:ring-primary-400 dark:disabled:bg-gray-800';

    const errorStyles =
      'border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:text-red-400 dark:placeholder:text-red-400 dark:focus:border-red-500 dark:focus:ring-red-500';

    return (
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${error ? errorStyles : ''} ${sizes[size]} ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${className}`}
          disabled={isDisabled}
          readOnly={isReadOnly}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = forwardRef(
  ({ className = '', error, isDisabled = false, isReadOnly = false, ...props }, ref) => {
    const baseStyles =
      'block w-full rounded-lg border border-gray-300 bg-white transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-400 dark:focus:ring-primary-400 dark:disabled:bg-gray-800';

    const errorStyles =
      'border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:text-red-400 dark:placeholder:text-red-400 dark:focus:border-red-500 dark:focus:ring-red-500';

    return (
      <textarea
        ref={ref}
        className={`${baseStyles} ${error ? errorStyles : ''} px-3 py-2 ${className}`}
        disabled={isDisabled}
        readOnly={isReadOnly}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';