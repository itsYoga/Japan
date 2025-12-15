const apiKey = import.meta.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY || 'DEMO_KEY';

export const getGuideTips = async (location: string, description: string): Promise<string> => {
  if (apiKey === 'DEMO_KEY' || !apiKey) {
    return "💡 [AI 導遊]: 記得這是演示模式。請在環境變數中設定 VITE_GROQ_API_KEY 以獲得真實的 Groq 建議！\n\n[必吃] 建議嘗試當地特色料理\n[必買] 可以購買一些紀念品\n[攻略] 穿著舒適的鞋子並準備相機，享受這個美麗的地點！";
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

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "暫無資訊";
  } catch (error) {
    console.error("Groq API Error:", error);
    return "⚠️ 無法連線到 AI 導遊，請稍後再試。";
  }
};

