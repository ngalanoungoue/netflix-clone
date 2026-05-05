import { useRef } from 'react';
import { type Movie } from '../services/omdb';

interface MovieRowProps { title: string; movies: Movie[]; }

export default function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir === 'left' ? -600 : 600, behavior: 'smooth' });
    }
  };

  const validMovies = movies.filter(m => m.Poster && m.Poster !== 'N/A');
  if (validMovies.length === 0) return null;

  return (
    <div style={{ marginBottom: '40px' }}
      className="movie-row-container"
    >
      {/* Titre de la catégorie */}
      <h2 style={{
        color: '#e5e5e5',
        fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
        fontWeight: 700,
        padding: '0 40px',
        marginBottom: '12px',
        letterSpacing: '0.5px',
      }}>
        {title}
      </h2>

      {/* Rangée de films */}
      <div style={{ position: 'relative' }}>
        {/* Bouton gauche */}
        <button
          onClick={() => scroll('left')}
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: '#fff',
            border: 'none',
            padding: '0 12px',
            fontSize: '20px',
            cursor: 'pointer',
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
          className="scroll-btn"
        >
          ‹
        </button>

        {/* Films */}
        <div
          ref={rowRef}
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            padding: '8px 40px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          } as React.CSSProperties}
        >
          {validMovies.map((movie) => (
            <div
              key={movie.imdbID}
              style={{
                flexShrink: 0,
                width: 'clamp(120px, 15vw, 180px)',
                cursor: 'pointer',
                borderRadius: '4px',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.8)';
                e.currentTarget.style.zIndex = '20';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.zIndex = '1';
              }}
            >
              <img
                src={movie.Poster}
                alt={movie.Title}
                style={{
                  width: '100%',
                  aspectRatio: '2/3',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* Overlay au hover */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)',
                padding: '20px 8px 8px',
                opacity: 0,
                transition: 'opacity 0.2s',
              }}
                className="movie-overlay"
              >
                <p style={{
                  color: '#fff', fontSize: '11px', fontWeight: 700,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {movie.Title}
                </p>
                <p style={{ color: '#aaa', fontSize: '10px' }}>{movie.Year}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton droit */}
        <button
          onClick={() => scroll('right')}
          style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: '#fff',
            border: 'none',
            padding: '0 12px',
            fontSize: '20px',
            cursor: 'pointer',
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
          className="scroll-btn"
        >
          ›
        </button>
      </div>
    </div>
  );
}