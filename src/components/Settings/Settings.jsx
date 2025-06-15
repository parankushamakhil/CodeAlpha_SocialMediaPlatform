import React, { useState } from 'react';
import { User, Bell, Lock, Moon, Globe, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Settings() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Moon },
    { id: 'language', label: 'Language', icon: Globe },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName}`}
                alt={user?.fullName}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.fullName}</h2>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>

            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.fullName}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Save Changes
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
            <div className="space-y-4">
              {['Likes', 'Comments', 'Mentions', 'Follows', 'Messages'].map((item) => (
                <div key={item} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500 dark:text-gray-400">
            This section is under development
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
        {/* Sidebar */}
        <div className="p-6 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === tab.id ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'}`}
              >
                <Icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
            <button
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-200"
              onClick={() => {
                // Add delete account logic
              }}
            >
              <Trash2 size={20} />
              <span className="font-medium">Delete Account</span>
            </button>
            <button
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={logout}
            >
              <LogOut size={20} />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="col-span-3 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}