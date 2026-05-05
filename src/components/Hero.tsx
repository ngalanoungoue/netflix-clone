import {type  Movie } from '../services/omdb';

interface HeroProps { movie: Movie; }

export default function Hero({ movie }: HeroProps) {
  const hasPoster = movie?.Poster && movie.Poster !== 'N/A';

  return (
    <div style={{
      position: 'relative',
      height: '85vh',
      minHeight: '500px',
      width: '100%',
    }}>
      {/* Image de fond */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {hasPoster ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              filter: 'brightness(0.6)',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          }} />
        )}
        {/* Dégradé gauche */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
        }} />
        {/* Dégradé bas */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '200px',
          background: 'linear-gradient(to top, #141414 0%, transparent 100%)',
        }} />
      </div>

      {/* Contenu */}
      <div style={{
        position: 'absolute',
        bottom: '120px',
        left: '40px',
        right: '40px',
        maxWidth: '550px',
        zIndex: 10,
      }}>
        <h1 style={{
          color: '#fff',
          fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: '16px',
          textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
        }}>
          {movie?.Title}
        </h1>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {movie?.Year && (
            <span style={{
              color: '#46d369', fontWeight: 700, fontSize: '14px',
            }}>
              {movie.Year}
            </span>
          )}
          {movie?.imdbRating && movie.imdbRating !== 'N/A' && (
            <span style={{ color: '#f5c518', fontSize: '14px' }}>
              ⭐ {movie.imdbRating}/10
            </span>
          )}
          {movie?.Genre && (
            <span style={{ color: '#aaa', fontSize: '13px' }}>
              {movie.Genre?.split(',')[0]}
            </span>
          )}
        </div>

        {movie?.Plot && movie.Plot !== 'N/A' && (
          <p style={{
            color: '#ddd',
            fontSize: 'clamp(13px, 2vw, 15px)',
            lineHeight: 1.6,
            marginBottom: '24px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' ,
            overflow: 'hidden',
            textShadow: '1px 1px 4px rgba(0,0,0,0.9)',
          }}>
            {movie.Plot}
          </p>
        )}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#fff',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 28px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ccc')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            ▶ Lecture
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(109,109,110,0.7)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 28px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
          }}>
            ℹ Plus d'infos
          </button>
        </div>
      </div>
    </div>
  );
}