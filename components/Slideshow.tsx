
import React from 'react';

interface SlideshowProps {
  audioUrl: string;
  generatedImageUrls: string[];
  currentImageIndex: number;
  onAudioEnded: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const Slideshow: React.FC<SlideshowProps> = ({
  audioUrl,
  generatedImageUrls,
  currentImageIndex,
  onAudioEnded,
  audioRef,
}) => {
  const currentImageUrl = generatedImageUrls[currentImageIndex];
  const hasImages = generatedImageUrls.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-900 rounded-lg shadow-xl overflow-hidden mb-8">
      {/* Slideshow Display */}
      <div className="relative w-full aspect-video bg-gray-800 flex items-center justify-center rounded-t-lg">
        {hasImages ? (
          <img
            key={currentImageIndex} // Key to trigger CSS transition on image change
            src={currentImageUrl}
            alt="AI Generated Slideshow Image"
            className="w-full h-full object-contain transition-opacity duration-1000 ease-in-out opacity-100"
            style={{ viewTransitionName: `slideshow-image-${currentImageIndex}` }} // For potential future native view transitions
          />
        ) : (
          <p className="text-gray-400 text-lg p-4 text-center">
            {audioUrl ? "No images generated yet. Click 'Generate Slideshow Images'!" : "Upload an MP3 and generate images to start the slideshow."}
          </p>
        )}
      </div>

      {/* Audio Player */}
      <div className="p-4 bg-gray-800 rounded-b-lg">
        {audioUrl ? (
          <audio
            ref={audioRef}
            src={audioUrl}
            controls
            onEnded={onAudioEnded}
            className="w-full"
          >
            Your browser does not support the audio element.
          </audio>
        ) : (
          <p className="text-gray-400 text-center">No audio file loaded.</p>
        )}
      </div>
    </div>
  );
};

export default Slideshow;
