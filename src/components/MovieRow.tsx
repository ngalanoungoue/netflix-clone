import { useRef } from 'react';
import { type Movie } from '../services/omdb';

interface MovieRowProps { title: string; movies: Movie[]; }

export default function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (rowRef.current) rowRef.current.scrollLeft += dir === 'left' ? -500 : 500;
  };

  return (
    <div className="mb-8 group">
      <h2 className="text-white text-xl font-bold mb-3 px-10">{title}</h2>
      <div className="relative">
        <button onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 bg-black/50 text-white px-3 opacity-0 group-hover:opacity-100 transition">
          ◀
        </button>

        <div ref={rowRef}
          className="flex gap-2 overflow-x-scroll scrollbar-hide px-10 scroll-smooth">
          {movies.filter(m => m.Poster && m.Poster !== 'N/A').map((movie) => (
            <div key={movie.imdbID}
              className="flex-none w-40 cursor-pointer hover:scale-110 transition duration-200 hover:z-10 relative">
              <img src={movie.Poster} alt={movie.Title}
                className="w-full h-60 object-cover rounded" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent
                p-2 opacity-0 hover:opacity-100 transition rounded-b">
                <p className="text-white text-xs font-bold truncate">{movie.Title}</p>
                <p className="text-gray-300 text-xs">{movie.Year}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 bg-black/50 text-white px-3 opacity-0 group-hover:opacity-100 transition">
          ▶
        </button>
      </div>
    </div>
  );
}