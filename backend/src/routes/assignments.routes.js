import { Router } from "express";
import { db } from "../data/store.js";
import { requireAuth } from "../middleware/auth.js";

export const assignmentsRouter = Router();
assignmentsRouter.use(requireAuth);

/** GET /api/assignments */
assignmentsRouter.get("/", (req, res) => {
  res.json({ assignments: db.getAssignments(req.userId) });
});

/** PATCH /api/assignments/:id  body: { status: "submitted" } */
assignmentsRouter.patch("/:id", (req, res) => {
  const { status } = req.body || {};
  if (!["pending", "submitted", "graded"].includes(status)) {
    return res.status(400).json({ error: "status must be one of pending, submitted, graded" });
  }
  const updated = db.updateAssignmentStatus(req.userId, req.params.id, status);
  if (!updated) return res.status(404).json({ error: "Assignment not found" });
  res.json({ assignment: updated });
});
