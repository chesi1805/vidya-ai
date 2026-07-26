import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";

const PAGE_META = {
  "/dashboard": { title: "Dashboard", subtitle: "Your learning at a glance" },
  "/chat": { title: "AI Tutor", subtitle: "Ask anything, anytime" },
  "/subjects": { title: "Subjects", subtitle: "Explore your learning modules" },
  "/quiz": { title: "Quizzes", subtitle: "Test what you know" },
  "/progress": { title: "Progress Tracker", subtitle: "See how far you've come" },
  "/notes": { title: "Notes", subtitle: "Your personal notebook" },
  "/assignments": { title: "Assignments", subtitle: "Stay on top of deadlines" },
};

function metaFor(pathname) {
  if (PAGE_META[pathname]) return PAGE_META[pathname];
  const base = "/" + pathname.split("/")[1];
  return PAGE_META[base] || { title: "Vidya AI" };
}

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const meta = metaFor(location.pathname);

  return (
    <div className="h-screen w-full flex overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={meta.title} subtitle={meta.subtitle} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto vc-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
