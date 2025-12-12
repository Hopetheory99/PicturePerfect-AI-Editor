
import { GoogleGenAI, GenerateContentResponse, Part, GenerateContentParameters } from "@google/genai";
import { MODEL_EDIT_IMAGE, MODEL_GENERATE_IMAGE, MODEL_ANALYZE, MODEL_FAST } from '../constants.tsx';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const dataUrlToGeminiPart = (dataUrl: string): Part => {
  const [header, base64Data] = dataUrl.split(',');
  if (!header || !base64Data) {
    throw new Error('Invalid data URL format');
  }
  const mimeTypeMatch = header.match(/data:(.*);base64/);
  if (!mimeTypeMatch || !mimeTypeMatch[1]) {
    throw new Error('Could not extract MIME type from data URL');
  }
  const mimeType = mimeTypeMatch[1];
  return {
    inlineData: {
      mimeType,
      data: base64Data,
    },
  };
};

const extractImageFromResponse = (response: GenerateContentResponse): string => {
  const candidates = response.candidates;
  if (!candidates || candidates.length === 0 || !candidates[0].content || !candidates[0].content.parts) {
    throw new Error("No content returned from AI or invalid response structure.");
  }

  // Iterate to find image part
  for (const part of candidates[0].content.parts) {
    if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
       return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  
  // Fallback if no image found
  console.warn("AI did not return an image directly. Response:", response);
  throw new Error("AI did not return an image. It might have responded with text: " + (response.text || "No text found."));
};

// INPAINT: Uses Mask + Image + Prompt. Using gemini-2.5-flash-image
const inpaintImage = async (
  originalImageDataUrl: string,
  maskDataUrl: string,
  userTextPrompt: string,
  nsfwAllowed: boolean
): Promise<string> => {
  try {
    const originalImagePart = dataUrlToGeminiPart(originalImageDataUrl);
    const maskImagePart = dataUrlToGeminiPart(maskDataUrl);

    let prompt = `Inpaint the image based on the mask and the following instruction: ${userTextPrompt}. The mask (second image) indicates the area to change (white pixels).`;
    if (nsfwAllowed) prompt += " NSFW content is allowed if requested.";

    const response = await ai.models.generateContent({
      model: MODEL_EDIT_IMAGE,
      contents: {
        parts: [
            originalImagePart,
            maskImagePart,
            { text: prompt }
        ]
      }
    });

    return extractImageFromResponse(response);
  } catch (error: any) {
    console.error("Inpaint Error:", error);
    throw new Error(error.message || "Inpainting failed.");
  }
};

// EDIT: Uses Image + Prompt (No Mask). Nano banana powered (gemini-2.5-flash-image)
const editImage = async (
  originalImageDataUrl: string,
  userTextPrompt: string
): Promise<string> => {
  try {
    const originalImagePart = dataUrlToGeminiPart(originalImageDataUrl);
    
    const response = await ai.models.generateContent({
      model: MODEL_EDIT_IMAGE,
      contents: {
        parts: [
          originalImagePart,
          { text: userTextPrompt }
        ]
      }
    });

    return extractImageFromResponse(response);
  } catch (error: any) {
    console.error("Edit Image Error:", error);
    throw new Error(error.message || "Image editing failed.");
  }
};

// GENERATE: Uses Prompt + Config. Nano Banana Pro (gemini-3-pro-image-preview)
const generateImage = async (
  prompt: string,
  size: '1K' | '2K' | '4K'
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_GENERATE_IMAGE,
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1" // Defaulting to square
        }
      }
    });

    return extractImageFromResponse(response);
  } catch (error: any) {
    console.error("Generate Image Error:", error);
    throw new Error(error.message || "Image generation failed.");
  }
};

// ANALYZE: Uses Image + Prompt. gemini-3-pro-preview
const analyzeImage = async (
  imageDataUrl: string,
  prompt: string = "Describe this image in detail."
): Promise<string> => {
  try {
    const imagePart = dataUrlToGeminiPart(imageDataUrl);
    const response = await ai.models.generateContent({
      model: MODEL_ANALYZE,
      contents: {
        parts: [imagePart, { text: prompt }]
      }
    });
    return response.text || "No analysis available.";
  } catch (error: any) {
    console.error("Analyze Image Error:", error);
    throw new Error(error.message || "Image analysis failed.");
  }
};

// FAST RESPONSE: Uses Image + Prompt. gemini-2.5-flash-lite
const quickAnalyzeImage = async (
  imageDataUrl: string,
  prompt: string = "Quickly describe this image."
): Promise<string> => {
  try {
    const imagePart = dataUrlToGeminiPart(imageDataUrl);
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: {
        parts: [imagePart, { text: prompt }]
      }
    });
    return response.text || "No description available.";
  } catch (error: any) {
    console.error("Fast Response Error:", error);
    throw new Error(error.message || "Quick analysis failed.");
  }
};

export const geminiService = {
  inpaintImage,
  editImage,
  generateImage,
  analyzeImage,
  quickAnalyzeImage
};
