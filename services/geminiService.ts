
import { GoogleGenAI, Type } from "@google/genai";
import { FishAnalysisResult } from "../types";

// Initialize AI safely
let ai: GoogleGenAI;
try {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
} catch (error) {
    console.error("Gemini AI Initialization Error:", error);
}

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const identifyFish = async (base64Image: string, mimeType: string): Promise<FishAnalysisResult> => {
  if (!ai) throw new Error("AI service not initialized");
  const model = "gemini-2.5-flash";

  const prompt = `Analyze this image of a fish. 
  Identify the species. 
  Return a JSON object with the following schema:
  {
    "name": "Common Name in Chinese",
    "scientificName": "Scientific Name",
    "edibility": "Edibility rating (1-5 stars) and simple cooking suggestion",
    "description": "Brief description of habitat and habits (in Chinese)",
    "isProtected": boolean (true if it is a protected species in China)
  }`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
            {
                inlineData: {
                    data: base64Image,
                    mimeType: mimeType
                }
            },
            {
                text: prompt
            }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                scientificName: { type: Type.STRING },
                edibility: { type: Type.STRING },
                description: { type: Type.STRING },
                isProtected: { type: Type.BOOLEAN }
            }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as FishAnalysisResult;
    }
    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Fish ID Error:", error);
    throw error;
  }
};

export const getFishingAdvice = async (query: string): Promise<string> => {
    if (!ai) return "AI 服务暂不可用，请检查配置。";
    const model = "gemini-2.5-flash";
    const systemInstruction = "你是一位经验丰富的老钓手，擅长台钓、路亚和海钓。请用幽默、鼓励的口吻回答用户的钓鱼问题。回答要专业且简洁。";
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: query,
            config: {
                systemInstruction: systemInstruction,
            }
        });
        return response.text || "抱歉，我现在有点晕船，请稍后再问。";
    } catch (error) {
        console.error("Advice Error:", error);
        return "网络连接不佳，无法获取建议。";
    }
}
