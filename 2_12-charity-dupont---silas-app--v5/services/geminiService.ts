import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Setup the Brain
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * SMART RESPONSE - This fills the "Gaps" using Google Search Grounding.
 * Exactly like the toggle in AI Studio.
 */
export const generateSmartResponse = async (query: string, context: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", 
      // This is the magic "Search" tool from AI Studio
      tools: [{ googleSearchRetrieval: {} }], 
    });

    const result = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: [{ text: `Context: ${context}. User Query: ${query}. Use Google Search to fill in any gaps with raw, real-time data.` }] 
      }]
    });

    const response = await result.response;
    return response.text() || "I couldn't find anything.";
  } catch (error) {
    console.error("Search Grounding Error:", error);
    return "Silas is having trouble reaching the live web.";
  }
};

/**
 * VOICE COMMAND PARSER - Uses Search to decide actions.
 */
export const parseVoiceCommand = async (transcript: string, context: string): Promise<any> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      tools: [{ googleSearchRetrieval: {} }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Analyze: "${transcript}". Context: ${context}. If you need facts or weather, SEARCH GOOGLE. 
    Return JSON ONLY: { "type": "SEARCH", "payload": {}, "reply": "Found it." }`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (e) {
    return { type: 'NONE', payload: {}, reply: "Connection error." };
  }
};
