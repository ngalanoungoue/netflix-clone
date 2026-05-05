# 🎬 Netflix Clone — Weekend Sprint Guide (V2 — Zéro inscription requise)
> Construire un clone Netflix complet en 1 weekend avec Visual Studio Code  
> ✅ Toutes les APIs utilisées sont **gratuites, sans compte, sans email de vérification**

---

## ⚠️ Pourquoi cette V2 ?

La V1 utilisait **TMDB** qui exige une vérification email — un processus peu fiable qui peut bloquer ton accès plusieurs jours.

Cette V2 remplace TMDB par **deux APIs 100% gratuites et sans inscription** :

| Ancienne solution | Nouvelle solution | Avantage |
|---|---|---|
| TMDB (inscription + vérification email) | **OMDB API** (clé email instantanée) | Clé reçue en 30 secondes |
| TMDB images | **Fanart.tv** ou images OMDB incluses | Aucune conf supplémentaire |
| Firebase Auth (compte Google requis) | **Supabase** (connexion GitHub) | Setup en 5 min |

---

## 🗺️ Vue d'ensemble du projet

**Stack technologique :**
- **Frontend :** React + TypeScript + Tailwind CSS
- **API films :** OMDB API — gratuite, clé instantanée, aucune vérification email
- **Auth + BDD :** Supabase (gratuit, connexion via GitHub)
- **Déploiement :** Vercel (frontend)

**Durée estimée :** 16–20 heures (réparties sur 2 jours)

---

## 🛠️ ENVIRONNEMENT OBLIGATOIRE — Installation complète

### 1. Node.js (OBLIGATOIRE)
> Sans Node.js, rien ne fonctionne.

**Télécharger :** https://nodejs.org/en/download  
**Version requise :** Node.js 18 LTS ou supérieur  
**Vérification après installation :**
```bash
node -v    # doit afficher v18.x.x ou supérieur
npm -v     # doit afficher 9.x.x ou supérieur
```

---

### 2. Visual Studio Code (OBLIGATOIRE)
**Télécharger :** https://code.visualstudio.com/download  
Choisir la version pour ton système (Windows / macOS / Linux)

---

### 3. Git (OBLIGATOIRE)
**Télécharger :** https://git-scm.com/downloads  
**Vérification :**
```bash
git --version    # doit afficher git version 2.x.x
```

---

### 4. ✅ Clé API OMDB — GRATUITE, SANS VÉRIFICATION EMAIL (5 min)

> OMDB est une alternative directe à TMDB. La clé arrive **immédiatement** dans ta boîte mail sans étape de vérification.

**Étapes exactes :**
1. Aller sur : **http://www.omdbapi.com/apikey.aspx**
2. Choisir le plan **FREE** (1 000 requêtes/jour — largement suffisant)
3. Remplir uniquement : ton prénom, nom, et adresse email
4. Cliquer **Submit**
5. Ouvrir ta boîte mail → tu reçois un email avec ta clé en **moins de 2 minutes**
6. Cliquer le lien d'activation dans l'email (une seule étape, pas de mot de passe à créer)
7. Ta clé est de la forme : `42e3ee52`
OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=42e3e

> 💡 Si tu ne reçois pas l'email dans 2 min → vérifier les spams. OMDB est beaucoup plus fiable que TMDB pour l'envoi d'emails.

---

### 5. ✅ Supabase — Auth + Base de données GRATUITE (10 min)

> Supabase remplace Firebase. Connexion via GitHub, aucune vérification email supplémentaire.

**Étapes exactes :**
1. Aller sur : **https://supabase.com**
2. Cliquer **Start your project**
3. Se connecter avec **GitHub** (pas besoin de créer un nouveau compte)
4. Cliquer **New project** → donner un nom : `netflix-clone`
5. Choisir un mot de passe pour la base de données → **AZERTY12345@a!gcutu;xu**
6. Choisir la région la plus proche (ex : Europe West)
7. Attendre ~2 minutes que le projet se crée
8. Aller dans **Project Settings → API**
9. Copier :
   - **Project URL** → ressemble à `https://rzaslckvbbfathbpevff.supabase.co`
   - **anon public key** → sb_publishable_LwAztnoH7EZNcBBgKP9e4A_nTzjQmG5

