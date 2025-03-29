import axios from "axios";
const OPENAI_API_KEY = "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"; 

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
