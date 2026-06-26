// backend/src/controllers/chatbotController.js

// FIX: Destructure askGemini directly from the required service file
const { askGemini } = require("../services/geminiService");

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // This will now execute correctly
    const reply = await askGemini(message);

    res.json({
      success: true,
      reply,
    });
  } catch (err) {
  console.error("Gemini Error:", err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
}
};