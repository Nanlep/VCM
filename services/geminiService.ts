
import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const key = process.env.API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
};

export const generateStrategicGuidance = async (vision: string, objectives: string[]) => {
  const client = getClient();
  if (!client) throw new Error("API Key missing");

  const prompt = `
    Act as a Chief Strategy Officer.
    Vision: "${vision}"
    Objectives: "${objectives.join(', ')}"
    
    1. Critique this alignment.
    2. Suggest 3 concrete initiatives that would drive this vision forward.
    
    Format the output as JSON with keys: "critique" (string) and "suggestedInitiatives" (array of strings).
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error", error);
    throw error;
  }
};

export const refineText = async (text: string, type: 'vision' | 'objective') => {
  const client = getClient();
  if (!client) throw new Error("API Key missing");

  const prompt = `Rewrite the following corporate ${type} to be more inspiring, concise, and actionable: "${text}"`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error(error);
    return text; // Fallback
  }
};

export const generateVotingContext = async (vision: string, objectives: string[], initiativeName: string, initiativeDesc: string) => {
  const client = getClient();
  if (!client) return null;

  const prompt = `
    Context:
    Vision: "${vision}"
    Objectives: "${objectives.join('; ')}"
    
    Task:
    We are voting on an initiative called "${initiativeName}" (${initiativeDesc}).
    Provide a specific, critical question a voter should ask themselves for each of the 4 dimensions to ensure honest scoring.
    
    Dimensions:
    1. Importance (Impact on goals)
    2. Alignment (Fit with vision)
    3. Feasibility (Ease of execution)
    4. Urgency (Cost of delay)

    Format as JSON: { "importance": "...", "alignment": "...", "feasibility": "...", "urgency": "..." }
    Keep questions short, punchy, and provocative.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Tips Error", error);
    return null;
  }
};
