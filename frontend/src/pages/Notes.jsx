import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { api } from "../api/client.js";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");

  useEffect(() => {
    api.getNotes().then(({ notes }) => {
      setNotes(notes);
      setSelectedId(notes[0]?.id ?? null);
      setLoading(false);
    });
  }, []);

  const selected = notes.find((n) => n.id === selectedId);

  async function addNote() {
    if (!draftTitle.trim()) return;
    const { note } = await api.addNote({ subject: "General", title: draftTitle.trim(), content: draftContent });
    setNotes([note, ...notes]);
    setSelectedId(note.id);
    setDraftTitle(""); setDraftContent(""); setShowEditor(false);
  }

  async function deleteNote(id) {
    const { notes: remaining } = await api.deleteNote(id);
    setNotes(remaining);
    if (selectedId === id) setSelectedId(remaining[0]?.id ?? null);
  }

  if (loading) return <div className="p-6 text-sm" style={{ color: "var(--text-secondary)" }}>Loading notes…</div>;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-xl">Notes</h2>
        <button onClick={() => setShowEditor(true)} className="vc-btn-primary text-xs font-semibold px-3.5 py-2 flex items-center gap-1.5">
          <Plus size={15} /> New note
        </button>
      </div>

      <div className="grid md:grid-cols-5 gap-4">
        <div className="md:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto vc-scrollbar pr-1">
          {notes.length === 0 && <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>No notes yet — add your first one.</p>}
          {notes.map((n) => (
            <button key={n.id} onClick={() => { setSelectedId(n.id); setShowEditor(false); }}
              className="vc-card w-full text-left p-3.5 block"
              style={{ borderColor: selectedId === n.id ? "var(--brand)" : "var(--border)" }}>
              <div className="flex items-center justify-between mb-1">
                <p className="font-display font-semibold text-sm truncate">{n.title}</p>
                <span className="text-[11px] shrink-0 ml-2" style={{ color: "var(--text-muted)" }}>{n.date}</span>
              </div>
              <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{n.subject}</p>
            </button>
          ))}
        </div>

        <div className="md:col-span-3">
          {showEditor ? (
            <div className="vc-card p-5 vc-animate-in">
              <input value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} placeholder="Note title"
                className="vc-input w-full px-3.5 py-2 text-sm font-semibold mb-3" />
              <textarea value={draftContent} onChange={(e) => setDraftContent(e.target.value)} placeholder="Write your note..."
                rows={10} className="vc-input w-full px-3.5 py-2.5 text-sm resize-none" />
              <div className="flex gap-2 mt-3">
                <button onClick={addNote} className="vc-btn-primary text-sm font-semibold px-4 py-2">Save note</button>
                <button onClick={() => setShowEditor(false)} className="vc-btn-ghost text-sm font-semibold px-4 py-2 border" style={{ borderColor: "var(--border)" }}>Cancel</button>
              </div>
            </div>
          ) : selected ? (
            <div className="vc-card p-5 vc-animate-in">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-display font-bold text-lg">{selected.title}</h3>
                <button onClick={() => deleteNote(selected.id)} className="vc-btn-ghost p-1.5 shrink-0">
                  <Trash2 size={16} style={{ color: "var(--danger)" }} />
                </button>
              </div>
              <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>{selected.subject} · {selected.date}</p>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{selected.content}</p>
            </div>
          ) : (
            <div className="vc-card p-10 text-center" style={{ color: "var(--text-muted)" }}>Select a note to view it</div>
          )}
        </div>
      </div>
    </div>
  );
}
