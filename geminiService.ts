
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from './types';

export const analyzeFoodImage = async (base64Image: string): Promise<NutritionData> => {
  /**
   * Requirement: API key must be obtained from process.env.API_KEY.
   * In modern browser environments and bundlers (Vite, Webpack, Vercel), 
   * 'process.env.API_KEY' is often replaced with a static string during build.
   */
  let apiKey: string | undefined;
  
  try {
    // Standard Node/Bundler approach
    apiKey = process.env.API_KEY;
  } catch (e) {
    // Fallback for environments where 'process' is not defined
    apiKey = (window as any).process?.env?.API_KEY || (window as any).API_KEY;
  }

  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey === 'undefined' || apiKey === '') {
    throw new Error("Missing Gemini API Key. Please ensure 'API_KEY' is set in your Vercel environment variables and that you have triggered a NEW deployment.");
  }

  // Initialize client right before making the call to ensure the latest key is used.
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image,
            },
          },
          {
            text: "You are a Vedic Nutritionist. Identify the food in this image. Provide: Name, Estimated Calories (number), Protein (number), Carbs (number), and Fats (number). Format as a clean JSON object. Focus on wholesome, sattvic descriptions if applicable."
          }
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Common name of the food' },
            calories: { type: Type.NUMBER, description: 'Estimated calories in kcal' },
            protein: { type: Type.NUMBER, description: 'Estimated protein in grams' },
            carbs: { type: Type.NUMBER, description: 'Estimated carbohydrates in grams' },
            fats: { type: Type.NUMBER, description: 'Estimated fats in grams' },
          },
          required: ["name", "calories", "protein", "carbs", "fats"],
        }
      },
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("Analysis yielded no results. Please try another photo.");
    
    return JSON.parse(jsonStr) as NutritionData;
  } catch (err: any) {
    console.error("Gemini Analysis Failure:", err);
    throw new Error(err.message || "An unexpected error occurred during food analysis.");
  }
};
