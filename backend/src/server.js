import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { authRouter } from "./routes/auth.routes.js";
import { subjectsRouter } from "./routes/subjects.routes.js";
import { quizzesRouter } from "./routes/quizzes.routes.js";
import { notesRouter } from "./routes/notes.routes.js";
import { assignmentsRouter } from "./routes/assignments.routes.js";
import { chatRouter } from "./routes/chat.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Debug - remove after everything works
console.log("CLIENT_ORIGIN:", config.clientOrigin);

// Allow both Vite development ports
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true,
    })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        service: "vidya-ai-backend",
    });
});

app.use("/api/auth", authRouter);
app.use("/api/subjects", subjectsRouter);
app.use("/api/quizzes", quizzesRouter);
app.use("/api/notes", notesRouter);
app.use("/api/assignments", assignmentsRouter);
app.use("/api/chat", chatRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Vidya AI backend running on http://localhost:${config.port}`);
});