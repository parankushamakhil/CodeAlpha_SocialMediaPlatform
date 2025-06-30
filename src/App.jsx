import React, { useState, useEffect } from 'react';
import AuthProvider, { useAuth } from './context/AuthContext';
import { Header } from './components/Layout/Header';
import { AuthModal } from './components/Auth/AuthModal';
import { Feed } from './components/Feed/Feed';
import { CreatePost } from './components/Posts/CreatePost';
import { Profile } from './components/Profile/Profile';
import { UserSearch } from './components/Users/UserSearch';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Stories } from './components/Stories/Stories';
import { Notifications } from './components/Notifications/Notifications';
import { Bookmarks } from './components/Bookmarks/Bookmarks';
import { Trending } from './components/Trending/Trending';
import { CreateStory } from './components/Stories/CreateStory';
import { Messages } from './components/Messages/Messages';
import { Settings } from './components/Settings/Settings';
import SuggestedUsers from './components/Users/SuggestedUsers';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <div className="text-white text-2xl font-bold">S</div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Welcome to Social Connect
            </h1>
            <p className="text-gray-600 mb-8 max-w-md">
              Connect with friends, share your moments, and discover amazing content from people around the world.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Get Started
            </button>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <div className="space-y-6">
            <Stories onCreateStory={() => setShowCreateStory(true)} />
            <Feed />
          </div>
        );
      case 'discover':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Feed showAll />
              </div>
            </div>
            <div className="hidden lg:block space-y-6">
              <Trending />
              <SuggestedUsers />
            </div>
          </div>
        );
      case 'search':
        return <UserSearch query={searchQuery} onUserSelect={setSelectedUserId} />;
      case 'messages':
        return <Messages />;
      case 'notifications':
        return (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <Notifications notifications={notifications} />
          </div>
        );
      case 'bookmarks':
        return (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <Bookmarks />
          </div>
        );
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile userId={selectedUserId || user.id} />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="space-y-6">
                <Stories onCreateStory={() => setShowCreateStory(true)} />
                <Feed />
              </div>
            </div>
            <div className="hidden lg:block space-y-6">
              <Trending />
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm sticky top-20">
                <SuggestedUsers />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-200">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hasNewNotifications={hasNewNotifications}
        onCreatePost={() => setShowCreatePost(true)}
        onCreateStory={() => setShowCreateStory(true)}
        onNotificationsClick={() => {
          setHasNewNotifications(false);
          setActiveTab('notifications');
        }}
        onProfileClick={() => {
          setSelectedUserId(user.id);
          setActiveTab('profile');
        }}
      />
      
      <main className="container mx-auto px-4 pt-20 pb-6">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <CreatePost isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} />
      <CreateStory isOpen={showCreateStory} onClose={() => setShowCreateStory(false)} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;