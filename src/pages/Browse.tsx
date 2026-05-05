import { useEffect, useState } from 'react';
import { omdbApi,  type Movie } from '../services/omdb';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import Navbar from '../components/Navbar';

export default function Browse() {
  const [trending,   setTrending]   = useState<Movie[]>([]);
  const [action,     setAction]     = useState<Movie[]>([]);
  const [comedy,     setComedy]     = useState<Movie[]>([]);
  const [thriller,   setThriller]   = useState<Movie[]>([]);
  const [animation,  setAnimation]  = useState<Movie[]>([]);
  const [heroMovie,  setHeroMovie]  = useState<Movie | null>(null);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, a, c, th, an] = await Promise.all([
          omdbApi.getTrending(),
          omdbApi.getAction(),
          omdbApi.getComedy(),
          omdbApi.getThriller(),
          omdbApi.getAnimation(),
        ]);
        setTrending(t);
        setAction(a);
        setComedy(c);
        setThriller(th);
        setAnimation(an);

        // Charger les détails du film héro pour avoir le synopsis et la note
        if (t.length > 0) {
          const details = await omdbApi.getDetails(t[0].imdbID);
          setHeroMovie(details);
        }
      } catch (err) {
        console.error('Erreur OMDB:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="bg-netflix-dark h-screen flex items-center justify-center">
        <div className="text-netflix-red text-4xl font-black animate-pulse tracking-widest">NETFLIX</div>
      </div>
    );
  }

  return (
    <div className="bg-netflix-dark min-h-screen">
      <Navbar />
      {heroMovie && <Hero movie={heroMovie} />}

      <div className="-mt-20 relative z-10 pb-20">
        <MovieRow title="🔥 Tendances"    movies={trending} />
        <MovieRow title="💥 Action"       movies={action} />
        <MovieRow title="😂 Comédies"     movies={comedy} />
        <MovieRow title="😱 Thrillers"    movies={thriller} />
        <MovieRow title="🎨 Animation"    movies={animation} />
      </div>
    </div>
  );
}