"use server";
import OpenAI from "openai";

const openai = new OpenAI();

export const getOpenAISummary = async (dpeData) => {
  const prompt = `Please provide a summary of the following DPE information in french: ${JSON.stringify(dpeData)}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "developer", content : prompt}],
      max_tokens: 5000,
    });
    console.log('OpenAI response:', response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching OpenAI summary:', error);
    throw error;
  }
};
