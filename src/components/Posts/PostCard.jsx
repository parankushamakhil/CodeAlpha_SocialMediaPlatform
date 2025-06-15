import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { CommentSection } from './CommentSection';
import { api } from '../../utils/api';
import { formatDistanceToNow } from '../../utils/dateUtils';

export const PostCard = ({ post, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const response = await api.post(`/posts/${post.id}/like`);
      onUpdate({
        ...post,
        likesCount: response.likesCount,
        isLiked: response.isLiked
      });
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={post.user?.avatar}
            alt={post.user?.fullName}
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.user?.fullName}</h3>
            <p className="text-sm text-gray-500">@{post.user?.username}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <span className="text-sm">{formatDistanceToNow(new Date(post.createdAt))}</span>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 leading-relaxed">{post.content}</p>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="px-4 pb-3">
          <img
            src={post.image}
            alt="Post content"
            className="w-full rounded-lg object-cover max-h-96"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center space-x-2 transition-colors ${
                post.isLiked
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart
                size={20}
                className={`transition-transform hover:scale-110 ${
                  post.isLiked ? 'fill-current' : ''
                }`}
              />
              <span className="text-sm font-medium">{post.likesCount}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <MessageCircle size={20} className="transition-transform hover:scale-110" />
              <span className="text-sm font-medium">{post.commentsCount}</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
              <Share size={20} className="transition-transform hover:scale-110" />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <CommentSection postId={post.id} />
          </div>
        )}
      </div>
    </div>
  );
};