import React, { useState, useEffect } from 'react';
import { Bookmark, Grid, List, Filter } from 'lucide-react';
import { api } from '../../utils/api';
import { PostCard } from '../Posts/PostCard';

export const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filter, setFilter] = useState('all'); // 'all', 'posts', 'photos', 'videos'

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const data = await api.get('/posts/bookmarks');
      setBookmarks(data);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookmarks = bookmarks.filter(bookmark => {
    if (filter === 'all') return true;
    if (filter === 'photos') return bookmark.image;
    if (filter === 'videos') return bookmark.videoUrl;
    return true;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-4">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Bookmark className="w-6 h-6" />
          Bookmarks
        </h2>

        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <button
              className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 hidden group-hover:block">
              {['all', 'posts', 'photos', 'videos'].map((option) => (
                <button
                  key={option}
                  onClick={() => setFilter(option)}
                  className={`w-full text-left px-4 py-2 text-sm ${filter === option ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No bookmarks yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Save posts you'd like to see again by clicking the bookmark icon
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 
          'space-y-6'
        }>
          {filteredBookmarks.map((bookmark) => (
            <div key={bookmark.id} className={viewMode === 'grid' ? 
              'bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transform hover:scale-[1.02] transition-transform duration-200' :
              'w-full'
            }>
              <PostCard post={bookmark} onUpdate={loadBookmarks} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};