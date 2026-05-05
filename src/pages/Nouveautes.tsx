import { useEffect, useState } from 'react';
import { type Movie } from '../services/omdb';
import { omdbApi } from '../services/omdb';
import MovieRow from '../components/MovieRow';
import Navbar from '../components/Navbar';

export default function Nouveautes() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    omdbApi.getTrending().then(t => { setTrending(t); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ backgroundColor: '#141414', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#E50914', fontSize: '2rem', fontWeight: 900, letterSpacing: '4px' }}>NETFLIX</div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', paddingTop: '80px' }}>
      <Navbar />
      <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, padding: '20px 40px' }}>Nouveautés</h1>
      <MovieRow title="🔥 Tendances du moment" movies={trending} />
    </div>
  );
}