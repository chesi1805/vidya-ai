import { Router } from "express";
import { db } from "../data/store.js";
import { requireAuth } from "../middleware/auth.js";

export const notesRouter = Router();
notesRouter.use(requireAuth);

/** GET /api/notes */
notesRouter.get("/", (req, res) => {
  res.json({ notes: db.getNotes(req.userId) });
});

/** POST /api/notes  body: { subject, title, content } */
notesRouter.post("/", (req, res) => {
  const { subject, title, content } = req.body || {};
  if (!title || !title.trim()) return res.status(400).json({ error: "title is required" });
  const note = db.addNote(req.userId, { subject, title, content });
  res.status(201).json({ note });
});

/** DELETE /api/notes/:id */
notesRouter.delete("/:id", (req, res) => {
  const notes = db.deleteNote(req.userId, req.params.id);
  res.json({ notes });
});
