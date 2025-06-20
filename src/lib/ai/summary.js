
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateSummary = async (text) => {
    const response = await groq.chat.completions.create({
        "messages": [
            {
                "role": "system",
                "content": "Create a concise summary focusing on key concepts, findings, and conclusions. Maintain technical accuracy."
            },
            {
                "role": "user",
                "content": text
            }
        ],
        "model": "llama-3.3-70b-versatile",
        "temperature": 1,
        "max_completion_tokens": 1024,
        "top_p": 1,
        "stream": false,
        "stop": null
    });
    return response.choices[0]?.message?.content || "";
};