---

## 🔌 EXTENSIONS VS CODE — À installer TOUTES

Ouvrir VS Code → presser `Ctrl+Shift+X` (ou `Cmd+Shift+X` sur Mac) → rechercher et installer chaque extension :

| # | Nom exact à taper | Éditeur | Utilité |
|---|-------------------|---------|---------|
| 1 | `ES7+ React/Redux/React-Native snippets` | dsznajder | Raccourcis React |
| 2 | `Tailwind CSS IntelliSense` | Tailwind Labs | Autocomplétion CSS |
| 3 | `Prettier - Code formatter` | Prettier | Formatage automatique |
| 4 | `ESLint` | Microsoft | Détection d'erreurs JS/TS |
| 5 | `TypeScript Hero` | rbbit | Import auto TypeScript |
| 6 | `Auto Import` | steoates | Import automatique |
| 7 | `GitLens` | GitKraken | Visualiser l'historique Git |
| 8 | `Thunder Client` | Rangav | Tester les API REST |
| 9 | `DotENV` | mikestead | Coloration fichiers .env |
| 10 | `Error Lens` | Alexander | Afficher les erreurs inline |
| 11 | `Bracket Pair Color DLW` | Bracket Pair Color DLW | Colorier les accolades |
| 12 | `Path Intellisense` | Christian Kohler | Autocomplétion des chemins |

---

## 📁 STRUCTURE DU PROJET

```
netflix-clone/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── MovieRow.tsx
│   │   └── MovieCard.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   └── Browse.tsx
│   ├── hooks/
│   │   └── useMovies.ts
│   ├── services/
│   │   ├── omdb.ts          ← Appels API OMDB (remplace TMDB)
│   │   └── supabase.ts      ← Config Supabase (remplace Firebase)
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── App.tsx
│   └── main.tsx
├── .env
├── package.json
└── tailwind.config.js
```

---

## ⚡ SPRINT — JOUR 1 (Samedi) — 8 à 10 heures

---

### 🟦 ÉTAPE 1 — Initialiser le projet (30 min)

