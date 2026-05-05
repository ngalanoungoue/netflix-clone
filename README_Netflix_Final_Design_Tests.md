# 🎬 Netflix Clone — Guide Final : Design + Responsive + Tests complets
> Corriger le visuel, rendre l'app responsive et tester tout le parcours utilisateur

---

## 🚨 CORRECTION URGENTE — Ton .env est cassé

Ouvrir le fichier `.env` dans VS Code et **tout remplacer** par exactement ceci :

```env
VITE_SUPABASE_URL=https://rzaslckvbbfathbpevff.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_LwAztnoH7EZNcBBgKP9e4A_nTzjQmG5
VITE_OMDB_API_KEY=42e3ee52
VITE_OMDB_BASE_URL=https://www.omdbapi.com
```

> ⚠️ La ligne 4 était `http://www.omdbapi.com/apikey.aspx?` — c'est faux.
> La bonne valeur est `https://www.omdbapi.com` — sans rien d'autre après.

---

## 🎨 PARTIE 1 — Corriger le CSS (Tailwind ne se charge pas)

### Problème : PostCSS mal configuré pour Vercel

Ouvrir `postcss.config.js` et **tout remplacer** par :

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### Corriger `src/index.css` — tout remplacer par :

```css
@import "tailwindcss";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #141414;
  font-family: 'Netflix Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: white;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## 🎨 PARTIE 2 — Refaire la page Login (responsive + beau)

Remplacer **tout le contenu** de `src/pages/Login.tsx` :

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate('/browse');
    } catch (err: any) {
      setError(err.message || 'Erreur. Vérifie tes identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      backgroundImage: 'url(https://assets.nflxext.com/ffe/siteui/vlv3/701e96f8-db52-4073-8a17-f82c67d9ecd4/web/FR-fr-20250210-TRIFECTA-perspective_a3b3bd44-f6ab-4ab2-b26c-92765ab87d2e_large.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Overlay sombre */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'relative', zIndex: 10,
        padding: '20px 40px',
      }}>
        <div style={{
          color: '#E50914',
          fontSize: '2rem',
          fontWeight: 900,
          letterSpacing: '4px',
        }}>NETFLIX</div>
      </nav>

      {/* Formulaire centré */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        padding: '20px',
      }}>
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.85)',
          borderRadius: '8px',
          padding: '60px 48px',
          width: '100%',
          maxWidth: '450px',
        }}>
          <h1 style={{
            color: '#fff',
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '28px',
          }}>
            {isRegister ? 'Inscription' : 'Se connecter'}
          </h1>

          {error && (
            <div style={{
              backgroundColor: '#e87c03',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                backgroundColor: '#333',
                border: '1px solid #666',
                borderRadius: '4px',
                padding: '16px',
                color: '#fff',
                fontSize: '16px',
                marginBottom: '16px',
                outline: 'none',
              }}
            />
            <input
              type="password"
              placeholder="Mot de passe (min. 6 caractères)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                backgroundColor: '#333',
                border: '1px solid #666',
                borderRadius: '4px',
                padding: '16px',
                color: '#fff',
                fontSize: '16px',
                marginBottom: '24px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#E50914',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Chargement...' : isRegister ? "S'inscrire" : 'Se connecter'}
            </button>
          </form>

          <p style={{ color: '#737373', marginTop: '16px', fontSize: '14px' }}>
            {isRegister ? 'Déjà un compte ?' : 'Nouveau sur Netflix ?'}{' '}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{
                color: '#fff',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
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

## 🎨 PARTIE 3 — Refaire la Navbar (responsive + belle)

Remplacer **tout le contenu** de `src/components/Navbar.tsx` :

```tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      padding: '0 40px',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: scrolled
        ? '#141414'
        : 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)',
      transition: 'background 0.4s ease',
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/browse')}
        style={{
          color: '#E50914',
          fontSize: '1.8rem',
          fontWeight: 900,
          letterSpacing: '4px',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        NETFLIX
      </div>

      {/* Liens navigation — cachés sur mobile */}
      <div style={{
        display: 'flex',
        gap: '24px',
        alignItems: 'center',
      }}
        className="nav-links"
      >
        {['Accueil', 'Séries', 'Films', 'Nouveautés'].map(item => (
          <span key={item} style={{
            color: '#e5e5e5',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#e5e5e5')}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Profil + déconnexion */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: '#e5e5e5', fontSize: '13px' }}>
          {user?.email?.split('@')[0]}
        </span>
        <div style={{
          width: '32px', height: '32px',
          borderRadius: '4px',
          backgroundColor: '#E50914',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: '14px',
          cursor: 'pointer',
          flexShrink: 0,
        }}>
          {user?.email?.[0]?.toUpperCase()}
        </div>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #fff',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: '4px',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Quitter
        </button>
      </div>
    </nav>
  );
}
```

---

## 🎨 PARTIE 4 — Refaire le Hero Banner (responsive + beau)

Remplacer **tout le contenu** de `src/components/Hero.tsx` :

```tsx
import { Movie } from '../services/omdb';

interface HeroProps { movie: Movie; }

export default function Hero({ movie }: HeroProps) {
  const hasPoster = movie?.Poster && movie.Poster !== 'N/A';

  return (
    <div style={{
      position: 'relative',
      height: '85vh',
      minHeight: '500px',
      width: '100%',
    }}>
      {/* Image de fond */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {hasPoster ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              filter: 'brightness(0.6)',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          }} />
        )}
        {/* Dégradé gauche */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
        }} />
        {/* Dégradé bas */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '200px',
          background: 'linear-gradient(to top, #141414 0%, transparent 100%)',
        }} />
      </div>

      {/* Contenu */}
      <div style={{
        position: 'absolute',
        bottom: '120px',
        left: '40px',
        right: '40px',
        maxWidth: '550px',
        zIndex: 10,
      }}>
        <h1 style={{
          color: '#fff',
          fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: '16px',
          textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
        }}>
          {movie?.Title}
        </h1>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {movie?.Year && (
            <span style={{
              color: '#46d369', fontWeight: 700, fontSize: '14px',
            }}>
              {movie.Year}
            </span>
          )}
          {movie?.imdbRating && movie.imdbRating !== 'N/A' && (
            <span style={{ color: '#f5c518', fontSize: '14px' }}>
              ⭐ {movie.imdbRating}/10
            </span>
          )}
          {movie?.Genre && (
            <span style={{ color: '#aaa', fontSize: '13px' }}>
              {movie.Genre?.split(',')[0]}
            </span>
          )}
        </div>

        {movie?.Plot && movie.Plot !== 'N/A' && (
          <p style={{
            color: '#ddd',
            fontSize: 'clamp(13px, 2vw, 15px)',
            lineHeight: 1.6,
            marginBottom: '24px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as any,
            overflow: 'hidden',
            textShadow: '1px 1px 4px rgba(0,0,0,0.9)',
          }}>
            {movie.Plot}
          </p>
        )}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#fff',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 28px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ccc')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            ▶ Lecture
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(109,109,110,0.7)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 28px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
          }}>
            ℹ Plus d'infos
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎨 PARTIE 5 — Refaire MovieRow (responsive + belle)

Remplacer **tout le contenu** de `src/components/MovieRow.tsx` :

```tsx
import { useRef } from 'react';
import { Movie } from '../services/omdb';

interface MovieRowProps { title: string; movies: Movie[]; }

export default function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir === 'left' ? -600 : 600, behavior: 'smooth' });
    }
  };

  const validMovies = movies.filter(m => m.Poster && m.Poster !== 'N/A');
  if (validMovies.length === 0) return null;

  return (
    <div style={{ marginBottom: '40px' }}
      className="movie-row-container"
    >
      {/* Titre de la catégorie */}
      <h2 style={{
        color: '#e5e5e5',
        fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
        fontWeight: 700,
        padding: '0 40px',
        marginBottom: '12px',
        letterSpacing: '0.5px',
      }}>
        {title}
      </h2>

      {/* Rangée de films */}
      <div style={{ position: 'relative' }}>
        {/* Bouton gauche */}
        <button
          onClick={() => scroll('left')}
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: '#fff',
            border: 'none',
            padding: '0 12px',
            fontSize: '20px',
            cursor: 'pointer',
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
          className="scroll-btn"
        >
          ‹
        </button>

        {/* Films */}
        <div
          ref={rowRef}
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            padding: '8px 40px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          } as React.CSSProperties}
        >
          {validMovies.map((movie) => (
            <div
              key={movie.imdbID}
              style={{
                flexShrink: 0,
                width: 'clamp(120px, 15vw, 180px)',
                cursor: 'pointer',
                borderRadius: '4px',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.8)';
                e.currentTarget.style.zIndex = '20';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.zIndex = '1';
              }}
            >
              <img
                src={movie.Poster}
                alt={movie.Title}
                style={{
                  width: '100%',
                  aspectRatio: '2/3',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* Overlay au hover */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)',
                padding: '20px 8px 8px',
                opacity: 0,
                transition: 'opacity 0.2s',
              }}
                className="movie-overlay"
              >
                <p style={{
                  color: '#fff', fontSize: '11px', fontWeight: 700,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {movie.Title}
                </p>
                <p style={{ color: '#aaa', fontSize: '10px' }}>{movie.Year}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton droit */}
        <button
          onClick={() => scroll('right')}
          style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: '#fff',
            border: 'none',
            padding: '0 12px',
            fontSize: '20px',
            cursor: 'pointer',
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
          className="scroll-btn"
        >
          ›
        </button>
      </div>
    </div>
  );
}
```

### Ajouter dans `src/index.css` à la fin :

```css
/* Hover sur les rangées */
.movie-row-container:hover .scroll-btn {
  opacity: 1 !important;
}
.movie-row-container:hover .movie-overlay {
  opacity: 1 !important;
}

/* Responsive mobile */
@media (max-width: 640px) {
  .nav-links { display: none !important; }
}
```

---

## 🔄 PARTIE 6 — Pousser les corrections sur Vercel

Après avoir tout modifié, dans le terminal VS Code :

```bash
git add .
git commit -m "fix: design responsive + postcss + env corrigé"
git push origin main
```

> Vercel redéploie **automatiquement** en 2 minutes dès qu'il détecte un push sur `main`. ✅

---

## ✅ PARTIE 7 — Guide de test complet (ce qu'il faut taper exactement)

### 🔵 TEST 1 — Inscription (créer un compte)

Ouvrir ton site : `https://netflix-clone-coral-theta.vercel.app`

1. Cliquer **"Inscrivez-vous."**
2. Taper dans **Adresse e-mail** :
   ```
   test@gmail.com
   ```
3. Taper dans **Mot de passe** :
   ```
   test123
   ```
4. Cliquer **S'inscrire**

**✅ Résultat attendu :** Tu es redirigé vers `/browse` avec les films qui s'affichent.

---

### 🔵 TEST 2 — Déconnexion

Sur la page Browse :
1. Cliquer le bouton **"Quitter"** en haut à droite

**✅ Résultat attendu :** Retour sur la page `/login`

---

### 🔵 TEST 3 — Connexion avec le compte créé

1. Taper dans **Adresse e-mail** :
   ```
   test@gmail.com
   ```
2. Taper dans **Mot de passe** :
   ```
   test123
   ```
3. Cliquer **Se connecter**

**✅ Résultat attendu :** Redirection vers `/browse`

---

### 🔵 TEST 4 — Mauvais mot de passe (test de sécurité)

1. Taper dans **Adresse e-mail** :
   ```
   test@gmail.com
   ```
2. Taper dans **Mot de passe** :
   ```
   mauvaismdp
   ```
3. Cliquer **Se connecter**

**✅ Résultat attendu :** Message d'erreur orange en haut du formulaire.

---

### 🔵 TEST 5 — Navigation sur Browse

Une fois connecté sur `/browse` :

1. **Faire défiler** la page vers le bas → tu dois voir 5 catégories de films
2. **Survoler** une affiche de film → elle doit s'agrandir légèrement
3. **Cliquer les flèches** `‹` `›` sur une rangée → la liste défile horizontalement
4. **Faire défiler** vers le haut → la Navbar doit devenir noire au scroll

**✅ Résultat attendu :** Tout fonctionne visuellement.

---

### 🔵 TEST 6 — Accès direct sans être connecté (sécurité)

Dans la barre d'adresse, taper directement :
```
https://netflix-clone-coral-theta.vercel.app/browse
```

**✅ Résultat attendu :** Redirigé automatiquement vers `/login` car non connecté.

---

### 🔵 TEST 7 — Vérifier les données dans Supabase

1. Aller sur **https://supabase.com** → ton projet
2. Menu gauche → **Authentication → Users**
3. Tu dois voir le compte `test@gmail.com` dans la liste

**✅ Résultat attendu :** L'utilisateur apparaît bien dans la base de données.

---

## ❗ Problèmes fréquents après les corrections

| Problème | Cause | Solution |
|----------|-------|----------|
| Page toujours sans style | PostCSS pas mis à jour | Vérifier `postcss.config.js` → relancer `npm run dev` |
| Films ne chargent pas | Clé OMDB incorrecte | Vérifier `.env` ligne 3 : `VITE_OMDB_API_KEY=42e3ee52` |
| Connexion échoue sur Vercel | Variables env manquantes | Vercel → Settings → Environment Variables → ajouter les 4 variables → Redeploy |
| `VITE_OMDB_BASE_URL` mal configuré | URL de la page inscription mise par erreur | Mettre exactement : `https://www.omdbapi.com` |
| Vercel ne redéploie pas | Push non effectué | `git push origin main` dans le terminal |

---

## 📊 Récapitulatif des fichiers modifiés

| Fichier | Ce qui a changé |
|---------|-----------------|
| `.env` | Correction de `VITE_OMDB_BASE_URL` |
| `postcss.config.js` | Utilisation de `@tailwindcss/postcss` |
| `src/index.css` | Import Tailwind corrigé + CSS global |
| `src/pages/Login.tsx` | Design complet avec fond, styles inline |
| `src/components/Navbar.tsx` | Responsive, scroll effect, style propre |
| `src/components/Hero.tsx` | Tailles fluides `clamp()`, dégradés |
| `src/components/MovieRow.tsx` | Hover effects, scroll smooth, responsive |

---

*README Final — Netflix Clone · Design + Responsive + Tests · Mai 2026 🍿*
