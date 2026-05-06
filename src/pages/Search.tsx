import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { omdbApi, type Movie, fixPoster } from '../services/omdb';
import { useSearchHistory } from '../hooks/useSearchHistory';
import Navbar from '../components/Navbar';

export default function Search() {
  const [query,       setQuery]       = useState('');
  const [results,     setResults]     = useState<Movie[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { getHistory, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();

  // ✅ Initialisation propre sans useEffect
  const [history, setHistory] = useState<string[]>(() => getHistory());

  // ✅ Focus automatique
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ✅ Rafraîchir l'historique
  const refreshHistory = useCallback(() => {
    setHistory(getHistory());
  }, [getHistory]);

  // ✅ Logique de recherche corrigée — setResults JAMAIS appelé directement dans le body
  useEffect(() => {
    if (!query.trim()) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await omdbApi.search(query);
        if (!cancelled) setResults(res);
      } catch (err) {
        console.error('Erreur recherche:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // ✅ Gestion saisie — vide les résultats proprement hors du useEffect
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (!value.trim()) setResults([]);
  };

  // ✅ Sélection depuis l'historique
  const handleSelectFromHistory = (term: string) => {
    setQuery(term);
    setShowHistory(false);
    addToHistory(term);
    refreshHistory();
  };

  // ✅ Soumission formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addToHistory(query.trim());
      refreshHistory();
      setShowHistory(false);
    }
  };

  const handleRemove = (term: string) => {
    removeFromHistory(term);
    refreshHistory();
  };

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '90px 20px 40px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* ✅ Barre de recherche responsive */}
        <form
          onSubmit={handleSubmit}
          style={{ position: 'relative', maxWidth: '700px', margin: '0 auto 40px' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            backgroundColor: '#2a2a2a',
            border: '2px solid #E50914',
            borderRadius: '8px',
            padding: 'clamp(8px, 2vw, 14px) clamp(12px, 3vw, 20px)',
          }}>
            <span style={{ color: '#E50914', fontSize: 'clamp(16px, 3vw, 22px)', flexShrink: 0 }}>
              🔍
            </span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Titres, personnes, genres..."
              value={query}
              onChange={handleInputChange}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none', outline: 'none',
                color: '#fff',
                fontSize: 'clamp(14px, 3vw, 18px)',
                minWidth: 0,
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
                style={{
                  backgroundColor: 'transparent', border: 'none',
                  color: '#aaa', fontSize: '18px', cursor: 'pointer', flexShrink: 0,
                }}
              >✕</button>
            )}
          </div>

          {/* ✅ Dropdown historique responsive */}
          {showHistory && history.length > 0 && !query && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
              backgroundColor: '#1f1f1f',
              border: '1px solid #333',
              borderRadius: '8px',
              zIndex: 200,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 16px', borderBottom: '1px solid #333',
              }}>
                <span style={{ color: '#aaa', fontSize: '12px', textTransform: 'uppercase', fontWeight: 700 }}>
                  Recherches récentes
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    backgroundColor: 'transparent', border: 'none',
                    color: '#E50914', fontSize: '12px', cursor: 'pointer', fontWeight: 600,
                  }}
                >Effacer tout</button>
              </div>

              {history.map((term, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', borderBottom: '1px solid #222',
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2a2a2a')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div
                    onClick={() => handleSelectFromHistory(term)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}
                  >
                    <span style={{ color: '#aaa', fontSize: '16px' }}>🕒</span>
                    <span style={{ color: '#fff', fontSize: '15px' }}>{term}</span>
                  </div>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); handleRemove(term); }}
                    style={{
                      backgroundColor: 'transparent', border: 'none',
                      color: '#555', fontSize: '14px', cursor: 'pointer',
                      padding: '4px 8px', borderRadius: '4px', transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#E50914')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* ✅ État chargement */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ color: '#E50914', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '4px' }}>
              Recherche...
            </div>
          </div>
        )}

        {/* ✅ Aucun résultat */}
        {!loading && query && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎬</div>
            <p style={{ color: '#fff', fontSize: 'clamp(1rem, 3vw, 1.3rem)', fontWeight: 700 }}>
              Aucun résultat pour "{query}"
            </p>
            <p style={{ color: '#aaa', marginTop: '8px', fontSize: '14px' }}>
              Essaie un autre titre ou mot-clé
            </p>
          </div>
        )}

        {/* ✅ Page vide — invitation à chercher */}
        {!query && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', marginBottom: '16px' }}>🔍</div>
            <p style={{ color: '#fff', fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', fontWeight: 700 }}>
              Chercher des films et séries
            </p>
            <p style={{ color: '#aaa', marginTop: '8px', fontSize: '14px' }}>
              Tape le titre d'un film, d'une série ou un genre
            </p>
          </div>
        )}

        {/* ✅ Grille de résultats responsive */}
        {!loading && results.length > 0 && (
          <>
            <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
              {results.length} résultat{results.length > 1 ? 's' : ''} pour{' '}
              <span style={{ color: '#fff', fontWeight: 700 }}>"{query}"</span>
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(120px, 18vw, 180px), 1fr))',
              gap: 'clamp(8px, 2vw, 16px)',
            }}>
              {results.filter(m => fixPoster(m.Poster) !== '').map(movie => (
                <div
                  key={movie.imdbID}
                  onClick={() => {
                    addToHistory(query);
                    refreshHistory();
                    navigate(`/movie/${movie.imdbID}`);
                  }}
                  style={{
                    cursor: 'pointer', borderRadius: '6px',
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    backgroundColor: '#1f1f1f',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.8)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src={fixPoster(movie.Poster)}
                    alt={movie.Title}
                    style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ padding: 'clamp(6px, 2vw, 10px) 8px' }}>
                    <p style={{
                      color: '#fff',
                      fontSize: 'clamp(10px, 2vw, 13px)',
                      fontWeight: 700,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {movie.Title}
                    </p>
                    <p style={{ color: '#aaa', fontSize: 'clamp(9px, 1.5vw, 11px)', marginTop: '4px' }}>
                      {movie.Year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ✅ CSS responsive mobile injecté */}
      <style>{`
        @media (max-width: 480px) {
          input::placeholder { font-size: 13px; }
        }
      `}</style>
    </div>
  );
}