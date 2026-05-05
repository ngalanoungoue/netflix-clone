import { useState } from 'react';
import { type Movie, fixPoster } from '../services/omdb';

interface HeroProps { movie: Movie; }

export default function Hero({ movie }: HeroProps) {
  const [showModal, setShowModal] = useState(false);
  const poster = fixPoster(movie?.Poster);

  return (
    <div style={{ position: 'relative', height: '85vh', minHeight: '500px', width: '100%' }}>

      {/* Image de fond */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {poster ? (
          <img src={poster} alt={movie.Title}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'top center',
              filter: 'brightness(0.6)',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          }} />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px',
          background: 'linear-gradient(to top, #141414 0%, transparent 100%)',
        }} />
      </div>

      {/* Contenu */}
      <div style={{
        position: 'absolute', bottom: '120px', left: '40px', right: '40px',
        maxWidth: '550px', zIndex: 10,
      }}>
        <h1 style={{
          color: '#fff',
          fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
          fontWeight: 900, lineHeight: 1.1, marginBottom: '16px',
          textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
        }}>
          {movie?.Title}
        </h1>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {movie?.Year && (
            <span style={{ color: '#46d369', fontWeight: 700, fontSize: '14px' }}>{movie.Year}</span>
          )}
          {movie?.imdbRating && movie.imdbRating !== 'N/A' && (
            <span style={{ color: '#f5c518', fontSize: '14px' }}>⭐ {movie.imdbRating}/10</span>
          )}
          {movie?.Genre && (
            <span style={{ color: '#aaa', fontSize: '13px' }}>{movie.Genre?.split(',')[0]}</span>
          )}
        </div>

        {movie?.Plot && movie.Plot !== 'N/A' && (
          <p style={{
            color: '#ddd', fontSize: 'clamp(13px, 2vw, 15px)',
            lineHeight: 1.6, marginBottom: '24px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
            textShadow: '1px 1px 4px rgba(0,0,0,0.9)',
          }}>
            {movie.Plot}
          </p>
        )}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + ' trailer')}`, '_blank')}
            style={{
              backgroundColor: '#fff', color: '#000',
              border: 'none', borderRadius: '4px',
              padding: '12px 28px', fontSize: '16px', fontWeight: 700, cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ccc')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            ▶ Lecture
          </button>
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: 'rgba(109,109,110,0.7)', color: '#fff',
              border: 'none', borderRadius: '4px',
              padding: '12px 28px', fontSize: '16px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            ℹ Plus d'infos
          </button>
        </div>
      </div>

      {/* Modal Plus d'infos */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#181818', borderRadius: '8px',
              maxWidth: '600px', width: '100%', overflow: 'hidden',
            }}
          >
            {poster && (
              <img src={poster} alt={movie.Title}
                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
            )}
            <div style={{ padding: '24px' }}>
              <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>
                {movie?.Title}
              </h2>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{ color: '#46d369', fontWeight: 700 }}>{movie?.Year}</span>
                {movie?.imdbRating && <span style={{ color: '#f5c518' }}>⭐ {movie.imdbRating}/10</span>}
                <span style={{ color: '#aaa' }}>{movie?.Genre}</span>
              </div>
              <p style={{ color: '#ddd', lineHeight: 1.7, marginBottom: '20px' }}>{movie?.Plot}</p>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: '#fff', color: '#000',
                  border: 'none', borderRadius: '4px',
                  padding: '10px 24px', fontWeight: 700, cursor: 'pointer',
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}