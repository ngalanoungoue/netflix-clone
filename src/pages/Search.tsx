import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { omdbApi, type Movie, fixPoster } from '../services/omdb';
import { useSearchHistory } from '../hooks/useSearchHistory';
import Navbar from '../components/Navbar';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { getHistory, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();

  // Initialisation propre de l'historique
  const [history, setHistory] = useState<string[]>(() => getHistory());

  // Focus automatique au chargement
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const refreshHistory = useCallback(() => {
    setHistory(getHistory());
  }, [getHistory]);

  // --- LOGIQUE DE RECHERCHE CORRIGÉE ---
  useEffect(() => {
    // Si la requête est vide, on s'arrête là. 
    // Le nettoyage de 'results' est maintenant géré par handleInputChange.
    if (!query.trim()) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await omdbApi.search(query);
        if (!cancelled) {
          setResults(res);
        }
      } catch (err) {
        console.error("Erreur recherche:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Nouvelle fonction pour gérer la saisie proprement
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // CORRECTION : On vide les résultats ici au lieu du useEffect
    if (!value.trim()) {
      setResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addToHistory(query.trim());
      refreshHistory();
      setShowHistory(false);
    }
  };

  const handleSelectFromHistory = (term: string) => {
    setQuery(term);
    setShowHistory(false);
    addToHistory(term); // Remonte le terme en haut de l'historique
    refreshHistory();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-24 px-10 max-w-4xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange} // Utilisation de la nouvelle fonction
            onFocus={() => setShowHistory(true)}
            placeholder="Titres, personnes, genres..."
            className="w-full bg-gray-800 py-3 px-12 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-white"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          
          {/* Menu Historique */}
          {showHistory && history.length > 0 && (
            <div className="absolute w-full bg-gray-900 mt-2 rounded-md shadow-2xl border border-gray-700 z-50">
              <div className="p-3 flex justify-between text-xs text-gray-400 uppercase font-bold border-b border-gray-800">
                <span>Recherches récentes</span>
                <button onClick={clearHistory} className="hover:text-white">Effacer tout</button>
              </div>
              {history.map((item, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center px-4 py-2 hover:bg-gray-800 cursor-pointer group"
                  onClick={() => handleSelectFromHistory(item)}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-gray-500">🕒</span> {item}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFromHistory(item); refreshHistory(); }}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500"
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Résultats */}
        <div className="mt-10">
          {loading ? (
            <div className="text-center text-gray-400">Chargement...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((movie) => (
                <div 
                  key={movie.imdbID} 
                  className="cursor-pointer transition hover:scale-105"
                  onClick={() => navigate(`/movie/${movie.imdbID}`)}
                >
                  <img 
                    src={fixPoster(movie.Poster)} 
                    alt={movie.Title} 
                    className="rounded-md w-full aspect-[2/3] object-cover bg-gray-800"
                  />
                  <p className="mt-2 text-sm font-medium truncate">{movie.Title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}