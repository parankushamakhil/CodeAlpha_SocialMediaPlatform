import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { formatDistanceToNow } from '../../utils/dateUtils';

export const Stories = ({ onCreateStory }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const data = await api.get('/stories');
      setStories(data);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollStories = (direction) => {
    const container = document.getElementById('stories-container');
    const scrollAmount = direction === 'left' ? -200 : 200;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex space-x-4 overflow-x-hidden py-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={() => scrollStories('left')}
          className="p-1 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
      
      <div
        id="stories-container"
        className="flex space-x-4 overflow-x-hidden scroll-smooth relative"
      >
        <div className="flex-shrink-0">
          <button
            onClick={onCreateStory}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 cursor-pointer"
          >
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
              <Plus className="w-8 h-8 text-blue-500" />
            </div>
          </button>
          <p className="text-xs text-center mt-2 text-gray-600 dark:text-gray-300">Add Story</p>
        </div>

        {stories.map((story, index) => (
          <div key={story.id} className="flex-shrink-0">
            <button
              onClick={() => setActiveStoryIndex(index)}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 p-0.5 hover:from-pink-600 hover:to-orange-500 transition-all duration-200"
            >
              <img
                src={story.user.avatar}
                alt={story.user.username}
                className="w-full h-full object-cover rounded-full ring-2 ring-white dark:ring-gray-800"
              />
            </button>
            <p className="text-xs text-center mt-2 text-gray-600 dark:text-gray-300 truncate max-w-[80px] mx-auto">
              {story.user.username}
            </p>
          </div>
        ))}
      </div>

      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={() => scrollStories('right')}
          className="p-1 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {activeStoryIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-lg w-full mx-4">
            <img
              src={stories[activeStoryIndex].image}
              alt="Story"
              className="w-full rounded-lg shadow-xl"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <div className="flex items-center space-x-2">
                <img
                  src={stories[activeStoryIndex].user.avatar}
                  alt={stories[activeStoryIndex].user.username}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-white font-semibold">{stories[activeStoryIndex].user.username}</p>
                  <p className="text-gray-300 text-sm">
                    {formatDistanceToNow(new Date(stories[activeStoryIndex].createdAt))}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveStoryIndex(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};