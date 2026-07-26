import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { api } from "../api/client.js";

function QuizPicker({ subjects, navigate }) {
  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h2 className="font-display font-bold text-xl mb-1">Quizzes</h2>
      <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>Choose a subject to test what you've learned.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {subjects.map((s) => (
          <button key={s.id} onClick={() => navigate(`/quiz/${s.id}`)} className="vc-card p-4 flex items-center gap-3 text-left vc-animate-in">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}1A` }}>
              <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-sm">{s.name}</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Test your knowledge</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Quiz() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSubjects().then(({ subjects }) => setSubjects(subjects));
  }, []);

  useEffect(() => {
    if (!subjectId) { setLoading(false); return; }
    setLoading(true);
    setQIndex(0); setSelected(null); setAnswers({}); setResult(null);
    api.getQuiz(subjectId).then(({ questions }) => {
      setQuestions(questions);
      setLoading(false);
    });
  }, [subjectId]);

  if (loading) return <div className="p-6 text-sm" style={{ color: "var(--text-secondary)" }}>Loading…</div>;

  if (!subjectId) return <QuizPicker subjects={subjects} navigate={navigate} />;

  const subject = subjects.find((s) => s.id === subjectId);

  async function chooseOption(optionIndex) {
    setSelected(optionIndex);
    setAnswers((prev) => ({ ...prev, [questions[qIndex].id]: optionIndex }));
  }

  async function next() {
    if (qIndex + 1 < questions.length) {
      setQIndex((q) => q + 1);
      setSelected(null);
    } else {
      const finalAnswers = { ...answers, [questions[qIndex].id]: selected };
      const res = await api.submitQuiz(subjectId, finalAnswers);
      setResult(res);
    }
  }

  if (result) {
    return (
      <div className="p-4 sm:p-6 max-w-md mx-auto">
        <div className="vc-card p-8 text-center vc-animate-in">
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--brand-light)" }}>
            <Star size={26} style={{ color: "var(--brand)" }} />
          </div>
          <h3 className="font-display font-bold text-xl mb-1">Quiz complete!</h3>
          <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
            You scored {result.score} out of {result.total} on {subject?.name}.
          </p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => navigate(`/quiz/${subjectId}`)} className="vc-btn-primary text-sm font-semibold px-4 py-2.5">
              Reload page to retry
            </button>
            <button onClick={() => navigate("/quiz")} className="vc-btn-ghost text-sm font-semibold px-4 py-2.5 border" style={{ borderColor: "var(--border)" }}>
              Choose another
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[qIndex];

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="font-display font-bold text-sm">{subject?.name} quiz</span>
        <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Question {qIndex + 1} of {questions.length}</span>
      </div>
      <div className="vc-track h-2 mb-6"><div className="vc-fill h-full" style={{ width: `${(qIndex / questions.length) * 100}%` }} /></div>

      <div className="vc-card p-5 sm:p-6 vc-animate-in">
        <p className="font-display font-semibold text-base mb-5">{question.q}</p>
        <div className="space-y-2.5">
          {question.options.map((opt, i) => (
            <button
              key={i}
              disabled={selected !== null}
              onClick={() => chooseOption(i)}
              className="w-full flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-xl border text-left transition-colors"
              style={{ borderColor: selected === i ? "var(--brand)" : "var(--border)", background: selected === i ? "var(--bg-sunken)" : "transparent" }}
            >
              {opt}
            </button>
          ))}
        </div>

        <button disabled={selected === null} onClick={next} className="vc-btn-primary w-full mt-6 py-2.5 text-sm font-semibold">
          {qIndex + 1 < questions.length ? "Next question" : "See results"}
        </button>
      </div>
    </div>
  );
}
