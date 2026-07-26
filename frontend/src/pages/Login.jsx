import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, User as UserIcon, ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import KnowledgeConstellation from "../components/KnowledgeConstellation.jsx";
import { SUBJECTS_PREVIEW } from "../data/subjectsPreview.js";

export default function Login() {
  const { theme, toggleTheme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter an email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password, name.trim());
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
        style={{ background: "linear-gradient(160deg, var(--brand-dark), var(--brand) 60%, var(--accent))" }}>
        <div className="absolute inset-0 vc-star-bg" style={{ filter: "invert(1)" }} />
        <div className="relative z-10 max-w-md text-white vc-animate-in">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <GraduationCap size={22} />
            </div>
            <span className="font-display font-bold text-xl">Vidya AI</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl leading-tight mb-4">
            Learning, connected like the stars.
          </h1>
          <p className="text-white/80 text-base leading-relaxed mb-10">
            One AI tutor. Every subject. Track how each topic you master lights up
            your own knowledge constellation.
          </p>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/15">
            <KnowledgeConstellation subjects={SUBJECTS_PREVIEW} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        <button onClick={toggleTheme} className="vc-btn-ghost absolute top-6 right-6 p-2" aria-label="Toggle theme">
          {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
        </button>

        <div className="w-full max-w-sm vc-animate-in">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--brand)" }}>
              <GraduationCap size={18} color="#fff" />
            </div>
            <span className="font-display font-bold text-lg">Vidya AI</span>
          </div>

          <h2 className="font-display font-bold text-2xl mb-1">Welcome back</h2>
          <p className="text-sm mb-7" style={{ color: "var(--text-secondary)" }}>
            Sign in to continue your learning streak.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Full name</label>
              <div className="relative">
                <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Sharma"
                  className="vc-input w-full pl-9 pr-3 py-2.5 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu"
                  className="vc-input w-full pl-9 pr-3 py-2.5 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="vc-input w-full pl-9 pr-3 py-2.5 text-sm" />
              </div>
            </div>

            {error && <p className="text-xs" style={{ color: "var(--danger)" }}>{error}</p>}

            <button type="submit" disabled={loading} className="vc-btn-primary w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 mt-2">
              {loading ? "Signing in…" : (<>Sign in <ArrowRight size={16} /></>)}
            </button>
          </form>
          <p className="text-xs text-center mt-6" style={{ color: "var(--text-muted)" }}>
            New here? Just sign in — an account is created automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
