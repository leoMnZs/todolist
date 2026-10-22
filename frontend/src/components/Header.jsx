// Título e contadores (total de tarefas e quantas já foram concluídas).
export default function Header({ total, completed }) {
  return (
    <header className="pb-5 pt-8 text-center">
      <h1 className="text-xl font-medium tracking-wide">TODO LIST</h1>
      <p className="mt-1 text-xs text-muted">
        Total: <strong className="font-semibold text-ink">{total}</strong>
        <span className="mx-2">·</span>
        Concluídas: <strong className="font-semibold text-ink">{completed}</strong>
      </p>
    </header>
  );
}
