import { forwardRef } from 'react';

const variants = {
  flat: '',
  raised: 'shadow-soft-md hover:shadow-soft-lg',
  bordered: 'border border-gray-200 dark:border-gray-700',
};

export const Card = forwardRef(
  ({ className = '', variant = 'flat', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-xl bg-white transition-shadow dark:bg-gray-800 ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div
      className={`border-b border-gray-200 px-6 py-4 dark:border-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }) {
  return (
    <div
      className={`border-t border-gray-200 px-6 py-4 dark:border-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}