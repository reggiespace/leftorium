
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateSouthpawIdea = async (problem: string) => {
  if (!process.env.API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a funny, creative, and slightly absurd "fake" product for left-handed people that solves this problem: "${problem}". Provide a product name, a catchy tagline, and three key features.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            tagline: { type: Type.STRING },
            features: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["name", "tagline", "features"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating idea:", error);
    return null;
  }
};
