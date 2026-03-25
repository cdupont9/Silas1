import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const generateSmartResponse = async (query: string, context: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      tools: [{ googleSearch: {} }],
    });

    const result = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: [{ text: `Context: ${context}. User Query: ${query}. Keep the answer short (under 20 words).` }] 
      }]
    });

    const response = await result.response;
    return response.text() || "I couldn't think of anything.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection error.";
  }
};

export const parseVoiceCommand = async (transcript: string, context: string, lastQuestion?: string): Promise<any> => {
  try {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        generationConfig: { responseMimeType: "application/json" }
    });
    
    const prompt = `
        You are Silas, an intelligent assistant.
        Context: ${context}
        User said: "${transcript}"
        Last Question: ${lastQuestion || "None"}
        
        Return JSON ONLY:
        { "type": "ACTION", "payload": {}, "reply": "Short response." }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (e) {
    console.error("Silas Voice Error", e);
    return { type: 'NONE', payload: {}, reply: "I'm having trouble connecting." };
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-image-preview" });
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"] }
    });
    const part = result.response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    return part ? `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` : null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};

export const getWeather = async (location: string): Promise<any> => {
  try {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        generationConfig: { responseMimeType: "application/json" }
    });
    const result = await model.generateContent(`Return JSON weather for ${location}: { "temp": 72, "condition": "Sunny" }`);
    return JSON.parse(result.response.text());
  } catch (error) {
    return null;
  }
};
