// backend/src/services/geminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the SDK with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function askGemini(message) {
  try {
    // FIX: Explicitly request the latest stable gemini-1.5-flash model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(message);
    
    if (!result || !result.response) {
      throw new Error("Empty response received from Gemini API");
    }

    return result.response.text();
  } catch (error) {
    console.error("Error inside askGemini service:", error);
    throw error;
  }
}

module.exports = { askGemini };