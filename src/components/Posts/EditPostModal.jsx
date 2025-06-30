import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Button } from '../Button';
import { LoadingSpinner } from '../LoadingSpinner';

export const EditPostModal = ({ isOpen, onClose, post, onUpdate }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (post) {
      setContent(post.content);
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const updatedPost = await api.put(`/posts/${post.id}`, { content });
      onUpdate(updatedPost);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            rows="5"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 