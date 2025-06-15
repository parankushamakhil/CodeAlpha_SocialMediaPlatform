import React, { useState, useEffect } from 'react';
import { TrendingUp, Hash, Users, Flame } from 'lucide-react';
import { api } from '../../utils/api';

export const Trending = () => {
  const [trendingData, setTrendingData] = useState({
    hashtags: [],
    users: [],
    topics: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hashtags');

  useEffect(() => {
    loadTrendingData();
  }, []);

  const loadTrendingData = async () => {
    try {
      const data = await api.get('/search', {
        params: { type: 'all', sort: 'trending' }
      });
      setTrendingData(data);
    } catch (error) {
      console.error('Error loading trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    switch (activeTab) {
      case 'hashtags':
        return (
          <div className="space-y-4">
            {trendingData.hashtags.map((hashtag, index) => (
              <div
                key={hashtag}
                className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:shadow-elegant cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold transform group-hover:scale-110 transition-transform duration-300 shadow-elegant">
                  #{index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{hashtag}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.floor(Math.random() * 10000)} posts
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'users':
        return (
          <div className="space-y-4">
            {trendingData.users.map((user) => (
              <div
                key={user.id}
                className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:shadow-elegant cursor-pointer group"
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover transform group-hover:scale-110 transition-transform duration-300 shadow-elegant ring-2 ring-white dark:ring-gray-800"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'topics':
        return (
          <div className="space-y-4">
            {trendingData.topics.map((topic, index) => (
              <div
                key={topic.id}
                className="p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:shadow-elegant cursor-pointer group"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Fire className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium text-orange-500">
                    Trending in {topic.category}
                  </span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">{topic.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {topic.postsCount} posts
                </p>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-elegant p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-blue-500" />
          Trending Now
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          Live Updates
        </div>
      </div>

      <div className="flex space-x-3 mb-8 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-full">
        <button
          onClick={() => setActiveTab('hashtags')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'hashtags' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-elegant scale-105' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-elegant hover:scale-105'}`}
        >
          <Hash className="w-4 h-4" />
          <span>Hashtags</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'users' ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-elegant scale-105' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-elegant hover:scale-105'}`}
        >
          <Users className="w-4 h-4" />
          <span>Users</span>
        </button>

        <button
          onClick={() => setActiveTab('topics')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'topics' ? 'bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 shadow-elegant scale-105' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-elegant hover:scale-105'}`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Topics</span>
        </button>
      </div>

      {renderContent()}
    </div>
  );
};