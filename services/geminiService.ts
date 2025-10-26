
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available from environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable is not set.");
  // In a real application, you might want to throw an error or handle this more gracefully.
  // For this exercise, we'll proceed but generation calls will likely fail.
}

/**
 * Initializes a new GoogleGenAI instance.
 * This is done on demand to ensure the latest API key from `process.env.API_KEY` is used.
 */
function getGeminiClient() {
  if (!API_KEY) {
    throw new Error("Gemini API Key is not configured. Please set process.env.API_KEY.");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
}

/**
 * Generates an image based on a text prompt and an optional aspect ratio.
 * Uses the 'imagen-4.0-generate-001' model for high-quality image generation.
 * @param prompt The text prompt describing the image to generate.
 * @param aspectRatio The desired aspect ratio (e.g., '1:1', '16:9'). Defaults to '1:1'.
 * @returns A base64 encoded image URL or null if generation fails.
 */
export async function generateImage(
  prompt: string,
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' = '1:1'
): Promise<string | null> {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1, // Generate one image at a time
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    const base64ImageBytes: string | undefined = response.generatedImages[0]?.image?.imageBytes;

    if (base64ImageBytes) {
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      console.error("No image data received from API.");
      return null;
    }
  } catch (error) {
    console.error("Error generating image from Gemini API:", error);
    // You might want to check for specific error messages for API key issues
    if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
      console.error("API key issue or model not found. Please check your API key and model access.");
    }
    return null;
  }
}
