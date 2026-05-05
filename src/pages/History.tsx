import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { omdbApi, type Movie, fixPoster } from '../services/omdb';
import Navbar from '../components/Navbar';

export default function History() {
  const navigate = useNavigate();
  const { getHistory, removeFromHistory, clearHistory } = useSearchHistory();

  // Initialiser directement sans useEffect pour éviter les cascades
  const [history, setHistory] = useState<string[]>(() => getHistory());
  const [suggestions, setSuggestions] = useState<Movie[]>(() => []);

  // Charger suggestions une seule fois au montage via useState initializer
  useState(() => {
    const h = getHistory();
    if (h.length > 0) {
      omdbApi.search(h[0]).then(setSuggestions);
    }
  });

  const refreshHistory = useCallback(() => {
    setHistory(getHistory());
  }, [getHistory]);

  const handleRemove = (term: string) => {
    removeFromHistory(term);
    refreshHistory();
  };

  const handleClear = () => {
    clearHistory();
    setHistory([]);
    setSuggestions([]);
  };

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '90px 40px 40px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '32px',
        }}>
          <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900 }}>
            🕐 Historique de recherche
          </h1>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              style={{
                backgroundColor: 'transparent', border: '1px solid #E50914',
                color: '#E50914', padding: '10px 20px',
                borderRadius: '4px', cursor: 'pointer', fontSize: '14px',
              }}
            >
              Tout effacer
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
            <p style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>
              Aucune recherche récente
            </p>
            <p style={{ color: '#aaa', marginTop: '8px' }}>
              Tes recherches apparaîtront ici
            </p>
            <button
              onClick={() => navigate('/search')}
              style={{
                marginTop: '24px', backgroundColor: '#E50914', color: '#fff',
                border: 'none', borderRadius: '4px',
                padding: '12px 28px', fontSize: '16px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              🔍 Rechercher
            </button>
          </div>
        ) : (
          <>
            {/* Liste historique */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '12px', marginBottom: '48px',
            }}>
              {history.map((term, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    backgroundColor: '#1f1f1f', borderRadius: '8px',
                    padding: '14px 16px', transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2a2a2a')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1f1f1f')}
                >
                  <div
                    onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer' }}
                  >
                    <span style={{ fontSize: '18px' }}>🔍</span>
                    <span style={{ color: '#fff', fontSize: '15px' }}>{term}</span>
                  </div>
                  <button
                    onClick={() => handleRemove(term)}
                    style={{
                      backgroundColor: 'transparent', border: 'none',
                      color: '#666', fontSize: '16px', cursor: 'pointer',
                      padding: '4px 8px', borderRadius: '4px',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#E50914')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#666')}
                  >✕</button>
                </div>
              ))}
            </div>

            {/* Suggestions basées sur la dernière recherche */}
            {suggestions.filter(m => fixPoster(m.Poster) !== '').length > 0 && (
              <>
                <h2 style={{
                  color: '#e5e5e5', fontSize: '1.3rem',
                  fontWeight: 700, marginBottom: '20px',
                }}>
                  🎬 Basé sur ta dernière recherche — "{history[0]}"
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                  gap: '16px',
                }}>
                  {suggestions.filter(m => fixPoster(m.Poster) !== '').map(movie => (
                    <div
                      key={movie.imdbID}
                      onClick={() => navigate(`/movie/${movie.imdbID}`)}
                      style={{
                        cursor: 'pointer', borderRadius: '6px',
                        overflow: 'hidden', transition: 'transform 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <img
                        src={fixPoster(movie.Poster)}
                        alt={movie.Title}
                        style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{ padding: '8px', backgroundColor: '#1f1f1f' }}>
                        <p style={{
                          color: '#fff', fontSize: '12px', fontWeight: 700,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {movie.Title}
                        </p>
                        <p style={{ color: '#aaa', fontSize: '11px' }}>{movie.Year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}