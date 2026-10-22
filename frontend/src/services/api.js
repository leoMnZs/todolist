// Camada de serviço: toda a comunicação com o backend fica aqui.
// VITE_API_URL vazio => usa caminhos relativos (/api/...) via proxy do Vite.
const BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

async function request(path, { method = "GET", body } = {}) {
  const options = { method };

  // Só envia Content-Type quando há corpo. O Fastify rejeita DELETE com
  // "application/json" e corpo vazio.
  if (body !== undefined) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, options);
  } catch {
    throw new Error(
      "Não foi possível conectar à API. Verifique se o backend está rodando em http://localhost:3333."
    );
  }

  if (!response.ok) {
    let message = `Erro ${response.status} ao falar com a API.`;
    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      /* resposta sem JSON: mantém a mensagem padrão */
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// Garante um formato único de tarefa, mesmo que o backend devolva
// due_date em vez de dueDate ou completed como 0/1.
export function normalizeTask(raw) {
  const due = raw.dueDate ?? raw.due_date ?? null;
  return {
    id: raw.id,
    title: raw.title ?? "",
    completed: raw.completed === true || raw.completed === 1 || raw.completed === "1",
    // Mantém só "AAAA-MM-DD" (ignora hora/fuso que venham junto).
    dueDate: typeof due === "string" && /^\d{4}-\d{2}-\d{2}/.test(due) ? due.slice(0, 10) : null,
  };
}

// GET /api/tasks?search=&status=all|pending|completed
// O backend responde { tasks, total, completed }, onde total/completed são
// os contadores GERAIS (não mudam com a busca ou o filtro).
export async function listTasks({ search = "", status = "all" } = {}) {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  if (status && status !== "all") params.set("status", status);
  const query = params.toString();

  const data = await request(`/api/tasks${query ? `?${query}` : ""}`);
  const tasks = (Array.isArray(data) ? data : data?.tasks ?? []).map(normalizeTask);

  return {
    tasks,
    total: Number(data?.total) || tasks.length,
    completed: Number(data?.completed) || tasks.filter((t) => t.completed).length,
  };
}

export function createTask({ title, dueDate }) {
  const body = { title };
  if (dueDate) body.dueDate = dueDate;
  return request("/api/tasks", { method: "POST", body });
}

export function updateTask(id, changes) {
  return request(`/api/tasks/${id}`, { method: "PATCH", body: changes });
}

export function deleteTask(id) {
  return request(`/api/tasks/${id}`, { method: "DELETE" });
}
