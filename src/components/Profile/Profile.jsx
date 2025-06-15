import React, { useState, useEffect } from 'react';
import { User, Users, Grid, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { PostCard } from '../Posts/PostCard';

export const Profile = ({ userId }) => {
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Load user profile
      const userData = await api.get(`/users/${userId}`);
      setProfileUser(userData);
      setFollowersCount(userData.followersCount);

      // Load user posts
      const allPosts = await api.get('/posts');
      const filteredPosts = allPosts.filter((post) => post.userId === userId);
      setUserPosts(filteredPosts);

      // Check follow status if not viewing own profile
      if (currentUser && userId !== currentUser.id) {
        try {
          const followStatus = await api.get(`/users/${userId}/follow-status`);
          setIsFollowing(followStatus.isFollowing);
        } catch (error) {
          // Handle error silently
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser || userId === currentUser.id || actionLoading) return;

    setActionLoading(true);
    try {
      const response = await api.post(`/users/${userId}/follow`);
      setIsFollowing(response.isFollowing);
      setFollowersCount(response.followersCount);
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setUserPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg">User not found</div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 -mt-16">
            <img
              src={profileUser.avatar}
              alt={profileUser.fullName}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4 sm:mb-0"
            />
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{profileUser.fullName}</h1>
              <p className="text-gray-600">@{profileUser.username}</p>
              {profileUser.bio && (
                <p className="text-gray-800 mt-2">{profileUser.bio}</p>
              )}
              
              {/* Stats */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-1">
                  <Grid size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    <strong>{userPosts.length}</strong> posts
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    <strong>{followersCount}</strong> followers
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <User size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    <strong>{profileUser.followingCount || 0}</strong> following
                  </span>
                </div>
              </div>
            </div>

            {/* Follow Button */}
            {!isOwnProfile && currentUser && (
              <button
                onClick={handleFollow}
                disabled={actionLoading}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  isFollowing
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {actionLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  isFollowing ? 'Following' : 'Follow'
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Grid size={20} className="text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Posts</h2>
        </div>

        {userPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              {isOwnProfile ? "You haven't posted anything yet." : `${profileUser.fullName} hasn't posted anything yet.`}
            </div>
            <p className="text-gray-400">
              {isOwnProfile ? 'Share your first post to get started!' : 'Check back later for new posts.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {userPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onUpdate={handlePostUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};