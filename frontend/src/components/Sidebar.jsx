import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, MessageCircle, BookOpen, ClipboardCheck, TrendingUp, StickyNote,
  FileText, LogOut, GraduationCap, X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/chat", label: "AI Tutor", icon: MessageCircle },
  { to: "/subjects", label: "Subjects", icon: BookOpen },
  { to: "/quiz", label: "Quizzes", icon: ClipboardCheck },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/notes", label: "Notes", icon: StickyNote },
  { to: "/assignments", label: "Assignments", icon: FileText },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`fixed md:static z-40 md:z-auto top-0 left-0 h-full w-64 shrink-0 flex flex-col border-r transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2 px-5 h-16 shrink-0 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--brand)" }}>
            <GraduationCap size={17} color="#fff" />
          </div>
          <span className="font-display font-bold text-base">Vidya AI</span>
          <button className="ml-auto md:hidden vc-btn-ghost p-1.5" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto vc-scrollbar">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `vc-nav-item flex items-center gap-3 px-3 py-2.5 text-sm font-medium ${isActive ? "active" : ""}`}
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
          <button onClick={handleLogout} className="vc-btn-ghost w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium">
            <LogOut size={17} /> Log out
          </button>
        </div>
      </aside>
    </>
  );
}
