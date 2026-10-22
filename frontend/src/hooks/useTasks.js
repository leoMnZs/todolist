import { useCallback, useEffect, useRef, useState } from "react";
import * as api from "../services/api";
import { sortTasks } from "../utils/tasks";

// Concentra o estado das tarefas e todas as operações com a API.
export function useTasks({ search, status }) {
  const [tasks, setTasks] = useState([]);
  const [totals, setTotals] = useState({ total: 0, completed: 0 });
  const [loading, setLoading] = useState(true); // só vale para o primeiro carregamento
  const [error, setError] = useState(null); // falha ao carregar a lista
  const [actionError, setActionError] = useState(null); // falha ao marcar/excluir
  const lastRequest = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++lastRequest.current;
    try {
      const data = await api.listTasks({ search, status });
      if (requestId !== lastRequest.current) return; // resposta antiga: descarta
      setTasks(sortTasks(data.tasks));
      setTotals({ total: data.total, completed: data.completed });
      setError(null);
    } catch (err) {
      if (requestId !== lastRequest.current) return;
      setError(err.message);
    } finally {
      if (requestId === lastRequest.current) setLoading(false);
    }
  }, [search, status]);

  // Recarrega quando a busca (já com debounce) ou o filtro mudam.
  useEffect(() => {
    load();
  }, [load]);

  // Criar/editar: quem chama (o modal) trata o erro e mostra no formulário.
  const createTask = useCallback(
    async (data) => {
      await api.createTask(data);
      await load();
    },
    [load]
  );

  const editTask = useCallback(
    async (id, data) => {
      await api.updateTask(id, data);
      await load();
    },
    [load]
  );

  // Marcar/desmarcar: atualiza a tela na hora e confirma com o servidor.
  // O recarregamento final corrige a tela se a API tiver falhado.
  const toggleTask = useCallback(
    async (task) => {
      const completed = !task.completed;
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed } : t)));
      setTotals((prev) => ({ ...prev, completed: prev.completed + (completed ? 1 : -1) }));
      try {
        await api.updateTask(task.id, { completed });
      } catch (err) {
        setActionError(err.message);
      }
      await load();
    },
    [load]
  );

  const removeTask = useCallback(
    async (task) => {
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      setTotals((prev) => ({
        total: prev.total - 1,
        completed: prev.completed - (task.completed ? 1 : 0),
      }));
      try {
        await api.deleteTask(task.id);
      } catch (err) {
        setActionError(err.message);
      }
      await load();
    },
    [load]
  );

  const clearActionError = useCallback(() => setActionError(null), []);

  return {
    tasks,
    totals,
    loading,
    error,
    actionError,
    clearActionError,
    reload: load,
    createTask,
    editTask,
    toggleTask,
    removeTask,
  };
}
