import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type Movie, omdbApi, fixPoster } from '../services/omdb';
import Navbar from '../components/Navbar';

export default function MovieDetail() {
  const { id }       = useParams<{ id: string }>();
  const navigate     = useNavigate();
  const [movie,      setMovie]     = useState<Movie | null>(null);
  const [playing,    setPlaying]   = useState(false);
  const [trailerId,  setTrailerId] = useState<string | null>(null);

  useEffect(() => {
    if (id) omdbApi.getDetails(id).then(setMovie);
  }, [id]);

  useEffect(() => {
    if (!movie) return;
    const fetchTrailer = async () => {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(movie.Title + ' official trailer')}&type=video&key=${import.meta.env.VITE_YOUTUBE_API_KEY}&maxResults=1`
      );
      const data = await res.json();
      if (data.items?.[0]) {
        setTrailerId(data.items[0].id.videoId);
      }
    };
    fetchTrailer();
  }, [movie]);

  if (!movie) return (
    <div style={{ backgroundColor: '#141414', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#E50914', fontSize: '2rem', fontWeight: 900, letterSpacing: '4px' }}>Chargement...</div>
    </div>
  );

  const poster = fixPoster(movie.Poster);

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh' }}>
      <Navbar />

      {/* Image de fond */}
      <div style={{ position: 'relative', height: '60vh' }}>
        {poster ? (
          <img src={poster} alt={movie.Title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#1a1a2e' }} />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, #141414 0%, transparent 60%)',
        }} />
      </div>

      {/* Contenu principal */}
      <div style={{ padding: '0 40px 60px', marginTop: '-150px', position: 'relative', zIndex: 10 }}>
        <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '16px' }}>
          {movie.Title}
        </h1>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <span style={{ color: '#46d369', fontWeight: 700 }}>{movie.Year}</span>
          {movie.imdbRating && movie.imdbRating !== 'N/A' && (
            <span style={{ color: '#f5c518' }}>⭐ {movie.imdbRating}/10</span>
          )}
          <span style={{ color: '#aaa' }}>{movie.Genre}</span>
        </div>

        {/* ✅ Lecteur avec vrai ID YouTube */}
        {playing && trailerId ? (
          <div style={{ marginBottom: '32px', maxWidth: '900px' }}>
            <div style={{
              position: 'relative', paddingBottom: '56.25%',
              height: 0, borderRadius: '8px', overflow: 'hidden',
            }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                src={`https://www.youtube.com/embed/${trailerId}?autoplay=1`}
                title={movie.Title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <button onClick={() => setPlaying(false)} style={{
              marginTop: '12px', backgroundColor: 'transparent',
              border: '1px solid #aaa', color: '#aaa',
              padding: '8px 20px', borderRadius: '4px',
              cursor: 'pointer', fontSize: '14px',
            }}>
              ✕ Fermer le lecteur
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                if (trailerId) {
                  setPlaying(true);
                } else {
                  alert('Bande-annonce non disponible pour ce film.');
                }
              }}
              style={{
                backgroundColor: '#fff', color: '#000',
                border: 'none', borderRadius: '4px',
                padding: '14px 32px', fontSize: '18px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              {trailerId ? '▶ Lecture' : '⏳ Chargement...'}
            </button>
            <button
              onClick={() => navigate(-1)}
              style={{
                backgroundColor: 'rgba(109,109,110,0.7)', color: '#fff',
                border: 'none', borderRadius: '4px',
                padding: '14px 32px', fontSize: '18px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              ← Retour
            </button>
          </div>
        )}

        <div style={{ maxWidth: '700px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Synopsis</h3>
          <p style={{ color: '#ddd', lineHeight: 1.8, fontSize: '16px' }}>{movie.Plot}</p>
        </div>
      </div>
    </div>
  );
}