import React, { useEffect, useState } from "react";
import { api } from "../api/client.js";
import ProgressBar from "../components/ProgressBar.jsx";
import KnowledgeConstellation from "../components/KnowledgeConstellation.jsx";

export default function Progress() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSubjects().then(({ subjects }) => { setSubjects(subjects); setLoading(false); });
  }, []);

  if (loading) return <div className="p-6 text-sm" style={{ color: "var(--text-secondary)" }}>Loading…</div>;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="font-display font-bold text-xl">Your progress</h2>

      <div className="vc-card p-5 sm:p-6 flex flex-col items-center vc-animate-in">
        <KnowledgeConstellation subjects={subjects} size={320} />
        <p className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>Connected stars indicate subjects you've mastered past 45% together.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {subjects.map((s) => {
          const avg = Math.round(s.topics.reduce((a, t) => a + t.progress, 0) / s.topics.length);
          return (
            <div key={s.id} className="vc-card p-4 vc-animate-in">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}1A` }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                </div>
                <p className="font-display font-bold text-sm flex-1">{s.name}</p>
                <span className="text-sm font-bold" style={{ color: s.color }}>{avg}%</span>
              </div>
              <div className="space-y-2.5">
                {s.topics.map((t) => (
                  <div key={t.name}>
                    <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                      <span>{t.name}</span><span>{t.progress}%</span>
                    </div>
                    <ProgressBar value={t.progress} height={5} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
