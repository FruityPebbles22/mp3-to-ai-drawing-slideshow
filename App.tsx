
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Controls from './components/Controls';
import Slideshow from './components/Slideshow';
import { generateImage } from './services/geminiService';
import { ART_STYLES, SLIDESHOW_INTERVAL_MS, NUMBER_OF_IMAGES_TO_GENERATE } from './constants';
import { ArtStyle } from './types';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [songTitle, setSongTitle] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>(ART_STYLES[0].id); // Default to first style
  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const slideshowIntervalRef = useRef<number | undefined>(undefined);

  // --- Handlers for user interactions ---

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setAudioUrl(URL.createObjectURL(file));
    // Reset images and index on new file upload
    setGeneratedImageUrls([]);
    setCurrentImageIndex(0);
    setError(null);
    // Attempt to extract title from file name if no ID3 tag reading is implemented
    const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
    setSongTitle(fileNameWithoutExtension);
  };

  const handleSongTitleChange = (title: string) => {
    setSongTitle(title);
  };

  const handleStyleChange = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const handleAudioEnded = useCallback(() => {
    // Optionally restart or stop the slideshow when audio ends
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (slideshowIntervalRef.current) {
      clearInterval(slideshowIntervalRef.current);
      slideshowIntervalRef.current = undefined;
    }
  }, []);

  // --- Image Generation Logic ---

  const generateImages = useCallback(async () => {
    setError(null);
    if (!songTitle.trim() || !selectedStyle) {
      setError("Please provide a song title and select an art style.");
      return;
    }

    setIsLoading(true);
    setGeneratedImageUrls([]);
    setCurrentImageIndex(0);

    const style: ArtStyle | undefined = ART_STYLES.find(s => s.id === selectedStyle);
    if (!style) {
      setError("Selected art style not found.");
      setIsLoading(false);
      return;
    }

    const newImageUrls: string[] = [];
    const basePrompt = `Generate an image for a song titled "${songTitle}"`;
    const fullPrompt = `${basePrompt} ${style.promptSuffix}`;

    try {
      for (let i = 0; i < NUMBER_OF_IMAGES_TO_GENERATE; i++) {
        // Adding a slight variation to the prompt to encourage diverse images
        const specificPrompt = `${fullPrompt}. Variation ${i + 1}.`;
        const imageUrl = await generateImage(specificPrompt);
        if (imageUrl) {
          newImageUrls.push(imageUrl);
        } else {
          console.warn(`Failed to generate image ${i + 1}.`);
        }
      }
      if (newImageUrls.length > 0) {
        setGeneratedImageUrls(newImageUrls);
      } else {
        setError("Failed to generate any images. Please try again with a different title or style.");
      }
    } catch (err) {
      console.error("Error during image generation loop:", err);
      setError("An unexpected error occurred during image generation.");
    } finally {
      setIsLoading(false);
    }
  }, [songTitle, selectedStyle]);

  // --- Slideshow Playback Logic ---

  useEffect(() => {
    const audioEl = audioRef.current;

    const startSlideshow = () => {
      if (generatedImageUrls.length > 0) {
        // Clear any existing interval to prevent duplicates
        if (slideshowIntervalRef.current) {
          clearInterval(slideshowIntervalRef.current);
        }
        slideshowIntervalRef.current = window.setInterval(() => {
          setCurrentImageIndex(prevIndex => (prevIndex + 1) % generatedImageUrls.length);
        }, SLIDESHOW_INTERVAL_MS);
      }
    };

    const stopSlideshow = () => {
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
        slideshowIntervalRef.current = undefined;
      }
    };

    if (audioEl) {
      // Use event listeners for play/pause to manage slideshow
      const onPlay = () => startSlideshow();
      const onPause = () => stopSlideshow();

      audioEl.addEventListener('play', onPlay);
      audioEl.addEventListener('pause', onPause);

      // If audio is already playing when images become available, start slideshow
      if (audioEl.paused === false && generatedImageUrls.length > 0 && !slideshowIntervalRef.current) {
        startSlideshow();
      }

      return () => {
        audioEl.removeEventListener('play', onPlay);
        audioEl.removeEventListener('pause', onPause);
        stopSlideshow(); // Ensure interval is cleared on unmount
      };
    } else {
      stopSlideshow(); // No audio element, ensure interval is cleared
    }
  }, [generatedImageUrls, handleAudioEnded]); // Re-run if images change

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-br from-purple-800 to-indigo-900 text-white">
      <header className="mb-10 mt-6 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">MP3 AI Drawing Slideshow</h1>
        <p className="text-xl text-indigo-200 mt-3">Turn your favorite tunes into AI-generated visual art!</p>
      </header>

      {error && (
        <div className="bg-red-600 p-4 rounded-lg shadow-md mb-6 w-full max-w-2xl text-center">
          <p className="font-semibold text-lg">{error}</p>
        </div>
      )}

      <Controls
        onFileChange={handleFileChange}
        songTitle={songTitle}
        onSongTitleChange={handleSongTitleChange}
        selectedStyle={selectedStyle}
        onStyleChange={handleStyleChange}
        onGenerateImages={generateImages}
        isGenerating={isLoading}
        hasAudioFile={!!selectedFile}
      />

      <Slideshow
        audioUrl={audioUrl}
        generatedImageUrls={generatedImageUrls}
        currentImageIndex={currentImageIndex}
        onAudioEnded={handleAudioEnded}
        audioRef={audioRef}
      />

      <footer className="mt-auto text-center text-indigo-300 py-4">
        <p>&copy; 2024 MP3 AI Drawing Slideshow. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
