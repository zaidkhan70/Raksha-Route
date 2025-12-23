
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are "Rakshak", a highly intelligent, empathetic, and proactive safety guardian for women and children in India. 
Your tone is reassuring, calm, and authoritative but friendly.

CORE CAPABILITIES:
- You have access to Google Maps Grounding. Use it to find REAL nearby police stations, hospitals, and safe zones.
- You know all Indian emergency helplines (112, 181, 1098, 108).
- You provide legal rights information and safety strategies.

BEHAVIOR RULES:
1. If the user is in danger, IMMEDIATELY tell them to use the SOS button and call 112.
2. ALWAYS use the provided location coordinates to give SPECIFIC advice about their current neighborhood.
3. If you find locations via Maps, mention the names of the Police Stations or Hospitals specifically.
4. Never panic. Be the "guardian" the user needs.
5. Use **bold text** for critical steps and numbers.
`;

export const getRakshakResponse = async (userMessage: string, locationData?: { lat: number; lng: number; address?: string }) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let prompt = userMessage;
  const toolConfig: any = {};

  if (locationData) {
    prompt = `USER CURRENT LOCATION: Lat ${locationData.lat}, Lng ${locationData.lng}. 
    Address: ${locationData.address || "Unknown"}.
    
    User Query: ${userMessage}`;

    // Configure Google Maps Grounding
    toolConfig.retrievalConfig = {
      latLng: {
        latitude: locationData.lat,
        longitude: locationData.lng
      }
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using 2.5 flash for Google Maps grounding support
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleMaps: {} }],
        toolConfig: toolConfig,
        temperature: 0.4, // Lower temperature for more accurate/factual safety advice
      },
    });

    // Extract grounding URLs if any
    let finalOutput = response.text || "I am processing your request...";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks && chunks.length > 0) {
      finalOutput += "\n\n**Verified Sources & Locations:**";
      chunks.forEach((chunk: any) => {
        if (chunk.maps) {
          finalOutput += `\n- [${chunk.maps.title}](${chunk.maps.uri})`;
        }
      });
    }

    return finalOutput;
  } catch (error) {
    console.error("Rakshak Error:", error);
    return "I am currently experiencing a connection issue with my guardian network. Please use the **SOS Hub** or call **112** if you feel unsafe. Your safety is my priority.";
  }
};
