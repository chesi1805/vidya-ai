import { Router } from "express";
import { db } from "../data/store.js";

export const subjectsRouter = Router();

/** GET /api/subjects */
subjectsRouter.get("/", (req, res) => {
  res.json({ subjects: db.getSubjects() });
});

/** GET /api/subjects/progress-summary */
subjectsRouter.get("/progress-summary", (req, res) => {
  const subjects = db.getSubjects();
  const allTopics = subjects.flatMap((s) => s.topics);
  const overall = Math.round(allTopics.reduce((a, t) => a + t.progress, 0) / allTopics.length);
  const bySubject = subjects.map((s) => ({
    id: s.id,
    name: s.name,
    color: s.color,
    average: Math.round(s.topics.reduce((a, t) => a + t.progress, 0) / s.topics.length),
  }));
  res.json({ overall, bySubject });
});
