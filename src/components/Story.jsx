import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Modal } from './Modal';

export function Story({ story, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(story.media.length - 1, prev + 1));
  };

  const currentMedia = story.media[currentIndex];

  return (
    <Modal isOpen onClose={onClose} size="2xl" showClose={false}>
      <div className="relative aspect-[9/16] overflow-hidden rounded-lg bg-black">
        {currentMedia.type === 'image' ? (
          <img
            src={currentMedia.url}
            alt="Story content"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            src={currentMedia.url}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent p-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={story.user.avatar}
              alt={story.user.name}
              size="md"
              fallback={story.user.name}
            />
            <div>
              <h3 className="font-medium text-white">{story.user.name}</h3>
              <p className="text-sm text-gray-300">
                {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {story.media.length > 1 && (
          <>
            <div className="absolute inset-x-0 top-16 flex gap-1 p-4">
              {story.media.map((_, index) => (
                <div
                  key={index}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
                >
                  <div
                    className={`h-full rounded-full bg-white transition-all duration-300 ${index === currentIndex ? 'w-full' : 'w-0'}`}
                  />
                </div>
              ))}
            </div>

            <Button
              variant="ghost"
              size="lg"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={handleNext}
              disabled={currentIndex === story.media.length - 1}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </>
        )}

        {currentMedia.text && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4">
            <p className="text-lg text-white">{currentMedia.text}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}