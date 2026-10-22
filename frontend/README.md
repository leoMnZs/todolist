# Todolist — Frontend (React + Vite)

Interface em tema escuro (com botão para alternar para o claro) que consome a API Fastify + MySQL da pasta `backend/`.

## Como rodar

1. Suba o backend (em outro terminal): `cd backend && npm install && npm run dev` (porta **3333**).
2. No frontend:

```bash
cd frontend
npm install
npm run dev
```

Acesse **http://localhost:5173**.

> O `vite.config.js` encaminha `/api/*` para `http://localhost:3333` (proxy), então não há problema de CORS.
> Se preferir falar direto com o backend, copie `.env.example` para `.env` e use `VITE_API_URL=http://localhost:3333`.

## Estrutura

```
src/
├── App.jsx                  # junta tudo: busca, filtro, lista, modal
├── main.jsx
├── index.css                # cores do tema (variáveis CSS) + Tailwind
├── services/api.js          # chamadas à API (fetch)
├── hooks/
│   ├── useTasks.js          # estado das tarefas + criar/editar/marcar/excluir
│   ├── useDebounce.js       # atraso de 400 ms na busca
│   └── useTheme.js          # tema escuro/claro (salvo no navegador)
├── utils/tasks.js           # ordenação, "em atraso", formatação de data
└── components/
    ├── Header.jsx           # título + contadores (total / concluídas)
    ├── SearchBar.jsx        # busca, filtro All/Pending/Completed, botão de tema
    ├── TaskList.jsx
    ├── TaskItem.jsx         # checkbox com gradiente, selo "Em atraso", lápis/lixeira no hover
    ├── TaskModal.jsx        # "Create Task" e "Edit Task"
    ├── EmptyState.jsx       # "You have no pending tasks."
    ├── FloatingButton.jsx   # botão "+" fixo no canto inferior direito
    └── Icons.jsx
```

## Funcionalidades

- Contadores de total e concluídas (vindos do backend)
- Busca em tempo real com debounce (400 ms) e filtro All / Pending / Completed
- Criar e editar tarefas por modal, com data limite opcional (editar também permite remover a data)
- Marcar/desmarcar como concluída (checkbox com gradiente)
- Excluir tarefa (com confirmação)
- Ordenação automática: data mais próxima primeiro, sem data por último
- Tarefa pendente com data já vencida: título vermelho + selo "Em atraso" (vencer hoje não conta como atraso)
- Botões de editar/excluir aparecem no hover (sempre visíveis em telas de toque)
- Estado vazio "You have no pending tasks." e botão flutuante "+"
- Mensagem de erro com "Tentar de novo" se a API estiver fora do ar
