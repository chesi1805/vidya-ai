import React, { useEffect, useRef, useState } from "react";
import { Bot, User as UserIcon, Send } from "lucide-react";
import { api } from "../api/client.js";

const SUGGESTED_PROMPTS = [
  "Explain photosynthesis simply",
  "Help me solve a quadratic equation",
  "What is Newton's third law?",
  "Tips to memorise history dates",
];

export default function ChatTutor() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Namaste! I'm Vidya, your AI tutor. Ask me to explain a concept, solve a problem, or quiz you on anything from your subjects." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const nextMessages = [...messages, { role: "user", text: content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const { text: reply } = await api.sendChat(nextMessages);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", text: `I'm having trouble connecting right now (${err.message}). Please try again.` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto h-full flex flex-col">
      <div className="vc-card flex flex-col flex-1 min-h-[70vh] overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 sm:px-5 py-3.5 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "var(--brand)" }}>
            <Bot size={17} color="#fff" />
          </div>
          <div>
            <p className="font-display font-bold text-sm">Vidya Tutor</p>
            <p className="text-xs flex items-center gap-1" style={{ color: "var(--success)" }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "var(--success)" }} /> Online
            </p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto vc-scrollbar px-4 sm:px-5 py-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: m.role === "user" ? "var(--bg-sunken)" : "var(--brand)" }}>
                {m.role === "user" ? <UserIcon size={13} /> : <Bot size={13} color="#fff" />}
              </div>
              <div
                className="max-w-[80%] sm:max-w-[70%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                style={{
                  background: m.role === "user" ? "var(--brand)" : "var(--bg-sunken)",
                  color: m.role === "user" ? "#fff" : "var(--text-primary)",
                  borderTopRightRadius: m.role === "user" ? 4 : 16,
                  borderTopLeftRadius: m.role === "user" ? 16 : 4,
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--brand)" }}>
                <Bot size={13} color="#fff" />
              </div>
              <div className="px-3.5 py-2.5 rounded-2xl text-sm vc-pulse" style={{ background: "var(--bg-sunken)" }}>Thinking…</div>
            </div>
          )}
        </div>

        {messages.length < 2 && (
          <div className="px-4 sm:px-5 pb-2 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((p) => (
              <button key={p} onClick={() => send(p)} className="vc-btn-ghost text-xs px-3 py-1.5 border" style={{ borderColor: "var(--border)" }}>
                {p}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2 px-4 sm:px-5 py-3.5 border-t" style={{ borderColor: "var(--border)" }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Vidya anything about your subjects..."
            className="vc-input flex-1 px-3.5 py-2.5 text-sm" />
          <button type="submit" disabled={loading || !input.trim()} className="vc-btn-primary p-2.5 shrink-0">
            <Send size={17} />
          </button>
        </form>
      </div>
    </div>
  );
}
