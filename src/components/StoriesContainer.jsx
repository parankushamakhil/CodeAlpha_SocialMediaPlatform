import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { Story } from './Story';
import { StoryCircle } from './StoryCircle';

export function StoriesContainer({ stories, currentUser, onCreateStory }) {
  const [selectedStory, setSelectedStory] = useState(null);
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === 'left' ? -200 : 200;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };

  const handleCloseStory = () => {
    setSelectedStory(null);
  };

  return (
    <div className="relative animate-fade-in">
      <div className="relative bg-gradient-card from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-xl shadow-elegant p-2 mb-6">
        <div
          ref={scrollContainerRef}
          className="no-scrollbar flex items-center gap-6 overflow-x-auto scroll-smooth px-4 py-3 mask-image-[linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] dark:mask-image-[linear-gradient(to_right,transparent,#1f2937_10%,#1f2937_90%,transparent)]"
        >
          <StoryCircle isCreate onClick={onCreateStory} />
          {stories.map((story) => (
            <StoryCircle
              key={story.id}
              story={story}
              onClick={() => handleStoryClick(story)}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="absolute -left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-elegant backdrop-blur-sm hover:bg-white hover:scale-110 dark:bg-gray-800/90 dark:hover:bg-gray-800 transition-all duration-300 z-10"
          onClick={() => handleScroll('left')}
        >
          <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-elegant backdrop-blur-sm hover:bg-white hover:scale-110 dark:bg-gray-800/90 dark:hover:bg-gray-800 transition-all duration-300 z-10"
          onClick={() => handleScroll('right')}
        >
          <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        </Button>
      </div>

      {selectedStory && (
        <Story story={selectedStory} onClose={handleCloseStory} />
      )}
    </div>
  );
}