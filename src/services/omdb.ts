import axios from 'axios';

const API_KEY  = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_OMDB_BASE_URL;

export interface Movie {
  imdbID:      string;
  Title:       string;
  Year:        string;
  Poster:      string;
  Type:        string;
  imdbRating?: string;
  Plot?:       string;
  Genre?:      string;
}

interface SearchResult {
  Search:       Movie[];
  totalResults: string;
  Response:     string;
}

export const fixPoster = (url: string): string => {
  if (!url || url === 'N/A') return '';
  return url.replace('http://', 'https://').replace('SX300', 'SX600');
};

const searchMovies = async (query: string, type = 'movie'): Promise<Movie[]> => {
  try {
    const res = await axios.get<SearchResult>(BASE_URL, {
      params: { apikey: API_KEY, s: query, type },
    });
    if (res.data.Response === 'True') return res.data.Search;
    return [];
  } catch { return []; }
};

const getDetails = async (imdbID: string): Promise<Movie | null> => {
  try {
    const res = await axios.get(BASE_URL, {
      params: { apikey: API_KEY, i: imdbID, plot: 'short' },
    });
    if (res.data.Response === 'True') return res.data;
    return null;
  } catch { return null; }
};

export const omdbApi = {
  getTrending:  () => searchMovies('avengers'),
  getAction:    () => searchMovies('action hero'),
  getComedy:    () => searchMovies('comedy 2023'),
  getThriller:  () => searchMovies('thriller'),
  getAnimation: () => searchMovies('pixar'),
  getSeries:    () => searchMovies('breaking bad', 'series'),
  getHero:      () => searchMovies('batman'),
  search:       (query: string) => searchMovies(query),
  getDetails,
};