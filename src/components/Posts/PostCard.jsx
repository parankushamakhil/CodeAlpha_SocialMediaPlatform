import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import { CommentSection } from './CommentSection';
import { api } from '../../utils/api';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';
import { EditPostModal } from './EditPostModal';

export const PostCard = ({ post, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleBookmark = async () => {
    if (isBookmarking) return;
    
    setIsBookmarking(true);
    try {
      const response = await api.post(`/posts/${post.id}/bookmark`);
      onUpdate({
        ...post,
        isBookmarked: response.isBookmarked
      });
    } catch (error) {
      console.error('Error bookmarking post:', error);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${post.id}`);
        onDelete(post.id);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      setIsSharing(true);
      try {
        await navigator.share({
          title: 'Check out this post!',
          text: `"${post.content}" by ${post.user.fullName}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      } finally {
        setIsSharing(false);
      }
    } else {
      console.log('Web Share API not supported');
      // Fallback behavior for browsers that do not support the Web Share API
      alert("Sharing is not supported on your browser, but you can copy the link!");
    }
  };

  const isOwnPost = user && user.id === post.user.id;

  return (
    <>
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
            {isOwnPost && (
              <div className="relative group">
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreHorizontal size={16} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
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

              <button
                onClick={handleShare}
                disabled={isSharing}
                className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
              >
                <Share size={20} className="transition-transform hover:scale-110" />
              </button>
            </div>
            <button
              onClick={handleBookmark}
              disabled={isBookmarking}
              className={`flex items-center space-x-2 transition-colors ${
                post.isBookmarked
                  ? 'text-yellow-500 hover:text-yellow-600'
                  : 'text-gray-500 hover:text-yellow-500'
              }`}
            >
              <Bookmark
                size={20}
                className={`transition-transform hover:scale-110 ${
                  post.isBookmarked ? 'fill-current' : ''
                }`}
              />
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <CommentSection postId={post.id} />
            </div>
          )}
        </div>
      </div>
      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        post={post}
        onUpdate={(updatedPost) => {
          onUpdate(updatedPost);
          setIsEditModalOpen(false);
        }}
      />
    </>
  );
};