Ouvrir un terminal dans VS Code (`Ctrl+`` ` `` `) :

```bash
# Créer le projet React avec Vite + TypeScript
npm create vite@latest netflix-clone -- --template react-ts
cd netflix-clone

# Installer les dépendances
npm install

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# React Router
npm install react-router-dom

# Supabase (remplace Firebase)
npm install @supabase/supabase-js

# Axios
npm install axios

# Lancer pour vérifier
npm run dev
```

Ouvrir `http://localhost:5173` → page Vite par défaut ✅

**Configurer Tailwind** — remplacer `tailwind.config.js` :
```js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'netflix-red': '#E50914',
        'netflix-dark': '#141414',
        'netflix-gray': '#2F2F2F',
      },
    },
  },
  plugins: [],
}
```

Remplacer `src/index.css` :
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
```

---

### 🟦 ÉTAPE 2 — Configurer Supabase (20 min)

Créer `src/services/supabase.ts` :

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

Créer le fichier `.env` à la racine :
```env
VITE_SUPABASE_URL=https://XXXXXX.supabase.co
VITE_SUPABASE_ANON_KEY=ta_clé_anon_ici
VITE_OMDB_API_KEY=ta_clé_omdb_ici
VITE_OMDB_BASE_URL=https://www.omdbapi.com
```

> ⚠️ Remplacer les valeurs par celles copiées depuis Supabase → Project Settings → API

---

### 🟦 ÉTAPE 3 — Service OMDB (API films) (45 min)

> OMDB retourne les films avec poster, titre, année, note. On va construire des catégories en cherchant par genre/mots-clés.

Créer `src/services/omdb.ts` :

```typescript
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
```

---

### 🟦 ÉTAPE 4 — Système d'authentification Supabase (1h)

Créer `src/context/AuthContext.tsx` :

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthContextType {
  user:     User | null;
  loading:  boolean;
  login:    (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout:   () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session au démarrage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écouter les changements de session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const register = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

### 🟦 ÉTAPE 5 — Page Login (1h)

Créer `src/pages/Login.tsx` :

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error,      setError]      = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate('/browse');
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion. Réessaie.');
    }
  };

  return (
    <div className="relative h-screen bg-black">
      <div className="absolute inset-0 opacity-40">
        <img
          src="https://assets.nflxext.com/ffe/siteui/vlv3/701e96f8-db52-4073-8a17-f82c67d9ecd4/web/FR-fr-20250210-TRIFECTA-perspective_a3b3bd44-f6ab-4ab2-b26c-92765ab87d2e_large.jpg"
          alt="bg" className="w-full h-full object-cover"
        />
      </div>

      <nav className="relative z-10 px-10 py-5">
        <div className="text-netflix-red text-4xl font-black tracking-widest">NETFLIX</div>
      </nav>

      <div className="relative z-10 flex items-center justify-center" style={{ height: 'calc(100vh - 80px)' }}>
        <div className="bg-black bg-opacity-80 p-14 rounded-md w-full max-w-md">
          <h1 className="text-white text-3xl font-bold mb-8">
            {isRegister ? 'Inscription' : 'Se connecter'}
          </h1>

          {error && (
            <div className="bg-orange-600 text-white p-3 rounded mb-4 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" placeholder="Adresse e-mail"
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-gray-700 text-white px-5 py-4 rounded focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <input type="password" placeholder="Mot de passe (min. 6 caractères)"
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-gray-700 text-white px-5 py-4 rounded focus:outline-none focus:ring-2 focus:ring-white"
              required minLength={6}
            />
            <button type="submit"
              className="w-full bg-netflix-red text-white py-4 rounded font-bold text-lg hover:bg-red-700 transition">
              {isRegister ? "S'inscrire" : 'Se connecter'}
            </button>
          </form>

          <p className="text-gray-400 mt-6 text-sm">
            {isRegister ? 'Déjà un compte ?' : 'Nouveau sur Netflix ?'}{' '}
            <button onClick={() => setIsRegister(!isRegister)} className="text-white hover:underline">
              {isRegister ? 'Se connecter' : 'Inscrivez-vous.'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

### 🟦 ÉTAPE 6 — Hero Banner (1h)

Créer `src/components/Hero.tsx` :

```typescript
import { Movie } from '../services/omdb';

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
```

---

### 🟦 ÉTAPE 7 — Composant MovieRow (1h)

Créer `src/components/MovieRow.tsx` :

```typescript
import { useRef } from 'react';
import { Movie } from '../services/omdb';

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
```

---

## ⚡ SPRINT — JOUR 2 (Dimanche) — 8 à 10 heures

---

### 🟩 ÉTAPE 8 — Page Browse (1h30)

Créer `src/pages/Browse.tsx` :

```typescript
import { useEffect, useState } from 'react';
import { omdbApi, Movie } from '../services/omdb';
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
```

---

### 🟩 ÉTAPE 9 — Navbar (45 min)

Créer `src/components/Navbar.tsx` :

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-10 py-4 flex items-center
      justify-between transition-all duration-500 ${scrolled ? 'bg-netflix-dark' : 'bg-transparent'}`}>

      <div className="text-netflix-red text-2xl font-black tracking-widest cursor-pointer"
        onClick={() => navigate('/browse')}>
        NETFLIX
      </div>

      <div className="hidden md:flex gap-6 text-white text-sm">
        <span className="cursor-pointer hover:text-gray-300">Accueil</span>
        <span className="cursor-pointer hover:text-gray-300">Séries</span>
        <span className="cursor-pointer hover:text-gray-300">Films</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-gray-300 text-sm hidden md:block">{user?.email}</span>
        <div className="w-8 h-8 rounded bg-netflix-red flex items-center justify-center text-white font-bold">
          {user?.email?.[0]?.toUpperCase()}
        </div>
        <button onClick={async () => { await logout(); navigate('/login'); }}
          className="text-white text-sm hover:text-gray-300">
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
```

---

### 🟩 ÉTAPE 10 — Router et App.tsx (20 min)

Remplacer `src/App.tsx` :

```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Browse from './pages/Browse';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"  element={<Login />} />
      <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
      <Route path="*"       element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router><AppRoutes /></Router>
    </AuthProvider>
  );
}
```

---

### 🟩 ÉTAPE 11 — Activer l'Auth dans Supabase (10 min)

> ⚠️ Étape obligatoire sinon la connexion ne fonctionne pas.

1. Aller sur **https://supabase.com** → ouvrir ton projet `netflix-clone`
2. Menu gauche → **Authentication → Providers**
3. Vérifier que **Email** est activé (il l'est par défaut) ✅
4. Menu gauche → **Authentication → URL Configuration**
5. Dans **Site URL** → mettre `http://localhost:5173`
6. Cliquer **Save**

