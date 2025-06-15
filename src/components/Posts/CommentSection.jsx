import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { LoadingSpinner } from '../UI/LoadingSpinner';

export const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const data = await api.get(`/posts/${postId}/comments`);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const comment = await api.post(`/posts/${postId}/comments`, {
        content: newComment.trim()
      });
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comments List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            <img
              src={comment.user?.avatar}
              alt={comment.user?.fullName}
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">
                    {comment.user?.fullName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt))}
                  </span>
                </div>
                <p className="text-sm text-gray-800">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <img
          src={user?.avatar}
          alt={user?.fullName}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        <div className="flex-1 flex space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {submitting ? <LoadingSpinner size="small" /> : <Send size={16} />}
          </button>
        </div>
      </form>
    </div>
  );
};