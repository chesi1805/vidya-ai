// Lightweight local preview used only on the Login screen (before auth),
// so it doesn't need to call the API. Dashboard/Subjects/Progress pages
// fetch the real data from the backend instead.
export const SUBJECTS_PREVIEW = [
  { id: "math", name: "Mathematics", color: "#2563EB", topics: [{ progress: 80 }, { progress: 55 }, { progress: 30 }, { progress: 10 }] },
  { id: "science", name: "Science", color: "#06B6D4", topics: [{ progress: 90 }, { progress: 65 }, { progress: 40 }, { progress: 20 }] },
  { id: "english", name: "English", color: "#F59E0B", topics: [{ progress: 70 }, { progress: 45 }, { progress: 25 }] },
  { id: "social", name: "Social Studies", color: "#10B981", topics: [{ progress: 60 }, { progress: 35 }, { progress: 15 }] },
  { id: "cs", name: "Computer Science", color: "#8B5CF6", topics: [{ progress: 85 }, { progress: 40 }, { progress: 20 }] },
  { id: "hindi", name: "Hindi", color: "#EF4444", topics: [{ progress: 50 }, { progress: 30 }] },
];
