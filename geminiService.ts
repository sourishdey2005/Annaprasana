
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from './types';

export const analyzeFoodImage = async (base64Image: string): Promise<NutritionData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
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
          text: "You are a Vedic Nutritionist. Identify the food in this image. Provide: Name, Estimated Calories, Protein, Carbs, and Fats. Format as a clean JSON object. Focus on wholesome, sattvic descriptions if applicable."
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
  if (!jsonStr) throw new Error("Could not analyze image. Please try again.");
  
  return JSON.parse(jsonStr) as NutritionData;
};
