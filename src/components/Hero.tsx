import { type Movie } from '../services/omdb';

interface HeroProps { movie: Movie; }

export default function Hero({ movie }: HeroProps) {
  const hasPoster = movie?.Poster && movie.Poster !== 'N/A';

  return (
    <div className="relative h-[85vh]">
      <div className="absolute inset-0">
        {hasPoster ? (
          <img src={movie.Poster} alt={movie.Title}
            className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-netflix-dark" />
      </div>

      <div className="absolute bottom-32 left-10 max-w-lg z-10">
        <h1 className="text-white text-5xl font-black mb-3">{movie?.Title}</h1>
        <p className="text-gray-300 text-sm mb-2">{movie?.Year} · {movie?.Genre}</p>
        {movie?.imdbRating && (
          <p className="text-yellow-400 font-bold mb-4">⭐ {movie.imdbRating} / 10</p>
        )}
        <p className="text-white text-sm line-clamp-3 mb-5">{movie?.Plot}</p>

        <div className="flex gap-3">
          <button className="bg-white text-black px-8 py-3 rounded font-bold text-lg hover:bg-gray-200 transition">
            ▶ Lecture
          </button>
          <button className="bg-gray-600 bg-opacity-70 text-white px-8 py-3 rounded font-bold text-lg hover:bg-opacity-50 transition">
            ℹ Plus d'infos
          </button>
        </div>
      </div>
    </div>
  );
}