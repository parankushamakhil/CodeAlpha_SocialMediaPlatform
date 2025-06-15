import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from './Button';
import { Story } from './Story';

export function StoryViewer({ stories, initialStoryIndex = 0, onClose }) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [isPaused, setIsPaused] = useState(false);

  const currentStory = stories[currentStoryIndex];

  const goToNextStory = useCallback(() => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      onClose();
    }
  }, [currentStoryIndex, stories.length, onClose]);

  const goToPreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  useEffect(() => {
    if (!isPaused) {
      const timer = setTimeout(goToNextStory, 5000); // 5 seconds per story
      return () => clearTimeout(timer);
    }
  }, [currentStoryIndex, isPaused, goToNextStory]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') {
        goToPreviousStory();
      } else if (e.key === 'ArrowRight') {
        goToNextStory();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        // Space bar
        e.preventDefault();
        setIsPaused(!isPaused);
      }
    },
    [goToNextStory, isPaused, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative h-full w-full md:h-[80vh] md:w-auto">
        <Story story={currentStory} onClose={onClose} />

        <div className="absolute inset-x-0 top-4 z-10 flex justify-center gap-2 px-4">
          {stories.map((_, index) => (
            <div
              key={index}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/30 md:w-16 md:flex-none"
            >
              <div
                className={`h-full rounded-full bg-white transition-all duration-300 ${index === currentStoryIndex ? (!isPaused ? 'w-full transition-all duration-[5000ms] ease-linear' : 'w-full') : index < currentStoryIndex ? 'w-full' : 'w-0'}`}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-y-0 left-4 flex items-center md:left-8">
          <Button
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20"
            onClick={goToPreviousStory}
            disabled={currentStoryIndex === 0}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        </div>

        <div className="absolute inset-y-0 right-4 flex items-center md:right-8">
          <Button
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20"
            onClick={goToNextStory}
            disabled={currentStoryIndex === stories.length - 1}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-4 right-4 text-white hover:bg-white/20"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? (
            <Play className="h-5 w-5" />
          ) : (
            <Pause className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}