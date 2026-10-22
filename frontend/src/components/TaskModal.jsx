import { useEffect, useState } from "react";
import { CloseIcon } from "./Icons.jsx";

// Modal único para criar e editar.
// `task` = null  -> "Create Task"
// `task` = objeto -> "Edit Task" (campos já preenchidos)
export default function TaskModal({ task, onClose, onSubmit }) {
  const isEdit = Boolean(task);
  const [title, setTitle] = useState(task?.title ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Esc fecha o modal
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !saving && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("O nome da tarefa é obrigatório.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      // dueDate vazio vira null (limpa a data na edição).
      await onSubmit({ title: trimmed, dueDate: dueDate || null });
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        onSubmit={handleSubmit}
        className="pop-in w-full max-w-sm rounded-md border border-line bg-card p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="task-modal-title" className="text-lg font-medium">
            {isEdit ? "Edit Task" : "Create Task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Fechar"
            className="rounded p-1 text-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <label className="block text-xs font-medium text-muted" htmlFor="task-title">
          Title
        </label>
        <input
          id="task-title"
          type="text"
          autoFocus
          maxLength={255}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null); // some o aviso assim que a pessoa volta a digitar
          }}
          placeholder="What needs to be done?"
          className="mt-1 h-10 w-full rounded-sm border border-accent bg-field px-3 text-sm text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-accent/40"
        />

        <label className="mt-4 block text-xs font-medium text-muted" htmlFor="task-due">
          Due date <span className="font-normal">(optional)</span>
        </label>
        <input
          id="task-due"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 h-10 w-full rounded-sm border border-line bg-field px-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/40"
        />

        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-9 rounded-sm px-4 text-sm text-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-9 rounded-sm bg-gradient-to-br from-accent to-accent-2 px-5 text-sm font-semibold text-white hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:opacity-60"
          >
            {saving ? "Saving..." : isEdit ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
