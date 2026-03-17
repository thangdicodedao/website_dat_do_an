import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { cn } from '../../utils';

interface ProductGalleryProps {
  images: string[];
  video?: string;
}

export default function ProductGallery({ images, video }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setShowVideo(false);
    setIsVideoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setShowVideo(false);
    setIsVideoPlaying(false);
  };

  const handleVideoClick = () => {
    setShowVideo(true);
  };

  const toggleVideoPlay = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  return (
    <div className="space-y-4">
      {/* Main Image/Video */}
      <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        {!showVideo ? (
          <img
            src={images[currentIndex]}
            alt="Product"
            className="w-full h-full object-cover"
          />
        ) : video ? (
          <iframe
            src={isVideoPlaying ? video : video.replace('watch?v=', 'embed/')}
            title="Product Video"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : null}

        {/* Navigation Arrows */}
        {images.length > 1 && !showVideo && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Video Toggle */}
        {video && !showVideo && (
          <button
            onClick={handleVideoClick}
            className="absolute bottom-4 right-4 p-3 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors"
          >
            <Play className="w-6 h-6" />
          </button>
        )}

        {/* Video Controls */}
        {showVideo && video && (
          <button
            onClick={toggleVideoPlay}
            className="absolute bottom-4 right-4 p-3 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors"
          >
            {isVideoPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
        )}

        {/* Image Indicators */}
        {images.length > 1 && !showVideo && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setShowVideo(false);
                }}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentIndex
                    ? 'bg-orange-500 w-6'
                    : 'bg-white/70 hover:bg-white'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {!showVideo && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setShowVideo(false);
              }}
              className={cn(
                'w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all',
                index === currentIndex
                  ? 'border-orange-500'
                  : 'border-transparent hover:border-gray-300'
              )}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
          {video && (
            <button
              onClick={handleVideoClick}
              className={cn(
                'w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 flex items-center justify-center bg-gray-100',
                showVideo ? 'border-orange-500' : 'border-transparent hover:border-gray-300'
              )}
            >
              <Play className="w-8 h-8 text-orange-500" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
