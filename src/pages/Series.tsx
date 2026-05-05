import { useEffect, useState } from 'react';
import { type Movie } from '../services/omdb';
import { omdbApi } from '../services/omdb';
import MovieRow from '../components/MovieRow';
import Navbar from '../components/Navbar';

export default function Series() {
  const [series,   setSeries]   = useState<Movie[]>([]);
  const [thriller, setThriller] = useState<Movie[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([omdbApi.getSeries(), omdbApi.getThriller()])
      .then(([s, t]) => { setSeries(s); setThriller(t); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ backgroundColor: '#141414', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#E50914', fontSize: '2rem', fontWeight: 900, letterSpacing: '4px' }}>NETFLIX</div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', paddingTop: '80px' }}>
      <Navbar />
      <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, padding: '20px 40px' }}>Séries</h1>
      <MovieRow title="📺 Séries populaires" movies={series} />
      <MovieRow title="😱 Thrillers"         movies={thriller} />
    </div>
  );
}