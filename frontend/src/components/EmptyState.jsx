// Estado vazio. O texto padrão é o do mockup.
export default function EmptyState({ message = "You have no pending tasks." }) {
  return <p className="py-16 text-center text-sm text-muted">{message}</p>;
}
