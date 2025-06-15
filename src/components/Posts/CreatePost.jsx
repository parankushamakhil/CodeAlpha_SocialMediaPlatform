import React, { useState } from 'react';
import { X, Image, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { LoadingSpinner } from '../UI/LoadingSpinner';

export const CreatePost = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      await api.post('/posts', {
        content: content.trim(),
        image: imageUrl.trim() || null
      });
      setContent('');
      setImageUrl('');
      onClose();
      // Optionally refresh the feed here
      window.location.reload();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const suggestedImages = [
    'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1566909/pexels-photo-1566909.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={user?.avatar}
              alt={user?.fullName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium text-gray-900">{user?.fullName}</h3>
              <p className="text-sm text-gray-500">@{user?.username}</p>
            </div>
          </div>

          {/* Content Input */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            maxLength={500}
          />

          <div className="text-right text-xs text-gray-500 mt-1">
            {content.length}/500
          </div>

          {/* Image URL Input */}
          <div className="mt-4">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Image size={16} />
              <span>Add Image (URL)</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Suggested Images */}
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Or choose from suggested images:</p>
            <div className="grid grid-cols-4 gap-2">
              {suggestedImages.map((url, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setImageUrl(url)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    imageUrl === url ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Suggested ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Image Preview */}
          {imageUrl && (
            <div className="mt-4">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full rounded-lg max-h-48 object-cover"
                onError={() => setImageUrl('')}
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              {submitting ? <LoadingSpinner size="small" /> : <Send size={16} />}
              <span>{submitting ? 'Posting...' : 'Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};