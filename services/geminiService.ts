
import { GoogleGenAI } from "@google/genai";
import { WritingEntry } from "../types";

export const generateWritingInsight = async (entries: WritingEntry[]): Promise<string> => {
  if (entries.length === 0) return "还没有任何写作记录，快去码字吧！";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0);
  
  const dataSummary = entries.map(e => {
    let detail = `${e.month}: 《${e.title}》 (${e.wordCount}字)`;
    if (e.isSerial) {
      detail += ` [连载中${e.chapters ? `, ${e.chapters}` : ''}]`;
      if (e.isFinished) detail += ` [已完结!!!]`;
    }
    return detail;
  }).join('\n');

  const prompt = `
    我是一名小说作者。这是我最近的创作清单：
    ${dataSummary}
    总计：${totalWords} 字。

    请你以一个“文学咖啡馆老板”或者“温柔的编辑”的身份，给我的这张“写作小票”写一段简短、幽默且富有鼓励性的评语（100字以内）。
    如果清单中有作品“已完结”，请务必给予最高规格的热烈祝贺！
    请直接输出评语，不要带任何开场白或解释。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "你的才华如泉涌，继续加油！";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "系统忙着看你的大作，暂时无法评价，但你的努力已被宇宙记录！";
  }
};
