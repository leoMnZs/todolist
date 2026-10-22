import { useEffect, useState } from "react";

// Devolve `value` só depois que ele parar de mudar por `delay` ms.
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cada nova digitação reinicia a contagem
  }, [value, delay]);

  return debounced;
}
