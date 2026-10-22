import { useCallback, useState } from "react";
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import TaskList from "./components/TaskList.jsx";
import EmptyState from "./components/EmptyState.jsx";
import FloatingButton from "./components/FloatingButton.jsx";
import TaskModal from "./components/TaskModal.jsx";
import { useDebounce } from "./hooks/useDebounce";
import { useTasks } from "./hooks/useTasks";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all"); // all | pending | completed
  // A API só é chamada depois que a pessoa para de digitar por 400 ms.
  const debouncedSearch = useDebounce(search, 400);

  const {
    tasks,
    totals,
    loading,
    error,
    actionError,
    clearActionError,
    reload,
    createTask,
    editTask,
    toggleTask,
    removeTask,
  } = useTasks({ search: debouncedSearch, status });

  // null = fechado | { task: null } = criar | { task } = editar
  const [modal, setModal] = useState(null);
  const closeModal = useCallback(() => setModal(null), []);

  const handleSubmit = (data) =>
    modal.task ? editTask(modal.task.id, data) : createTask(data);

  const handleDelete = (task) => {
    if (window.confirm(`Excluir a tarefa "${task.title}"?`)) removeTask(task);
  };

  // Mensagem do estado vazio conforme o contexto
  let emptyMessage = "You have no pending tasks.";
  if (debouncedSearch.trim()) emptyMessage = "No tasks found.";
  else if (status === "completed") emptyMessage = "You have no completed tasks.";

  return (
    <div className="flex min-h-screen justify-center sm:p-6">
      <main
        className="relative min-h-screen w-full max-w-2xl bg-card px-5 pb-28 sm:min-h-[calc(100vh-3rem)] sm:rounded-sm"
        style={{ boxShadow: "var(--shadow)" }}
      >
        <Header total={totals.total} completed={totals.completed} />

        <SearchBar
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={setStatus}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-center justify-between gap-3 rounded-sm border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={reload}
              className="shrink-0 font-semibold underline underline-offset-2"
            >
              Tentar de novo
            </button>
          </div>
        )}

        {actionError && (
          <div
            role="alert"
            className="mt-4 flex items-center justify-between gap-3 rounded-sm border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
          >
            <span>{actionError}</span>
            <button type="button" onClick={clearActionError} className="shrink-0 font-semibold">
              OK
            </button>
          </div>
        )}

        <section className="mx-auto mt-6 max-w-md" aria-live="polite">
          {loading ? (
            <p className="py-16 text-center text-sm text-muted">Carregando tarefas...</p>
          ) : tasks.length > 0 ? (
            <TaskList
              tasks={tasks}
              onToggle={toggleTask}
              onEdit={(task) => setModal({ task })}
              onDelete={handleDelete}
            />
          ) : (
            // Com a API fora do ar, o aviso vermelho acima já explica; não mostra "vazio".
            !error && <EmptyState message={emptyMessage} />
          )}
        </section>
      </main>

      <FloatingButton onClick={() => setModal({ task: null })} />

      {modal && <TaskModal task={modal.task} onClose={closeModal} onSubmit={handleSubmit} />}
    </div>
  );
}
