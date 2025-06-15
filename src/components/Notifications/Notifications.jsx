import React, { useState, useEffect } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Share } from 'lucide-react';
import { api } from '../../utils/api';
import { formatDistanceToNow } from '../../utils/dateUtils';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-pink-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'share':
        return <Share className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-xl">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Notifications
      </h2>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md ${!notification.read ? 'border-l-4 border-blue-500' : ''}`}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {getNotificationIcon(notification.type)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline space-x-2">
                  <img
                    src={notification.actor.avatar}
                    alt={notification.actor.username}
                    className="w-6 h-6 rounded-full"
                  />
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {notification.actor.username}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {notification.content}
                  </p>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(notification.createdAt))}
                </p>
              </div>

              {notification.type === 'follow' && (
                <button className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-1 px-3 rounded-full transition-colors duration-200">
                  Follow Back
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};