import React from "react";
import { Menu, Search, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";
}

export default function TopBar({ title, subtitle, setSidebarOpen }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="h-16 shrink-0 border-b flex items-center gap-3 px-4 sm:px-6" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
      <button className="md:hidden vc-btn-ghost p-2" onClick={() => setSidebarOpen(true)}>
        <Menu size={20} />
      </button>
      <div className="min-w-0">
        <h1 className="font-display font-bold text-base sm:text-lg truncate">{title}</h1>
        {subtitle && <p className="text-xs hidden sm:block" style={{ color: "var(--text-secondary)" }}>{subtitle}</p>}
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input placeholder="Search topics..." className="vc-input pl-8 pr-3 py-2 text-sm w-48 lg:w-64" />
        </div>
        <button className="vc-btn-ghost p-2 relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "var(--danger)" }} />
        </button>
        <button onClick={toggleTheme} className="vc-btn-ghost p-2">
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ml-1" style={{ background: "var(--brand)" }}>
          {initials(user?.name)}
        </div>
      </div>
    </header>
  );
}
