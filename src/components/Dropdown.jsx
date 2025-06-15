import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

export function Dropdown({
  trigger,
  items,
  align = 'right',
  className = '',
  buttonClassName = '',
}) {
  const alignmentClasses = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
  };

  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <Menu.Button
        className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900 ${buttonClassName}`}
      >
        {typeof trigger === 'string' ? (
          <>
            {trigger}
            <ChevronDown className="ml-2 -mr-1 h-4 w-4" aria-hidden="true" />
          </>
        ) : (
          trigger
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute z-10 mt-2 w-56 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 ${alignmentClasses[align]}`}
        >
          {items.map((item, index) => {
            if (item.type === 'divider') {
              return (
                <div
                  key={index}
                  className="my-1 border-t border-gray-100 dark:border-gray-700"
                />
              );
            }

            return (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={item.onClick}
                    className={`${active ? 'bg-gray-50 dark:bg-gray-700/50' : ''} ${
                      item.danger
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-700 dark:text-gray-200'
                    } group flex w-full items-center px-4 py-2 text-sm`}
                    disabled={item.disabled}
                  >
                    {item.icon && (
                      <span
                        className={`mr-3 h-5 w-5 ${item.danger ? 'text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}
                      >
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            );
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}