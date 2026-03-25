import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize with your Vercel Environment Variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * GENERATE SMART RESPONSE
 * This uses "googleSearch" as a Tool. This is exactly how AI Studio 
 * fills in "the gaps" for weather, news, and real-time facts.
 */
export const generateSmartResponse = async (query: string, context: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      // CRITICAL: This enables the "Search" button from AI Studio in your app
      tools: [{ googleSearch: {} }], 
    });

    const result = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: [{ 
          text: `You are Silas, a real-time assistant. 
                 Context: ${context}. 
                 User Query: ${query}. 
                 Use Google Search to find current, factual data to fill any gaps. 
                 Keep response under 25 words.` 
        }] 
      }]
    });

    return result.response.text();
  } catch (error) {
    console.error("Search Grounding Error:", error);
    return "Silas is having trouble reaching the live web.";
  }
};

/**
 * PARSE VOICE COMMAND
 * This uses the Search tool to decide which "Action" to take (Weather vs News).
 */
export const parseVoiceCommand = async (transcript: string, context: string): Promise<any> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      tools: [{ googleSearch: {} }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Analyze: "${transcript}"
      Context: ${context}
      If the user asks for info you don't have, SEARCH GOOGLE.
      Return JSON:
      {
        "type": "WEATHER" | "SEARCH" | "SET_LOCATION" | "NONE",
        "payload": { "query": "search terms", "location": "city" },
        "reply": "A brief summary of what you found."
      }
    `;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (e) {
    return { type: 'NONE', payload: {}, reply: "Connection error." };
  }
};
