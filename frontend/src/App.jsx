import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppShell from "./components/AppShell.jsx";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ChatTutor from "./pages/ChatTutor.jsx";
import Subjects from "./pages/Subjects.jsx";
import Quiz from "./pages/Quiz.jsx";
import Progress from "./pages/Progress.jsx";
import Notes from "./pages/Notes.jsx";
import Assignments from "./pages/Assignments.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<ChatTutor />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/quiz/:subjectId" element={<Quiz />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/assignments" element={<Assignments />} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
