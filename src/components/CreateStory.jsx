import { useState } from 'react';
import { Image, Video, X, Upload } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input, Textarea } from './Input';

export function CreateStory({ isOpen, onClose, onSubmit }) {
  const [media, setMedia] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map((file) => ({
      file,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      url: URL.createObjectURL(file),
      text: '',
    }));
    setMedia([...media, ...newMedia]);
  };

  const handleRemoveMedia = (index) => {
    setMedia((prev) => {
      const newMedia = [...prev];
      URL.revokeObjectURL(newMedia[index].url);
      newMedia.splice(index, 1);
      return newMedia;
    });
  };

  const handleTextChange = (index, text) => {
    setMedia((prev) => {
      const newMedia = [...prev];
      newMedia[index].text = text;
      return newMedia;
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit(media);
      onClose();
    } catch (error) {
      console.error('Error creating story:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Story"
      size="2xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={media.length === 0}
          >
            Share Story
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {media.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 p-8 dark:border-gray-700">
            <div className="flex gap-4">
              <label className="cursor-pointer">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                />
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<Image className="h-5 w-5" />}
                >
                  Add Photos
                </Button>
              </label>

              <label className="cursor-pointer">
                <Input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                />
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<Video className="h-5 w-5" />}
                >
                  Add Videos
                </Button>
              </label>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Share up to 10 photos and videos in your story
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {media.map((item, index) => (
              <div
                key={index}
                className="group relative aspect-[9/16] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt="Story preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="h-full w-full object-cover"
                  />
                )}

                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/50 via-transparent to-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={() => handleRemoveMedia(index)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="p-2">
                    <Textarea
                      value={item.text}
                      onChange={(e) => handleTextChange(index, e.target.value)}
                      placeholder="Add text to your story..."
                      className="resize-none bg-transparent text-white placeholder-white/70"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}

            {media.length < 10 && (
              <label className="flex aspect-[9/16] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                <Input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                />
                <Upload className="h-8 w-8 text-gray-400" />
              </label>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}