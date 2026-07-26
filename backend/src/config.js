import "dotenv/config";

export const config = {
  port: process.env.PORT || 4001,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5174",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",

  groqApiKey: process.env.GROQ_API_KEY || "",
}