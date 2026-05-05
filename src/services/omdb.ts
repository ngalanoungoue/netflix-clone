import axios from 'axios';

const API_KEY  = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_OMDB_BASE_URL;

export interface Movie {
  imdbID:   string;
  Title:    string;
  Year:     string;
  Poster:   string;   // URL directe de l'affiche — pas besoin de base URL séparée !
  Type:     string;
  imdbRating?: string;
  Plot?:    string;
  Genre?:   string;
}

interface SearchResult {
  Search: Movie[];
  totalResults: string;
  Response: string;
}

// Chercher des films par mot-clé
const search = async (query: string, type = 'movie'): Promise<Movie[]> => {
  const res = await axios.get<SearchResult>(BASE_URL, {
    params: { apikey: API_KEY, s: query, type },
  });
  if (res.data.Response === 'True') return res.data.Search;
  return [];
};

// Obtenir les détails complets d'un film (avec note et synopsis)
const getDetails = async (imdbID: string): Promise<Movie | null> => {
  const res = await axios.get(BASE_URL, {
    params: { apikey: API_KEY, i: imdbID, plot: 'short' },
  });
  if (res.data.Response === 'True') return res.data;
  return null;
};

export const omdbApi = {
  // Catégories simulées via des recherches par mots-clés populaires
  getTrending:      () => search('avengers'),
  getAction:        () => search('action hero'),
  getComedy:        () => search('comedy 2023'),
  getThriller:      () => search('thriller'),
  getAnimation:     () => search('pixar'),
  getSeries:        () => search('breaking bad', 'series'),
  getHero:          () => search('batman'),
  getDetails,
};