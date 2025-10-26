
import { ArtStyle } from './types';

export const ART_STYLES: ArtStyle[] = [
  { id: 'van-gogh', name: 'Van Gogh', promptSuffix: 'in the style of Van Gogh, thick impasto oil painting, starry night colors' },
  { id: 'furry', name: 'Furry', promptSuffix: 'as a furry art style character, vibrant, expressive, anthropomorphic' },
  { id: 'portrait', name: 'Portrait', promptSuffix: 'as a highly detailed artistic portrait painting, realistic textures' },
  { id: 'cartoon', name: 'Cartoon', promptSuffix: 'as a vibrant 2D cartoon drawing, clean lines, bold colors' },
  { id: 'crayon', name: 'Crayon', promptSuffix: 'as a children\'s crayon drawing, textured, bright colors, hand-drawn feel' },
  { id: 'pixel-art', name: 'Pixel Art', promptSuffix: 'as detailed pixel art, retro video game style, 8-bit aesthetic' },
  { id: 'cyberpunk', name: 'Cyberpunk', promptSuffix: 'as a cyberpunk art style illustration, neon lights, futuristic city, dark atmosphere' },
];

export const SLIDESHOW_INTERVAL_MS = 7000; // 7 seconds
export const NUMBER_OF_IMAGES_TO_GENERATE = 3;
