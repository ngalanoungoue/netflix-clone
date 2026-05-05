// Gère l'historique de recherche dans localStorage
const HISTORY_KEY = 'netflix_search_history';
const MAX_HISTORY = 10;

export const useSearchHistory = () => {

  const getHistory = (): string[] => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  };

  const addToHistory = (query: string) => {
    if (!query.trim()) return;
    const history = getHistory().filter(h => h !== query);
    const updated = [query, ...history].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const removeFromHistory = (query: string) => {
    const updated = getHistory().filter(h => h !== query);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
  };

  return { getHistory, addToHistory, removeFromHistory, clearHistory };
};