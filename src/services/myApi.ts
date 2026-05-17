import axios from 'axios';

// En dev → localhost, en prod → Railway (voir Phase 5)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface FavoriteMovie {
  id?:           number;
  imdbId:        string;
  title:         string;
  posterUrl:     string;
  year:          string;
  genre?:        string;
  imdbRating?:   string;
  personalNote?: string;
  addedAt?:      string;
}

const client = axios.create({ baseURL: BASE_URL });

export const myApi = {

  // Récupérer tous les favoris
  getAll: async (): Promise<FavoriteMovie[]> => {
    const res = await client.get('/api/movies');
    return res.data;
  },

  // Vérifier si un film est en favoris
  isFavorite: async (imdbId: string): Promise<boolean> => {
    const res = await client.get(`/api/movies/check/${imdbId}`);
    return res.data.isFavorite;
  },

  // Ajouter aux favoris
  addFavorite: async (movie: FavoriteMovie): Promise<FavoriteMovie> => {
    const res = await client.post('/api/movies', movie);
    return res.data;
  },

  // Mettre à jour la note
  updateNote: async (imdbId: string, note: string): Promise<FavoriteMovie> => {
    const res = await client.patch(`/api/movies/${imdbId}/note`, { note });
    return res.data;
  },

  // Retirer des favoris
  removeFavorite: async (imdbId: string): Promise<void> => {
    await client.delete(`/api/movies/${imdbId}`);
  },
};