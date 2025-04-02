// api/openai.js
import axios from "axios";

const OPENAI_API_KEY = "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"; // <-- TEMP: hardcoded for development

const callOpenAI = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI:", error.response?.data || error.message);
    return "Sorry, I couldn't process that request.";
  }
};

export default callOpenAI;
