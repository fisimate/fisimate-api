import { GoogleGenerativeAI } from "@google/generative-ai";
import configs from "../configs/index.js";

const googleAI = new GoogleGenerativeAI(configs.geminiAPIKey);

const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export default geminiModel;
