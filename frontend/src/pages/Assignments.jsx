import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { api } from "../api/client.js";

const STATUS_STYLE = {
  pending: { color: "var(--danger)", label: "Pending" },
  submitted: { color: "var(--amber)", label: "Submitted" },
  graded: { color: "var(--success)", label: "Graded" },
};

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAssignments().then(({ assignments }) => { setAssignments(assignments); setLoading(false); });
  }, []);

  async function submit(id) {
    const { assignment } = await api.updateAssignment(id, "submitted");
    setAssignments((prev) => prev.map((a) => (a.id === id ? assignment : a)));
  }

  if (loading) return <div className="p-6 text-sm" style={{ color: "var(--text-secondary)" }}>Loading assignments…</div>;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h2 className="font-display font-bold text-xl mb-4">Assignments</h2>
      <div className="space-y-3">
        {assignments.map((a) => {
          const st = STATUS_STYLE[a.status];
          return (
            <div key={a.id} className="vc-card p-4 flex items-center gap-3 vc-animate-in">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--bg-sunken)" }}>
                <FileText size={17} style={{ color: "var(--brand)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{a.title}</p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{a.subject} · Due {a.due}{a.grade ? ` · Grade ${a.grade}` : ""}</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0" style={{ color: st.color, background: `${st.color}1A` }}>{st.label}</span>
              {a.status === "pending" && (
                <button onClick={() => submit(a.id)} className="vc-btn-primary text-xs font-semibold px-3 py-1.5 shrink-0">Submit</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
