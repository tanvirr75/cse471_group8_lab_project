const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API client
// The API key is securely loaded from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// We will expSort a configured model instance, usually 'gemini-1.5-pro' or 'gemini-1.5-flash'
// based on the task (resume analysis vs quick generation).
const getGeminiModel = (modelName = 'gemini-3.5-flash-lite') => {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not defined in the environment variables");
  }
  return genAI.getGenerativeModel({ model: modelName });
};

module.exports = {
  getGeminiModel,
};
