import React, { useState } from 'react';
import { X, Image, Video, Smile, Clock } from 'lucide-react';
import { api } from '../../utils/api';

export const CreateStory = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [loading, setLoading] = useState(false);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
      setMediaType(file.type.startsWith('image/') ? 'image' : 'video');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mediaPreview && !content) return;

    setLoading(true);
    try {
      await api.post('/stories', {
        content,
        [mediaType]: mediaPreview,
      });
      onClose();
      setContent('');
      setMediaPreview(null);
      setMediaType(null);
    } catch (error) {
      console.error('Error creating story:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full shadow-xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Story</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Media Preview */}
            {mediaPreview ? (
              <div className="relative rounded-xl overflow-hidden aspect-[9/16] bg-black flex items-center justify-center">
                {mediaType === 'image' ? (
                  <img
                    src={mediaPreview}
                    alt="Story preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={mediaPreview}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMediaPreview(null);
                    setMediaType(null);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <div className="text-center space-y-2">
                  <div className="flex justify-center space-x-4">
                    <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                      <Image className="w-5 h-5" />
                      <span>Add Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMediaChange}
                        className="hidden"
                      />
                    </label>
                    <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
                      <Video className="w-5 h-5" />
                      <span>Add Video</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleMediaChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Share a photo or video for your story
                  </p>
                </div>
              </div>
            )}

            {/* Text Input */}
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a caption to your story..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow"
                rows="3"
              />
              <button
                type="button"
                className="absolute right-3 bottom-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <Smile className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Duration Selector */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4" />
              <span>Story will be visible for 24 hours</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading || (!content && !mediaPreview)}
              className={`px-6 py-2 rounded-full font-medium ${loading || (!content && !mediaPreview)
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200'}`}
            >
              {loading ? 'Sharing...' : 'Share Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};