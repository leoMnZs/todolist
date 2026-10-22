import { CheckIcon, PencilIcon, TrashIcon } from "./Icons.jsx";
import { formatDate, isOverdue } from "../utils/tasks";

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task);

  // Concluída: cinza e riscada. Em atraso: título vermelho.
  const titleStyle = task.completed
    ? "text-muted line-through"
    : overdue
      ? "text-danger"
      : "text-ink";

  return (
    <li className="task-row flex items-start gap-3 border-b border-line py-3 last:border-b-0">
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? "Marcar como pendente" : "Marcar como concluída"}
        onClick={() => onToggle(task)}
        className="check-box mt-0.5 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-[4px] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        {task.completed && <CheckIcon size={13} strokeWidth={3} />}
      </button>

      <div className="min-w-0 flex-1">
        <p className={`break-words text-sm font-medium ${titleStyle}`}>{task.title}</p>

        {task.dueDate && (
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>Até {formatDate(task.dueDate)}</span>
            {overdue && (
              <span className="rounded-full bg-danger/15 px-2 py-0.5 text-[11px] font-semibold text-danger">
                Em atraso
              </span>
            )}
          </div>
        )}
      </div>

      {/* Só aparecem no hover (ou foco por teclado) — ver .row-actions no CSS */}
      <div className="row-actions flex shrink-0 gap-1">
        <button
          type="button"
          onClick={() => onEdit(task)}
          aria-label={`Editar "${task.title}"`}
          title="Editar"
          className="rounded p-1.5 text-muted hover:bg-accent/15 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          <PencilIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          aria-label={`Excluir "${task.title}"`}
          title="Excluir"
          className="rounded p-1.5 text-muted hover:bg-danger/15 hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-danger/60"
        >
          <TrashIcon size={16} />
        </button>
      </div>
    </li>
  );
}
