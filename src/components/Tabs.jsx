import { Tab } from '@headlessui/react';
import { Fragment } from 'react';

export function Tabs({ tabs, variant = 'line', className = '' }) {
  const variants = {
    line: {
      list: 'border-b border-gray-200 dark:border-gray-700',
      tab: 'border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200',
      selected:
        'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400',
    },
    pill: {
      list: 'space-x-2',
      tab: 'rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200',
      selected:
        'bg-primary-50 text-primary-700 hover:bg-primary-50 hover:text-primary-700 dark:bg-primary-900 dark:text-primary-400 dark:hover:bg-primary-900 dark:hover:text-primary-400',
    },
    card: {
      list: 'space-x-2',
      tab: 'rounded-lg border border-transparent px-3 py-1.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200',
      selected:
        'border-gray-300 bg-white text-gray-700 hover:bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-800',
    },
  };

  return (
    <Tab.Group>
      <Tab.List className={`flex ${variants[variant].list} ${className}`}>
        {tabs.map((tab) => (
          <Tab key={tab.id} as={Fragment}>
            {({ selected }) => (
              <button
                className={`${variants[variant].tab} ${
                  selected ? variants[variant].selected : ''
                } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
              >
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                      selected
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-4">
        {tabs.map((tab) => (
          <Tab.Panel
            key={tab.id}
            className={`rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
          >
            {tab.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}