import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || 'DEMO_KEY';
const ai = new GoogleGenAI({ apiKey });

export const getGuideTips = async (location: string, description: string): Promise<string> => {
  if (apiKey === 'DEMO_KEY') {
    return "💡 [AI 導遊]: 記得這是演示模式。請在環境變數中設定 API_KEY 以獲得真實的 Gemini 建議！(不過對於這個地點，建議穿著舒適的鞋子並準備相機。)";
  }

  try {
    const prompt = `
      你是專業的日本旅遊導遊。
      地點: ${location}
      行程描述: ${description}
      
      請提供簡短的「導遊筆記」，請務必包含以下標籤：
      [必吃] : 推薦一道菜或餐廳
      [必買] : 推薦一個伴手禮
      [攻略] : 一句實用的建議或拍攝點
      
      請保持語氣活潑，適合年輕團體，字數控制在 100 字以內。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "暫無資訊";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "⚠️ 無法連線到 AI 導遊，請稍後再試。";
  }
};
