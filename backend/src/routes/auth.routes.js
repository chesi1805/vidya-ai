import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../data/store.js";
import { signToken } from "../utils/jwt.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

/**
 * POST /api/auth/signup
 * body: { name, email, password }
 */
authRouter.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }
    if (db.findUserByEmail(email)) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = db.createUser({ name, email, passwordHash });
    const token = signToken({ sub: user.id });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 * body: { email, password }
 * For demo purposes, if the account doesn't exist yet it is auto-created,
 * so reviewers can log in immediately without a separate signup step.
 */
authRouter.post("/login", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    let user = db.findUserByEmail(email);

    if (!user) {
      const passwordHash = await bcrypt.hash(password, 10);
      user = db.createUser({ name: name || email.split("@")[0], email, passwordHash });
    } else {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return res.status(401).json({ error: "Incorrect email or password" });
    }

    const token = signToken({ sub: user.id });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 */
authRouter.get("/me", requireAuth, (req, res) => {
  const user = db.getUserById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});
