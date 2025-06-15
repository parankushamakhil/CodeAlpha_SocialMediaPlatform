import React from 'react';
import { Home, Search, PlusCircle, User, Compass, LogOut, Bell, MessageCircle, Bookmark, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onCreatePost,
  onProfileClick
}) => {
  const { user, logout } = useAuth();

  const mainNavItems = [
    { id: 'feed', icon: Home, label: 'Home' },
    { id: 'discover', icon: Compass, label: 'Explore' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: true },
    { id: 'bookmarks', icon: Bookmark, label: 'Saved' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Social Connect
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 font-semibold dark:bg-gray-800 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search Bar */}
          {activeTab === 'search' && (
            <div className="flex-1 max-w-md mx-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full border border-gray-300 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onCreatePost}
              className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
            >
              <PlusCircle size={20} />
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('settings')}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={onProfileClick}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                <img
                  src={user?.avatar}
                  alt={user?.fullName}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                />
                <span className="hidden sm:block font-medium">{user?.fullName}</span>
              </button>
              
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-500 transition-colors duration-200"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-around py-2 border-t border-gray-200 bg-white/95 backdrop-blur-md">
          {mainNavItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'text-blue-600'
                    : 'text-gray-500'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};