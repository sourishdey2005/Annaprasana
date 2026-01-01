
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from './types';

export const analyzeFoodImage = async (base64Image: string): Promise<NutritionData> => {
  // Directly initialize the AI client with the environment variable.
  // Vercel/Vite will replace 'process.env.API_KEY' with your actual key during the build process.
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
            text: "You are a Vedic Nutritionist. Identify the food in this image. Provide: Name, Estimated Calories, Protein, Carbs, and Fats. Format as a clean JSON object."
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
    if (!jsonStr) throw new Error("No data returned from analysis.");
    
    return JSON.parse(jsonStr) as NutritionData;
  } catch (err: any) {
    console.error("Gemini Analysis Failure:", err);
    throw new Error(err.message || "An unexpected error occurred during food analysis. Ensure your API_KEY is valid and your project is deployed.");
  }
};
