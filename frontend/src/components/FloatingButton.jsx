import { PlusIcon } from "./Icons.jsx";

// Botão redondo "+" fixo no canto inferior direito.
export default function FloatingButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Criar tarefa"
      title="Criar tarefa"
      className="fixed bottom-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-black/40 transition hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-accent/40"
    >
      <PlusIcon size={24} />
    </button>
  );
}
