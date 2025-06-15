import { Toaster } from 'react-hot-toast';

export function Toast() {
  return (
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for specific types
        success: {
          duration: 3000,
          className: '!bg-green-50 !text-green-800 dark:!bg-green-950 dark:!text-green-200',
          iconTheme: {
            primary: '#22c55e',
            secondary: '#ffffff',
          },
        },
        error: {
          duration: 4000,
          className: '!bg-red-50 !text-red-800 dark:!bg-red-950 dark:!text-red-200',
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
        loading: {
          className: '!bg-gray-50 !text-gray-800 dark:!bg-gray-900 dark:!text-gray-200',
        },
        custom: {
          className: '!bg-primary-50 !text-primary-800 dark:!bg-primary-950 dark:!text-primary-200',
        },
        // Default style
        style: {
          background: '#fff',
          color: '#363636',
          maxWidth: '500px',
          padding: '16px 24px',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      }}
    />
  );
}