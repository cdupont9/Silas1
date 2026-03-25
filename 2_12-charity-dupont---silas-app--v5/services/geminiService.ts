import { GoogleGenerativeAI } from "@google/generative-ai";

// Safe access to environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// Helper to get the model consistently
const getModel = (modelName: string = "gemini-3-flash-preview", useSearch: boolean = false) => {
  return genAI.getGenerativeModel({
    model: modelName,
    tools: useSearch ? [{ googleSearch: {} }] : undefined,
  });
};

export const generateSmartResponse = async (query: string, context: string): Promise<string> => {
  try {
    const model = getModel("gemini-3-flash-preview", true);
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Context: ${context}. User Query: ${query}. Keep the answer short (under 20 words).` }] }]
    });
    return result.response.text() || "I couldn't think of anything.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection error.";
  }
};

export const parseVoiceCommand = async (transcript: string, context: string, lastQuestion?: string): Promise<any> => {
  try {
    const model = getModel();
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `
        You are Silas, a fast intelligent assistant.
        User Context: ${context}
        User said: "${transcript}"
        Last Question: ${lastQuestion || "None"}
        
        LOGIC:
        1. Weather -> Action=WEATHER.
        2. "Show me" receipt -> Describe item, store, price.
        3. Location change -> Action=SET_LOCATION.
        
        Return JSON ONLY:
        { "type": "ACTION", "payload": {}, "reply": "Short response.", "followUpQuestion": "Optional" }
      ` }] }],
      generationConfig: { responseMimeType: "application/json" }
    });
    return JSON.parse(result.response.text());
  } catch (e) {
    console.error("Silas Voice Error", e);
    return { type: 'NONE', payload: {}, reply: "I'm having trouble connecting." };
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const model = getModel("gemini-3-flash-image-preview");
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Professional fashion photography, ${prompt}, high quality.` }] }],
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
    const model = getModel();
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Generate valid JSON weather for ${location}. { "temp": 72, "condition": "Sunny" }` }] }],
      generationConfig: { responseMimeType: "application/json" }
    });
    return JSON.parse(result.response.text());
  } catch (error) {
    return null;
  }
};

// ... (Rest of your functions like getFashionAdvice follow the same pattern)
