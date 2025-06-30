import React, { useState, useEffect } from 'react';
import { PostCard } from '../Posts/PostCard';
import { LoadingSpinner } from '../LoadingSpinner';
import { api } from '../../utils/api';

export const Feed = ({ showAll = false }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, [showAll]);

  const loadPosts = async () => {
    try {
      const endpoint = showAll ? '/posts' : '/posts/feed';
      const data = await api.get(endpoint);
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const handlePostDelete = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-8">
        <LoadingSpinner size="large" className="text-primary-500" />
        <p className="mt-4 text-gray-500 animate-pulse">Loading your feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl shadow-elegant animate-fade-in">
          <p className="font-medium">{error}</p>
          <button 
            onClick={loadPosts} 
            className="mt-3 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-12 animate-fade-in">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 text-center max-w-md mx-auto shadow-elegant">
          <div className="text-gray-600 dark:text-gray-300 text-xl font-semibold mb-4">
            {showAll ? 'No posts found.' : 'Your feed is empty.'}
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {showAll 
              ? 'Be the first to share something!' 
              : 'Follow some users to see their posts here.'
            }
          </p>
          <button 
            onClick={() => window.location.href = '/explore'}
            className="btn-primary inline-flex items-center space-x-2 transform hover:scale-105 transition-transform"
          >
            {showAll ? '✨ Create a Post' : '🔍 Explore Posts'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4 sm:px-6 animate-fade-in">
      <div className="text-center py-6 bg-gradient-card from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-elegant mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          {showAll ? 'Discover Posts' : 'Your Feed'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {showAll 
            ? 'Explore what everyone is sharing' 
            : 'Latest posts from people you follow'
          }
        </p>
      </div>

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onUpdate={handlePostUpdate}
          onDelete={handlePostDelete}
        />
      ))}
    </div>
  );
};