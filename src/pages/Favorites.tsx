import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { myApi, type FavoriteMovie } from '../services/myApi';
import { fixPoster } from '../services/omdb';
import Navbar from '../components/Navbar';

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await myApi.getAll();
      setFavorites(data);
    } catch {
      setError('Impossible de charger les favoris.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [load]);

  const handleRemove = async (imdbId: string, title: string) => {
    if (!confirm(`Retirer "${title}" des favoris ?`)) return;
    try {
      await myApi.removeFavorite(imdbId);
      setFavorites(prev => prev.filter(f => f.imdbId !== imdbId));
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  if (loading) return (
    <div style={{ backgroundColor: '#141414', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#E50914', fontSize: '2rem', fontWeight: 900, letterSpacing: '4px' }}>
        Chargement...
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '90px 40px 40px' }}>

        {/* En-tête */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: '8px' }}>
            ❤️ Mes Favoris
          </h1>
          <p style={{ color: '#aaa', fontSize: '14px' }}>
            {favorites.length} film{favorites.length > 1 ? 's' : ''} dans ta collection personnelle
          </p>
        </div>

        {/* Erreur API */}
        {error && (
          <div style={{
            backgroundColor: '#2a1a1a', border: '1px solid #E50914',
            borderRadius: '8px', padding: '20px', marginBottom: '32px',
            color: '#ff6b6b', fontSize: '14px',
          }}>
            ⚠️ {error}
            <button
              onClick={load}
              style={{
                marginLeft: '16px', backgroundColor: '#E50914',
                border: 'none', color: '#fff', padding: '6px 16px',
                borderRadius: '4px', cursor: 'pointer', fontSize: '13px',
              }}
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Liste vide */}
        {!error && favorites.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎬</div>
            <p style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700 }}>
              Aucun favori pour l'instant
            </p>
            <p style={{ color: '#aaa', marginTop: '8px', fontSize: '14px' }}>
              Clique sur ❤️ sur un film pour l'ajouter ici
            </p>
            <button
              onClick={() => navigate('/browse')}
              style={{
                marginTop: '24px', backgroundColor: '#E50914', color: '#fff',
                border: 'none', borderRadius: '4px',
                padding: '12px 28px', fontSize: '16px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Explorer les films
            </button>
          </div>
        )}

        {/* Grille de favoris */}
        {favorites.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '24px',
          }}>
            {favorites.map(movie => (
              <div
                key={movie.imdbId}
                style={{
                  backgroundColor: '#1f1f1f',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.8)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Affiche */}
                <div style={{ position: 'relative', cursor: 'pointer' }}
                  onClick={() => navigate(`/movie/${movie.imdbId}`)}>
                  <img
                    src={fixPoster(movie.posterUrl) || movie.posterUrl}
                    alt={movie.title}
                    style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Badge favori */}
                  <div style={{
                    position: 'absolute', top: '8px', right: '8px',
                    backgroundColor: '#E50914', borderRadius: '50%',
                    width: '28px', height: '28px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px',
                  }}>
                    ❤️
                  </div>
                </div>

                {/* Infos */}
                <div style={{ padding: '12px' }}>
                  <p style={{
                    color: '#fff', fontSize: '14px', fontWeight: 700,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    marginBottom: '4px',
                  }}>
                    {movie.title}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ color: '#46d369', fontSize: '12px' }}>{movie.year}</span>
                    {movie.imdbRating && (
                      <span style={{ color: '#f5c518', fontSize: '12px' }}>⭐ {movie.imdbRating}</span>
                    )}
                  </div>

                  {/* Note personnelle */}
                  {movie.personalNote && (
                    <p style={{
                      color: '#aaa', fontSize: '12px', fontStyle: 'italic',
                      marginBottom: '10px', lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                    }}>
                      "{movie.personalNote}"
                    </p>
                  )}

                  {/* Date d'ajout */}
                  {movie.addedAt && (
                    <p style={{ color: '#555', fontSize: '11px', marginBottom: '10px' }}>
                      Ajouté le {new Date(movie.addedAt).toLocaleDateString('fr-FR')}
                    </p>
                  )}

                  {/* Bouton retirer */}
                  <button
                    onClick={() => handleRemove(movie.imdbId, movie.title)}
                    style={{
                      width: '100%', backgroundColor: 'transparent',
                      border: '1px solid #555', color: '#aaa',
                      padding: '7px', borderRadius: '4px',
                      fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#E50914';
                      e.currentTarget.style.color = '#E50914';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#555';
                      e.currentTarget.style.color = '#aaa';
                    }}
                  >
                    🗑️ Retirer des favoris
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}