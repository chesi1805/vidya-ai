import { Router } from "express";
import Groq from "groq-sdk";
import { config } from "../config.js";
import { requireAuth } from "../middleware/auth.js";

export const chatRouter = Router();

chatRouter.use(requireAuth);

const groq = new Groq({
  apiKey: config.groqApiKey,
});

const SYSTEM_PROMPT =
  "You are Vidya, a warm, encouraging AI tutor for school students. Explain concepts simply with small examples. Keep answers under 150 words unless the student asks for more detail. Always be friendly and encouraging.";

chatRouter.post("/", async (req, res, next) => {
  try {
    if (!config.groqApiKey) {
      return res.status(500).json({
        error: "Server is missing GROQ_API_KEY. Add it to backend/.env",
      });
    }

    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "messages must be a non-empty array",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...messages.map((m) => ({
          role: m.role,
          content: m.text,
        })),
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    res.json({
      text:
        completion.choices[0]?.message?.content ||
        "Sorry, I couldn't generate a response.",
    });
  } catch (err) {
    console.error("Groq Error:", err);
    next(err);
  }
});