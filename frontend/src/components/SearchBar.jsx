import { ChevronIcon, MoonIcon, SearchIcon, SunIcon } from "./Icons.jsx";

// Busca + filtro de status + botão de alternar tema (como na imagem).
export default function SearchBar({ search, onSearch, status, onStatus, theme, onToggleTheme }) {
  return (
    <div className="flex items-center gap-2">
      <label className="relative flex-1">
        <span className="sr-only">Buscar tarefa</span>
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search note..."
          className="h-9 w-full rounded-sm border border-accent bg-field pl-9 pr-3 text-sm text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-accent/40"
        />
      </label>

      <div className="relative">
        <select
          aria-label="Filtrar tarefas"
          value={status}
          onChange={(e) => onStatus(e.target.value)}
          className="h-9 cursor-pointer appearance-none rounded-sm bg-accent pl-3 pr-8 text-xs font-semibold uppercase text-white outline-none focus:ring-2 focus:ring-accent/50"
        >
          <option value="all" className="bg-field text-ink">All</option>
          <option value="pending" className="bg-field text-ink">Pending</option>
          <option value="completed" className="bg-field text-ink">Completed</option>
        </select>
        <ChevronIcon
          size={14}
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white"
        />
      </div>

      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
        title={theme === "dark" ? "Tema claro" : "Tema escuro"}
        className="flex h-9 w-9 items-center justify-center rounded-sm bg-accent text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent/50"
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  );
}
