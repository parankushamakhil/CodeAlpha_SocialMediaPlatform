import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Card, CardContent } from './Card';
import { Dropdown } from './Dropdown';
import { Badge } from './Badge';

export function PostCard({
  post,
  currentUser,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onDelete,
  onEdit,
}) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);

  const handleLike = async () => {
    try {
      await onLike(post.id);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      await onBookmark(post.id);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error bookmarking post:', error);
    }
  };

  const menuItems = [
    ...(post.userId === currentUser.id
      ? [
          {
            label: 'Edit Post',
            onClick: () => onEdit(post.id),
          },
          {
            label: 'Delete Post',
            onClick: () => onDelete(post.id),
            danger: true,
          },
        ]
      : [
          {
            label: 'Report Post',
            onClick: () => console.log('Report post'),
            danger: true,
          },
        ]),
  ];

  return (
    <Card variant="bordered" className="overflow-hidden card card-hover animate-fade-in">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-800/50">
          <div className="flex items-center gap-3">
            <Avatar
              src={post.user.avatar}
              alt={post.user.name}
              size="md"
              fallback={post.user.name}
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                {post.user.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <Dropdown
            trigger={
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            }
            items={menuItems}
          />
        </div>

        {post.content && (
          <div className="px-4 pb-3 space-y-2">
            <p className="whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed">
              {post.content}
            </p>
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {post.hashtags.map((tag) => (
                  <Badge key={tag} variant="primary" size="sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="aspect-video w-full object-cover hover:brightness-105 transition-all duration-300"
          />
        )}

        {post.video && (
          <video
            src={post.video}
            controls
            className="aspect-video w-full object-cover"
          />
        )}

        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-gray-800 bg-gradient-to-t from-transparent to-gray-50/50 dark:to-gray-800/50">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="hover:bg-red-50 dark:hover:bg-red-900/20 group"
              leftIcon={
                <Heart
                  className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isLiked ? 'fill-red-500 text-red-500' : 'group-hover:text-red-500'}`}
                />
              }
            >
              {likesCount}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment(post.id)}
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 group"
              leftIcon={<MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-500" />}
            >
              {post.commentsCount}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(post.id)}
              className="hover:bg-green-50 dark:hover:bg-green-900/20 group"
              leftIcon={<Share2 className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:text-green-500" />}
            >
              {post.sharesCount}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className="hover:bg-purple-50 dark:hover:bg-purple-900/20 group"
            leftIcon={
              <Bookmark
                className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isBookmarked ? 'fill-purple-500 text-purple-500' : 'group-hover:text-purple-500'}`}
              />
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}