---

### 🟩 ÉTAPE 12 — Tests et corrections (1h)

```bash
npm run dev
```

**Checklist de test :**
- [ ] Page `/login` s'affiche correctement
- [ ] L'inscription crée un compte (vérifier dans Supabase → Authentication → Users)
- [ ] La connexion redirige vers `/browse`
- [ ] Le Hero Banner affiche un film avec affiche, titre, note
- [ ] Les 5 lignes de films sont scrollables
- [ ] La Navbar devient noire au scroll
- [ ] La déconnexion fonctionne

---

### 🟩 ÉTAPE 13 — Déploiement sur Vercel (30 min)

```bash
# 1. Builder le projet
npm run build

# 2. Installer Vercel CLI
npm install -g vercel

# 3. Déployer
vercel
```

> ⚠️ Sur Vercel → **Settings → Environment Variables** → ajouter les 3 variables de ton `.env`  
> Ensuite retourner dans Supabase → Authentication → URL Configuration → ajouter ton URL Vercel dans **Redirect URLs**

---

## 📊 RÉCAPITULATIF DU SPRINT

| Jour | Étapes | Durée | Résultat |
|------|--------|-------|----------|
| Samedi matin | 1–3 | 1h45 | Projet initialisé + Supabase + OMDB |
| Samedi après-midi | 4–5 | 2h | Auth Supabase + page Login |
| Samedi soir | 6–7 | 2h | Hero Banner + Lignes de films |
| Dimanche matin | 8–9 | 2h15 | Page Browse + Navbar |
| Dimanche après-midi | 10–11 | 30 min | Router + Config Supabase |
| Dimanche soir | 12–13 | 1h30 | Tests + Déploiement |

---

## 🚀 FONCTIONNALITÉS BONUS (si tu as du temps)

- [ ] **Barre de recherche** → utiliser `omdbApi.search(terme)` en temps réel
- [ ] **Page détail film** avec modal affichant le synopsis complet
- [ ] **Ma liste** → sauvegarder les films favoris dans Supabase Firestore
- [ ] **Profils utilisateurs** multiples

---

## ❗ PROBLÈMES FRÉQUENTS ET SOLUTIONS

| Problème | Solution |
|----------|----------|
| `VITE_OMDB_API_KEY is not defined` | Vérifier `.env` et redémarrer `npm run dev` |
| Les affiches affichent "N/A" | OMDB n'a pas d'image → le filtre `Poster !== 'N/A'` les masque |
| Supabase `Invalid API key` | Vérifier les variables dans `.env` — copier depuis Project Settings → API |
| Login ne redirige pas | Vérifier que le Site URL est bien `http://localhost:5173` dans Supabase |
| Page blanche après build | Ouvrir la console navigateur `F12` → chercher l'erreur en rouge |
| Tailwind non appliqué | Vérifier `tailwind.config.js` → `content` inclut `./src/**/*.tsx` |

---

## 📚 RESSOURCES UTILES

- Documentation OMDB : http://www.omdbapi.com
- Documentation Supabase : https://supabase.com/docs
- Documentation Tailwind : https://tailwindcss.com/docs
- Documentation Vite : https://vitejs.dev/guide
- Documentation React Router : https://reactrouter.com/en/main

---

*README V2 — Netflix Clone · OMDB + Supabase · Zéro inscription bloquante 🍿*
