import axios from "axios";
import {OPENAI_API_KEY} from "@env"

const callOpenAI = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7, // Adjust creativity level
        max_tokens: 200, // Limit response length
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return "Sorry, I couldn't process that request.";
  }
};

export default callOpenAI;
