import React from "react";

/**
 * Signature visual: subjects rendered as stars in a constellation.
 * Node size + glow + connecting lines encode mastery, instead of a
 * generic bar chart.
 */
export default function KnowledgeConstellation({ subjects, size = 280 }) {
  const cx = size / 2;
  const cy = size / 2 - 6;
  const radius = size * 0.34;

  const points = subjects.map((s, i) => {
    const angle = (i / subjects.length) * Math.PI * 2 - Math.PI / 2;
    const avg = Math.round(s.topics.reduce((a, t) => a + t.progress, 0) / s.topics.length);
    return {
      ...s,
      avg,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  const overall = Math.round(points.reduce((a, p) => a + p.avg, 0) / points.length);

  return (
    <svg viewBox={`0 0 ${size} ${size - 10}`} width="100%" height="auto" role="img" aria-label="Knowledge constellation showing mastery per subject">
      {points.map((p, i) =>
        points.slice(i + 1).map((p2, j) => {
          const lit = p.avg > 45 && p2.avg > 45;
          return (
            <line
              key={`${i}-${j}`}
              x1={p.x} y1={p.y} x2={p2.x} y2={p2.y}
              stroke={lit ? "var(--accent)" : "var(--border)"}
              strokeWidth={lit ? 1.3 : 0.8}
              opacity={lit ? 0.55 : 0.4}
            />
          );
        })
      )}
      <circle cx={cx} cy={cy} r={30} fill="var(--brand)" opacity="0.12" />
      <circle cx={cx} cy={cy} r={20} fill="var(--brand)" />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" fontFamily="Sora, sans-serif">
        {overall}%
      </text>
      {points.map((p) => (
        <g key={p.id}>
          <circle cx={p.x} cy={p.y} r={4 + p.avg / 14} fill={p.color} className={p.avg > 70 ? "vc-node-glow" : ""} />
          <text x={p.x} y={p.y + (p.y > cy ? 22 : -14)} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="var(--text-secondary)" fontFamily="Inter, sans-serif">
            {p.name.split(" ")[0]}
          </text>
        </g>
      ))}
    </svg>
  );
}
