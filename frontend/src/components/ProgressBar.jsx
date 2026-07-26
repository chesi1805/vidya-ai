import React from "react";

export default function ProgressBar({ value, height = 8 }) {
  return (
    <div className="vc-track w-full" style={{ height }}>
      <div className="vc-fill h-full" style={{ width: `${value}%` }} />
    </div>
  );
}
