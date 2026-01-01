
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from './types';

export const analyzeFoodImage = async (base64Image: string): Promise<NutritionData> => {
  // Use the API key directly from process.env.API_KEY as required by bundlers
  if (!process.env.API_KEY) {
    throw new Error("Missing Gemini API Key. Ensure the environment variable 'API_KEY' is set in your deployment platform.");
  }

  // Initialize client using the specific pattern required for injection
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
