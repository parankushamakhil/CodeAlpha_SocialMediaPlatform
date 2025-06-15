import { Bell, Home, Search, Users, Compass, Bookmark, Sun, Moon, LogOut } from 'lucide-react';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Dropdown } from './Dropdown';
import { Input } from './Input';
import { useTheme } from './ThemeProvider';

export function Header({
  user,
  activeTab,
  onTabChange,
  onSearch,
  onCreatePost,
  onCreateStory,
  onNotificationsClick,
  hasNewNotifications,
  onLogout,
}) {
  const { theme, toggleTheme } = useTheme();

  const tabs = [
    { id: 'feed', label: 'Feed', icon: <Home className="h-5 w-5" /> },
    { id: 'discover', label: 'Discover', icon: <Compass className="h-5 w-5" /> },
    { id: 'search', label: 'Search', icon: <Search className="h-5 w-5" /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark className="h-5 w-5" /> },
  ];

  const userMenuItems = [
    {
      label: 'View Profile',
      onClick: () => onTabChange('profile'),
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: theme === 'light' ? 'Dark Mode' : 'Light Mode',
      onClick: toggleTheme,
      icon: theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />,
    },
    { type: 'divider' },
    {
      label: 'Logout',
      onClick: onLogout,
      icon: <LogOut className="h-5 w-5" />,
      danger: true,
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
            Social App
          </h1>
          <nav className="hidden items-center gap-1 md:flex">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'primary' : 'ghost'}
                onClick={() => onTabChange(tab.id)}
                leftIcon={tab.icon}
              >
                {tab.label}
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden w-72 lg:block">
            <Input
              type="search"
              placeholder="Search..."
              onChange={(e) => onSearch(e.target.value)}
              leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={onCreatePost}
              className="hidden sm:inline-flex"
            >
              Create Post
            </Button>

            <Button variant="outline" onClick={onCreateStory}>
              Add Story
            </Button>

            <Button
              variant="ghost"
              onClick={onNotificationsClick}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {hasNewNotifications && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Button>

            <Dropdown
              trigger={
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  size="sm"
                  fallback={user.name}
                  className="cursor-pointer"
                />
              }
              items={userMenuItems}
            />
          </div>
        </div>
      </div>

      <nav className="flex items-center gap-1 border-t border-gray-200 px-4 py-2 dark:border-gray-700 md:hidden">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'primary' : 'ghost'}
            onClick={() => onTabChange(tab.id)}
            className="flex-1"
          >
            {tab.icon}
          </Button>
        ))}
      </nav>
    </header>
  );
}