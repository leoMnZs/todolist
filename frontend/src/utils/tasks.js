// Data de hoje no fuso local, no formato AAAA-MM-DD.
export function todayISO() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

// Em atraso = tem data limite, ela já passou (antes de hoje) e a tarefa está pendente.
// Comparar strings AAAA-MM-DD funciona porque o formato é ordenável.
export function isOverdue(task) {
  return Boolean(task.dueDate) && !task.completed && task.dueDate < todayISO();
}

// "2026-10-25" -> "25/10/2026"
export function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// Data mais próxima primeiro; tarefas sem data ficam por último.
// Empate: a mais antiga (menor id) vem antes.
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
    } else if (a.dueDate) {
      return -1;
    } else if (b.dueDate) {
      return 1;
    }
    return Number(a.id) - Number(b.id);
  });
}
