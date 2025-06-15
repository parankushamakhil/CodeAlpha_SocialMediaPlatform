import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  showClose = true,
  initialFocus,
}) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full',
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}
        initialFocus={initialFocus}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm dark:bg-gray-900/75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${maxWidthClasses[size]} transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800`}
              >
                <div className="flex items-center justify-between">
                  {title && (
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      {title}
                    </Dialog.Title>
                  )}
                  {showClose && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-mr-2 shrink-0"
                      onClick={onClose}
                      aria-label="Close dialog"
                    >
                      <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </Button>
                  )}
                </div>

                <div className="mt-4">{children}</div>

                {footer && <div className="mt-6">{footer}</div>}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}