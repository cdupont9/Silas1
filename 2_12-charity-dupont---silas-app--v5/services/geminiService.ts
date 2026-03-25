import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const generateSmartResponse = async (query: string, context: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      tools: [{ googleSearchRetrieval: {} }], 
    });

    const result = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: [{ text: `Context: ${context}. Query: ${query}. Use Google Search for raw data.` }] 
      }]
    });

    const response = await result.response;
    return response.text() || "I couldn't find anything.";
  } catch (error) {
    console.error("Search Error:", error);
    return "Silas is offline.";
  }
};
