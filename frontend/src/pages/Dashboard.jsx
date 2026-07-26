import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Flame, TrendingUp, FileText, StickyNote, ChevronRight, Clock } from "lucide-react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import StatCard from "../components/StatCard.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import KnowledgeConstellation from "../components/KnowledgeConstellation.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [overall, setOverall] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [subjectsRes, assignmentsRes, notesRes, summaryRes] = await Promise.all([
          api.getSubjects(),
          api.getAssignments(),
          api.getNotes(),
          api.getProgressSummary(),
        ]);
        setSubjects(subjectsRes.subjects);
        setAssignments(assignmentsRes.assignments);
        setNotes(notesRes.notes);
        setOverall(summaryRes.overall);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-6 text-sm" style={{ color: "var(--text-secondary)" }}>Loading dashboard…</div>;
  if (error) return <div className="p-6 text-sm" style={{ color: "var(--danger)" }}>{error}</div>;

  const pending = assignments.filter((a) => a.status === "pending").length;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="vc-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 vc-animate-in"
        style={{ background: "linear-gradient(120deg, var(--brand), var(--brand-dark))" }}>
        <div className="text-white flex-1">
          <p className="text-sm text-white/80 mb-1">Welcome back,</p>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl">{user?.name} 👋</h2>
          <p className="text-white/85 text-sm mt-2">You're {overall}% through your enrolled topics. Keep the streak going!</p>
        </div>
        <button onClick={() => navigate("/chat")} className="bg-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shrink-0" style={{ color: "var(--brand-dark)" }}>
          <Sparkles size={16} /> Ask your AI tutor
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Flame} label="Day streak" value="12 days" tint="#F59E0B" />
        <StatCard icon={TrendingUp} label="Overall progress" value={`${overall}%`} tint="#2563EB" />
        <StatCard icon={FileText} label="Pending assignments" value={pending} tint="#EF4444" />
        <StatCard icon={StickyNote} label="Saved notes" value={notes.length} tint="#10B981" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="vc-card p-5 lg:col-span-2 vc-animate-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base">Continue learning</h3>
            <button onClick={() => navigate("/subjects")} className="text-xs font-semibold flex items-center gap-1" style={{ color: "var(--brand)" }}>
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {subjects.slice(0, 4).map((s) => {
              const topic = s.topics.reduce((a, b) => (a.progress < b.progress ? a : b));
              return (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${s.color}1A` }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{topic.name}</p>
                      <span className="text-xs shrink-0 ml-2" style={{ color: "var(--text-secondary)" }}>{topic.progress}%</span>
                    </div>
                    <ProgressBar value={topic.progress} height={6} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="vc-card p-5 flex flex-col items-center vc-animate-in">
          <h3 className="font-display font-bold text-base self-start mb-2">Knowledge map</h3>
          <KnowledgeConstellation subjects={subjects} size={240} />
          <button onClick={() => navigate("/progress")} className="text-xs font-semibold flex items-center gap-1 mt-1" style={{ color: "var(--brand)" }}>
            Full breakdown <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="vc-card p-5 vc-animate-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-base">Upcoming assignments</h3>
          <button onClick={() => navigate("/assignments")} className="text-xs font-semibold flex items-center gap-1" style={{ color: "var(--brand)" }}>
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-2">
          {assignments.filter((a) => a.status !== "graded").slice(0, 3).map((a) => (
            <div key={a.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
              <Clock size={16} style={{ color: "var(--text-muted)" }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{a.title}</p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{a.subject}</p>
              </div>
              <span className="text-xs font-medium shrink-0" style={{ color: "var(--text-secondary)" }}>Due {a.due}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
