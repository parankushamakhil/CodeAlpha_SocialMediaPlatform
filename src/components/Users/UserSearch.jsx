import React, { useState, useEffect } from 'react';
import { Search, UserPlus, UserCheck, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { LoadingSpinner } from '../UI/LoadingSpinner';

export const UserSearch = ({ query, onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followingUsers, setFollowingUsers] = useState(new Set());
  const { user: currentUser } = useAuth();

  useEffect(() => {
    searchUsers();
  }, [query]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const params = query ? `?search=${encodeURIComponent(query)}` : '';
      const data = await api.get(`/users${params}`);
      
      // Filter out current user
      const filteredUsers = data.filter((user) => user.id !== currentUser?.id);
      setUsers(filteredUsers);

      // Get follow status for each user
      const followStatuses = await Promise.allSettled(
        filteredUsers.map((user) =>
          api.get(`/users/${user.id}/follow-status`)
        )
      );

      const following = new Set();
      followStatuses.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.isFollowing) {
          following.add(filteredUsers[index].id);
        }
      });
      setFollowingUsers(following);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId, event) => {
    event.stopPropagation();
    
    try {
      const response = await api.post(`/users/${userId}/follow`);
      
      if (response.isFollowing) {
        setFollowingUsers(prev => new Set([...prev, userId]));
      } else {
        setFollowingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }

      // Update the user's followers count
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, followersCount: response.followersCount }
            : user
        )
      );
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUserClick = (userId) => {
    onUserSelect(userId);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center py-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Discover People</h1>
        <p className="text-gray-600">
          {query ? `Search results for "${query}"` : 'Find interesting people to follow'}
        </p>
      </div>

      {users.length === 0 && !loading ? (
        <div className="text-center py-12">
          <Search size={48} className="text-gray-300 mx-auto mb-4" />
          <div className="text-gray-500 text-lg mb-2">
            {query ? 'No users found' : 'Start typing to search for users'}
          </div>
          <p className="text-gray-400">
            {query ? 'Try a different search term' : 'Discover amazing people to connect with'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {users.map((user) => {
            const isFollowing = followingUsers.has(user.id);
            
            return (
              <div
                key={user.id}
                onClick={() => handleUserClick(user.id)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-16 h-16 rounded-full border-2 border-white shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {user.fullName}
                      </h3>
                      <p className="text-gray-600 text-sm truncate">
                        @{user.username}
                      </p>
                      {user.bio && (
                        <p className="text-gray-700 text-sm mt-1 line-clamp-2">
                          {user.bio}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users size={12} />
                          <span>{user.followersCount || 0} followers</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleFollow(user.id, e)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck size={16} />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};