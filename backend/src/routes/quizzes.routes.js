import { Router } from "express";
import { db } from "../data/store.js";

export const quizzesRouter = Router();

/** GET /api/quizzes/:subjectId  -> questions WITHOUT the answer key */
quizzesRouter.get("/:subjectId", (req, res) => {
  const quiz = db.getQuiz(req.params.subjectId);
  if (!quiz.length) return res.status(404).json({ error: "No quiz found for this subject" });
  const sanitized = quiz.map(({ id, q, options }) => ({ id, q, options }));
  res.json({ subjectId: req.params.subjectId, questions: sanitized });
});

/**
 * POST /api/quizzes/:subjectId/submit
 * body: { answers: { [questionId]: selectedOptionIndex } }
 * Grades server-side so the answer key never has to live in the client.
 */
quizzesRouter.post("/:subjectId/submit", (req, res) => {
  const quiz = db.getQuiz(req.params.subjectId);
  if (!quiz.length) return res.status(404).json({ error: "No quiz found for this subject" });

  const { answers = {} } = req.body || {};
  let score = 0;
  const results = quiz.map((question) => {
    const chosen = answers[question.id];
    const correct = chosen === question.answer;
    if (correct) score += 1;
    return { id: question.id, correct, correctAnswer: question.answer };
  });

  res.json({ subjectId: req.params.subjectId, score, total: quiz.length, results });
});
