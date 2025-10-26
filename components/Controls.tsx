
import React from 'react';
import { ART_STYLES } from '../constants';
import { ArtStyle } from '../types';

interface ControlsProps {
  onFileChange: (file: File) => void;
  songTitle: string;
  onSongTitleChange: (title: string) => void;
  selectedStyle: string;
  onStyleChange: (styleId: string) => void;
  onGenerateImages: () => void;
  isGenerating: boolean;
  hasAudioFile: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  onFileChange,
  songTitle,
  onSongTitleChange,
  selectedStyle,
  onStyleChange,
  onGenerateImages,
  isGenerating,
  hasAudioFile,
}) => {
  const isGenerateButtonDisabled = !hasAudioFile || !songTitle.trim() || isGenerating;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-lg shadow-xl mb-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-extrabold text-white mb-6 text-center">MP3 & Style Selection</h2>

      {/* MP3 Upload */}
      <div className="mb-6">
        <label htmlFor="mp3-upload" className="block text-lg font-semibold text-blue-100 mb-2">Upload MP3 File:</label>
        <input
          type="file"
          id="mp3-upload"
          accept="audio/mp3"
          onChange={(e) => e.target.files && onFileChange(e.target.files[0])}
          className="block w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
      </div>

      {/* Song Title Input */}
      <div className="mb-6">
        <label htmlFor="song-title" className="block text-lg font-semibold text-blue-100 mb-2">Song Title (for image generation):</label>
        <input
          type="text"
          id="song-title"
          value={songTitle}
          onChange={(e) => onSongTitleChange(e.target.value)}
          placeholder="Enter song title (e.g., 'A whimsical forest journey')"
          className="w-full p-3 rounded-lg bg-indigo-700 border border-blue-500 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-colors duration-200"
        />
      </div>

      {/* Art Style Selection */}
      <div className="mb-8">
        <p className="block text-lg font-semibold text-blue-100 mb-4">Choose an Art Style:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {ART_STYLES.map((style: ArtStyle) => (
            <label key={style.id} className="flex items-center space-x-3 cursor-pointer p-3 bg-indigo-800 rounded-lg border border-indigo-700 hover:border-blue-400 transition-all duration-200">
              <input
                type="radio"
                name="art-style"
                value={style.id}
                checked={selectedStyle === style.id}
                onChange={() => onStyleChange(style.id)}
                className="form-radio h-5 w-5 text-blue-400 transition-colors duration-200 focus:ring-blue-300"
              />
              <span className="text-white text-base font-medium">{style.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Generate Images Button */}
      <div className="flex justify-center">
        <button
          onClick={onGenerateImages}
          disabled={isGenerateButtonDisabled}
          className={`px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 transform ${
            isGenerateButtonDisabled
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
              : 'bg-blue-400 text-indigo-900 hover:bg-blue-300 active:scale-95 shadow-lg hover:shadow-xl'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            'Generate Slideshow Images'
          )}
        </button>
      </div>
    </div>
  );
};

export default Controls;
