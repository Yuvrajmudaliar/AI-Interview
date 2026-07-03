import axios from "axios";

export const askAi = async (messages) => {
  try {
    console.time("OpenRouter Response");

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
  model: "openai/gpt-4o-mini",
  messages,
  max_tokens: 250,
  temperature: 0.3
},
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_APIKEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.timeEnd("OpenRouter Response");

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("OpenRouter API Error");
  }
};