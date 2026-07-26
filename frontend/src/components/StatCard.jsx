import React from "react";

export default function StatCard({ icon: Icon, label, value, tint }) {
  return (
    <div className="vc-card p-4 flex items-center gap-3 vc-animate-in">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${tint}1A` }}>
        <Icon size={20} style={{ color: tint }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</p>
        <p className="font-display font-bold text-lg leading-tight truncate">{value}</p>
      </div>
    </div>
  );
}
