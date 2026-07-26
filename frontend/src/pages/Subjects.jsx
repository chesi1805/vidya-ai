import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ClipboardCheck } from "lucide-react";
import { api } from "../api/client.js";
import ProgressBar from "../components/ProgressBar.jsx";

export default function Subjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSubjects().then(({ subjects }) => {
      setSubjects(subjects);
      setExpanded(subjects[0]?.id ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-6 text-sm" style={{ color: "var(--text-secondary)" }}>Loading subjects…</div>;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-4">
      <h2 className="font-display font-bold text-xl mb-1">Subject-wise modules</h2>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>Pick a subject to view topics, or jump straight into a quiz.</p>

      {subjects.map((s) => {
        const isOpen = expanded === s.id;
        const avg = Math.round(s.topics.reduce((a, t) => a + t.progress, 0) / s.topics.length);
        return (
          <div key={s.id} className="vc-card overflow-hidden vc-animate-in">
            <button onClick={() => setExpanded(isOpen ? null : s.id)} className="w-full flex items-center gap-3 p-4 text-left">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}1A` }}>
                <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-sm">{s.name}</p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{s.topics.length} topics · {avg}% average mastery</p>
              </div>
              <ChevronRight size={18} className="transition-transform shrink-0" style={{ transform: isOpen ? "rotate(90deg)" : "none", color: "var(--text-muted)" }} />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 space-y-3 border-t pt-3" style={{ borderColor: "var(--border)" }}>
                {s.topics.map((t) => (
                  <div key={t.name}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{t.name}</p>
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{t.progress}%</span>
                    </div>
                    <ProgressBar value={t.progress} height={6} />
                  </div>
                ))}
                <button onClick={() => navigate(`/quiz/${s.id}`)} className="vc-btn-primary text-xs font-semibold px-3.5 py-2 flex items-center gap-1.5 mt-2">
                  <ClipboardCheck size={14} /> Take a quiz on {s.name}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
