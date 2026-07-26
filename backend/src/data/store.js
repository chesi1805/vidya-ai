import { nanoid } from "nanoid";

/**
 * In-memory data store.
 *
 * This is intentionally simple (no database) so the project runs with zero
 * external setup. Swap this module for a real database (Postgres, Mongo,
 * etc.) by keeping the same exported function signatures.
 */

const SUBJECTS = [
  {
    id: "math",
    name: "Mathematics",
    color: "#2563EB",
    topics: [
      { name: "Quadratic Equations", progress: 80 },
      { name: "Trigonometry", progress: 55 },
      { name: "Probability", progress: 30 },
      { name: "Linear Algebra", progress: 10 },
    ],
  },
  {
    id: "science",
    name: "Science",
    color: "#06B6D4",
    topics: [
      { name: "Photosynthesis", progress: 90 },
      { name: "Newton's Laws", progress: 65 },
      { name: "Periodic Table", progress: 40 },
      { name: "Human Anatomy", progress: 20 },
    ],
  },
  {
    id: "english",
    name: "English",
    color: "#F59E0B",
    topics: [
      { name: "Grammar Essentials", progress: 70 },
      { name: "Poetry Analysis", progress: 45 },
      { name: "Essay Writing", progress: 25 },
    ],
  },
  {
    id: "social",
    name: "Social Studies",
    color: "#10B981",
    topics: [
      { name: "Indian Freedom Struggle", progress: 60 },
      { name: "World Geography", progress: 35 },
      { name: "Civics", progress: 15 },
    ],
  },
  {
    id: "cs",
    name: "Computer Science",
    color: "#8B5CF6",
    topics: [
      { name: "Python Basics", progress: 85 },
      { name: "Data Structures", progress: 40 },
      { name: "Algorithms", progress: 20 },
    ],
  },
  {
    id: "hindi",
    name: "Hindi",
    color: "#EF4444",
    topics: [
      { name: "Vyakaran", progress: 50 },
      { name: "Kavya", progress: 30 },
    ],
  },
];

const QUIZ_BANK = {
  math: [
    { id: "m1", q: "What is the value of x in 2x + 4 = 12?", options: ["2", "4", "6", "8"], answer: 1 },
    { id: "m2", q: "What is the sum of angles in a triangle?", options: ["90°", "180°", "270°", "360°"], answer: 1 },
    { id: "m3", q: "What is √144?", options: ["10", "11", "12", "14"], answer: 2 },
  ],
  science: [
    { id: "s1", q: "What gas do plants absorb for photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: 2 },
    { id: "s2", q: "What is the SI unit of Force?", options: ["Joule", "Newton", "Watt", "Pascal"], answer: 1 },
    { id: "s3", q: "How many bones in an adult human body?", options: ["196", "206", "216", "226"], answer: 1 },
  ],
  english: [
    { id: "e1", q: "Choose the correct synonym for 'Happy'", options: ["Sad", "Joyful", "Angry", "Tired"], answer: 1 },
    { id: "e2", q: "Identify the noun in: 'The cat sat quietly.'", options: ["sat", "quietly", "cat", "the"], answer: 2 },
  ],
  social: [
    { id: "so1", q: "Who was the first Prime Minister of India?", options: ["Gandhi", "Nehru", "Patel", "Bose"], answer: 1 },
    { id: "so2", q: "Which is the longest river in the world?", options: ["Ganga", "Amazon", "Nile", "Yangtze"], answer: 2 },
  ],
  cs: [
    { id: "c1", q: "Which symbol starts a comment in Python?", options: ["//", "#", "<!--", "/*"], answer: 1 },
    { id: "c2", q: "What does CPU stand for?", options: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Central Processor Utility"], answer: 1 },
  ],
  hindi: [
    { id: "h1", q: "'पुस्तक' का पर्यायवाची शब्द है?", options: ["ग्रंथ", "नदी", "वृक्ष", "आकाश"], answer: 0 },
  ],
};

// Per-user data, keyed by userId. Seeded lazily on first login.
const usersById = new Map(); // userId -> { id, name, email, passwordHash }
const usersByEmail = new Map(); // email -> userId
const notesByUser = new Map(); // userId -> [{ id, subject, title, content, date }]
const assignmentsByUser = new Map(); // userId -> [{ id, subject, title, due, status, grade }]

function seedUserData(userId) {
  notesByUser.set(userId, [
    { id: nanoid(8), subject: "Mathematics", title: "Quadratic Formula", content: "x = (-b ± √(b²-4ac)) / 2a\n\nUsed to solve any quadratic equation of the form ax² + bx + c = 0.", date: new Date().toLocaleDateString() },
    { id: nanoid(8), subject: "Science", title: "Photosynthesis Equation", content: "6CO2 + 6H2O + light energy → C6H12O6 + 6O2\n\nOccurs in chloroplasts, mainly in leaves.", date: new Date().toLocaleDateString() },
  ]);
  assignmentsByUser.set(userId, [
    { id: nanoid(8), subject: "Mathematics", title: "Quadratic Equations Worksheet", due: "16 Jul", status: "pending" },
    { id: nanoid(8), subject: "Science", title: "Lab Report: Photosynthesis", due: "18 Jul", status: "pending" },
    { id: nanoid(8), subject: "English", title: "Essay: My Favourite Season", due: "12 Jul", status: "submitted" },
    { id: nanoid(8), subject: "Social Studies", title: "Map Work: Rivers of India", due: "10 Jul", status: "graded", grade: "A" },
  ]);
}

export const db = {
  // ---- subjects & quizzes (shared/static content) ----
  getSubjects() {
    return SUBJECTS;
  },
  getQuiz(subjectId) {
    return QUIZ_BANK[subjectId] || [];
  },

  // ---- users ----
  findUserByEmail(email) {
    const id = usersByEmail.get(email.toLowerCase());
    return id ? usersById.get(id) : null;
  },
  createUser({ name, email, passwordHash }) {
    const id = nanoid(12);
    const user = { id, name, email: email.toLowerCase(), passwordHash };
    usersById.set(id, user);
    usersByEmail.set(user.email, id);
    seedUserData(id);
    return user;
  },
  getUserById(id) {
    return usersById.get(id) || null;
  },

  // ---- notes ----
  getNotes(userId) {
    return notesByUser.get(userId) || [];
  },
  addNote(userId, { subject, title, content }) {
    const note = { id: nanoid(8), subject: subject || "General", title, content: content || "", date: new Date().toLocaleDateString() };
    const list = notesByUser.get(userId) || [];
    list.unshift(note);
    notesByUser.set(userId, list);
    return note;
  },
  deleteNote(userId, noteId) {
    const list = notesByUser.get(userId) || [];
    const next = list.filter((n) => n.id !== noteId);
    notesByUser.set(userId, next);
    return next;
  },

  // ---- assignments ----
  getAssignments(userId) {
    return assignmentsByUser.get(userId) || [];
  },
  updateAssignmentStatus(userId, assignmentId, status) {
    const list = assignmentsByUser.get(userId) || [];
    const next = list.map((a) => (a.id === assignmentId ? { ...a, status } : a));
    assignmentsByUser.set(userId, next);
    return next.find((a) => a.id === assignmentId) || null;
  },
};
