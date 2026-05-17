# 🎬 Netflix Clone × Spring Boot — Guide d'intégration API REST
> Ajouter un backend Java Spring Boot à ton Netflix Clone existant **sans toucher au code qui fonctionne**  
> ✅ Onglet Favoris dédié · Pagination · Tests Postman · Connexion React

---

## 🧠 Philosophie de cette intégration

```
┌─────────────────────────────────────────────────────────────┐
│                    TON NETFLIX CLONE                        │
│                                                             │
│  React (Vite)          OMDB API          Supabase Auth     │
│  ──────────────   +   ──────────────  +  ──────────────    │
│  Composants OK         Films OK           Login OK         │
│                                                             │
│              ↓  ON AJOUTE JUSTE ÇA  ↓                      │
│                                                             │
│         Spring Boot API  ←→  PostgreSQL                    │
│         (Mes Favoris)         (ta BDD)                     │
└─────────────────────────────────────────────────────────────┘
```

**Règle d'or :** Si Spring Boot s'arrête, le site continue de fonctionner avec OMDB. Les deux systèmes sont **totalement indépendants**.

---

## 🗂️ Structure des dossiers à la fin

```
Bureau/
├── netflix-clone/          ← Ton projet React (NE PAS TOUCHER)
│   ├── src/
│   │   ├── services/
│   │   │   ├── omdb.ts        ← Déjà fait ✅
│   │   │   └── myApi.ts       ← NOUVEAU — connecte React à Spring Boot
│   │   ├── pages/
│   │   │   ├── Browse.tsx     ← Légère modification
│   │   │   └── Favorites.tsx  ← NOUVEAU — onglet dédié favoris
│   │   └── ...
│   └── package.json
│
└── netflix-api/            ← NOUVEAU projet Spring Boot
    ├── src/main/java/
    │   └── com/netflix/api/
    │       ├── model/
    │       │   └── MyMovie.java        ← Entité JPA
    │       ├── repository/
    │       │   └── MyMovieRepository.java  ← Accès données + pagination
    │       ├── service/
    │       │   └── MyMovieService.java     ← Logique métier
    │       ├── controller/
    │       │   └── MyMovieController.java  ← Routes REST
    │       └── config/
    │           └── CorsConfig.java         ← Autoriser React
    ├── src/main/resources/
    │   └── application.properties          ← Config BDD
    └── pom.xml
```

---

## 🛠️ PRÉREQUIS — Ce qu'il faut avoir

### 1. Java 17+ (OBLIGATOIRE)
**Télécharger :** https://adoptium.net/temurin/releases/?version=17  
Choisir : **Windows x64 → .msi**

```bash
# Vérification après installation
java -version    # doit afficher openjdk version "17.x.x"
```

### 2. Maven (Gestionnaire de dépendances Java)
**Télécharger :** https://maven.apache.org/download.cgi → `apache-maven-3.x.x-bin.zip`

Décompresser dans `C:\Program Files\Maven\` puis ajouter au PATH :
1. Rechercher "Variables d'environnement" dans Windows
2. PATH → Modifier → Nouveau → `C:\Program Files\Maven\bin`

```bash
# Vérification
mvn -version    # doit afficher Apache Maven 3.x.x
```

### 3. PostgreSQL (Base de données)
**Télécharger :** https://www.postgresql.org/download/windows/  
Durant l'installation :
- Mot de passe superuser : **noter-le précieusement**
- Port : `5432` (laisser par défaut)
- Locale : French, France

### 4. Postman (Tests API)
**Télécharger :** https://www.postman.com/downloads/

### 5. Extension VS Code
Dans VS Code → Extensions → installer :
- **Extension Pack for Java** (Microsoft) — indispensable pour Java dans VS Code

---

## ⚡ PHASE 1 — Créer le projet Spring Boot

### Étape 1 — Générer le projet (5 min)

1. Aller sur **https://start.spring.io**
2. Remplir exactement :

| Champ | Valeur |
|-------|--------|
| Project | **Maven** |
| Language | **Java** |
| Spring Boot | **3.2.x** (la plus récente stable) |
| Group | `com.netflix` |
| Artifact | `api` |
| Name | `netflix-api` |
| Packaging | **Jar** |
| Java | **17** |

3. Cliquer **ADD DEPENDENCIES** et ajouter :
   - `Spring Web`
   - `Spring Data JPA`
   - `PostgreSQL Driver`
   - `Lombok`

4. Cliquer **GENERATE** → télécharge `api.zip`
5. Décompresser dans `Bureau/netflix-api/`
6. Ouvrir dans VS Code : `File → Open Folder → netflix-api`

---

### Étape 2 — Créer la base de données PostgreSQL

Ouvrir **pgAdmin** (installé avec PostgreSQL) ou le terminal :

```sql
-- Dans pgAdmin → Query Tool, exécuter :
CREATE DATABASE netflix_favorites;
```

---

### Étape 3 — Configurer `application.properties`

Ouvrir `src/main/resources/application.properties` et **tout remplacer** :

```properties
# Connexion PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/netflix_favorites
spring.datasource.username=postgres
spring.datasource.password=TON_MOT_DE_PASSE_POSTGRESQL

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Port du serveur
server.port=8080

# Nom de l'application
spring.application.name=netflix-api
```

> ⚠️ Remplacer `TON_MOT_DE_PASSE_POSTGRESQL` par le mot de passe choisi lors de l'installation.

---

## ⚡ PHASE 2 — Coder le Backend (4 fichiers)

### Fichier 1 — `MyMovie.java` (Le modèle)

Créer le fichier : `src/main/java/com/netflix/api/model/MyMovie.java`

```java
package com.netflix.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "my_movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyMovie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imdbId;         // ex: "tt0848228"

    @Column(nullable = false)
    private String title;          // ex: "The Avengers"

    private String posterUrl;      // URL de l'affiche

    private String year;           // ex: "2012"

    private String genre;          // ex: "Action, Adventure"

    private String imdbRating;     // ex: "8.0"

    @Column(length = 1000)
    private String personalNote;   // Ta note personnelle sur le film

    @Column(nullable = false)
    private LocalDateTime addedAt; // Date d'ajout aux favoris

    @PrePersist
    protected void onCreate() {
        addedAt = LocalDateTime.now();
    }
}
```

---

### Fichier 2 — `MyMovieRepository.java` (Accès données + Pagination)

Créer : `src/main/java/com/netflix/api/repository/MyMovieRepository.java`

```java
package com.netflix.api.repository;

import com.netflix.api.model.MyMovie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MyMovieRepository extends JpaRepository<MyMovie, Long> {

    // Vérifier si un film est déjà en favoris (par imdbId)
    boolean existsByImdbId(String imdbId);

    // Trouver un film par son imdbId
    Optional<MyMovie> findByImdbId(String imdbId);

    // Rechercher par titre avec pagination
    Page<MyMovie> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    // Supprimer par imdbId
    void deleteByImdbId(String imdbId);
}
```

---

### Fichier 3 — `MyMovieService.java` (Logique métier)

Créer : `src/main/java/com/netflix/api/service/MyMovieService.java`

```java
package com.netflix.api.service;

import com.netflix.api.model.MyMovie;
import com.netflix.api.repository.MyMovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class MyMovieService {

    @Autowired
    private MyMovieRepository repository;

    // Récupérer tous les favoris avec pagination
    public Page<MyMovie> getAllMovies(int page, int size) {
        Pageable pageable = PageRequest.of(
            page,
            size,
            Sort.by(Sort.Direction.DESC, "addedAt") // Les plus récents en premier
        );
        return repository.findAll(pageable);
    }

    // Récupérer tous les favoris sans pagination (pour affichage React)
    public List<MyMovie> getAllMoviesList() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "addedAt"));
    }

    // Ajouter un film aux favoris
    public MyMovie addMovie(MyMovie movie) {
        if (repository.existsByImdbId(movie.getImdbId())) {
            throw new RuntimeException("Ce film est déjà dans vos favoris !");
        }
        return repository.save(movie);
    }

    // Récupérer un film par son ID
    public Optional<MyMovie> getMovieById(Long id) {
        return repository.findById(id);
    }

    // Vérifier si un film est en favoris
    public boolean isFavorite(String imdbId) {
        return repository.existsByImdbId(imdbId);
    }

    // Mettre à jour la note personnelle
    @Transactional
    public MyMovie updateNote(String imdbId, String note) {
        MyMovie movie = repository.findByImdbId(imdbId)
            .orElseThrow(() -> new RuntimeException("Film introuvable"));
        movie.setPersonalNote(note);
        return repository.save(movie);
    }

    // Supprimer des favoris
    @Transactional
    public void deleteMovie(String imdbId) {
        if (!repository.existsByImdbId(imdbId)) {
            throw new RuntimeException("Film introuvable dans les favoris");
        }
        repository.deleteByImdbId(imdbId);
    }

    // Rechercher dans les favoris
    public Page<MyMovie> searchMovies(String title, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findByTitleContainingIgnoreCase(title, pageable);
    }
}
```

---

### Fichier 4 — `MyMovieController.java` (Routes REST)

Créer : `src/main/java/com/netflix/api/controller/MyMovieController.java`

```java
package com.netflix.api.controller;

import com.netflix.api.model.MyMovie;
import com.netflix.api.service.MyMovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = {"http://localhost:5173", "https://netflix-clone-coral-theta.vercel.app"})
public class MyMovieController {

    @Autowired
    private MyMovieService service;

    // GET /api/movies — tous les favoris (liste simple pour React)
    @GetMapping
    public ResponseEntity<List<MyMovie>> getAllMovies() {
        return ResponseEntity.ok(service.getAllMoviesList());
    }

    // GET /api/movies/paginated?page=0&size=10 — avec pagination
    @GetMapping("/paginated")
    public ResponseEntity<Page<MyMovie>> getMoviesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.getAllMovies(page, size));
    }

    // GET /api/movies/search?title=avengers&page=0&size=5
    @GetMapping("/search")
    public ResponseEntity<Page<MyMovie>> searchMovies(
            @RequestParam String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.searchMovies(title, page, size));
    }

    // GET /api/movies/check/{imdbId} — vérifier si en favoris
    @GetMapping("/check/{imdbId}")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(@PathVariable String imdbId) {
        return ResponseEntity.ok(Map.of("isFavorite", service.isFavorite(imdbId)));
    }

    // POST /api/movies — ajouter aux favoris
    @PostMapping
    public ResponseEntity<?> addMovie(@RequestBody MyMovie movie) {
        try {
            MyMovie saved = service.addMovie(movie);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PATCH /api/movies/{imdbId}/note — mettre à jour la note perso
    @PatchMapping("/{imdbId}/note")
    public ResponseEntity<?> updateNote(
            @PathVariable String imdbId,
            @RequestBody Map<String, String> body) {
        try {
            MyMovie updated = service.updateNote(imdbId, body.get("note"));
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /api/movies/{imdbId} — retirer des favoris
    @DeleteMapping("/{imdbId}")
    public ResponseEntity<?> deleteMovie(@PathVariable String imdbId) {
        try {
            service.deleteMovie(imdbId);
            return ResponseEntity.ok(Map.of("message", "Film retiré des favoris"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
```

---

### Fichier 5 — `CorsConfig.java` (Autoriser React)

Créer : `src/main/java/com/netflix/api/config/CorsConfig.java`

```java
package com.netflix.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",                                    // Dev local
            "https://netflix-clone-coral-theta.vercel.app"             // Production Vercel
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
```

---

### Lancer Spring Boot

Dans le terminal VS Code, depuis le dossier `netflix-api` :

```bash
mvn spring-boot:run
```

**✅ Résultat attendu :**
```
Started NetflixApiApplication in 3.241 seconds
Tomcat started on port(s): 8080
```

---

## ⚡ PHASE 3 — Tests Postman (Valider avant React)

### Créer une collection Postman

Ouvrir Postman → **New Collection** → nommer `Netflix API`

---

### TEST 1 — Ajouter un film favori

**Méthode :** `POST`  
**URL :** `http://localhost:8080/api/movies`  
**Headers :** `Content-Type: application/json`  
**Body (raw JSON) :**

```json
{
  "imdbId": "tt0848228",
  "title": "The Avengers",
  "posterUrl": "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGM2YTgyXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX600.jpg",
  "year": "2012",
  "genre": "Action, Adventure, Sci-Fi",
  "imdbRating": "8.0",
  "personalNote": "Mon film Marvel préféré !"
}
```

**✅ Résultat attendu :** `200 OK` avec le film créé et son `id`

---

### TEST 2 — Lister tous les favoris

**Méthode :** `GET`  
**URL :** `http://localhost:8080/api/movies`

**✅ Résultat attendu :**
```json
[
  {
    "id": 1,
    "imdbId": "tt0848228",
    "title": "The Avengers",
    "year": "2012",
    "addedAt": "2026-05-06T10:30:00"
  }
]
```

---

### TEST 3 — Pagination

**Méthode :** `GET`  
**URL :** `http://localhost:8080/api/movies/paginated?page=0&size=5`

**✅ Résultat attendu :**
```json
{
  "content": [...],
  "totalElements": 1,
  "totalPages": 1,
  "number": 0,
  "size": 5
}
```

---

### TEST 4 — Vérifier si en favoris

**Méthode :** `GET`  
**URL :** `http://localhost:8080/api/movies/check/tt0848228`

**✅ Résultat attendu :** `{ "isFavorite": true }`

---

### TEST 5 — Ajouter une note personnelle

**Méthode :** `PATCH`  
**URL :** `http://localhost:8080/api/movies/tt0848228/note`  
**Body :**
```json
{ "note": "Revu 3 fois, toujours aussi bon !" }
```

---

### TEST 6 — Retirer des favoris

**Méthode :** `DELETE`  
**URL :** `http://localhost:8080/api/movies/tt0848228`

**✅ Résultat attendu :** `{ "message": "Film retiré des favoris" }`

---

## ⚡ PHASE 4 — Connexion React

### Fichier 1 — `src/services/myApi.ts` (Nouveau service)

```typescript
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
} {

  // Récupérer tous les favoris
  getAll: async (): Promise<FavoriteMovie[]> => {
    const res = await client.get('/api/movies');
    return res.data;

const client = axios.create({ baseURL: BASE_URL });

export const myApi =
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
```

---

### Fichier 2 — `src/pages/Favorites.tsx` (Onglet dédié)

```tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { myApi, type FavoriteMovie } from '../services/myApi';
import { fixPoster } from '../services/omdb';
import Navbar from '../components/Navbar';

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const navigate = useNavigate();

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await myApi.getAll();
      setFavorites(data);
    } catch {
      setError('Impossible de charger les favoris. L\'API est-elle démarrée ?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFavorites(); }, []);

  const handleRemove = async (imdbId: string, title: string) => {
    if (!confirm(`Retirer "${title}" des favoris ?`)) return;
    try {
      await myApi.removeFavorite(imdbId);
      setFavorites(prev => prev.filter(f => f.imdbId !== imdbId));
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  if (loading) return (
    <div style={{ backgroundColor: '#141414', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#E50914', fontSize: '2rem', fontWeight: 900, letterSpacing: '4px' }}>
        Chargement...
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '90px 40px 40px' }}>

        {/* En-tête */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: '8px' }}>
            ❤️ Mes Favoris
          </h1>
          <p style={{ color: '#aaa', fontSize: '14px' }}>
            {favorites.length} film{favorites.length > 1 ? 's' : ''} dans ta collection personnelle
          </p>
        </div>

        {/* Erreur API */}
        {error && (
          <div style={{
            backgroundColor: '#2a1a1a', border: '1px solid #E50914',
            borderRadius: '8px', padding: '20px', marginBottom: '32px',
            color: '#ff6b6b', fontSize: '14px',
          }}>
            ⚠️ {error}
            <button
              onClick={loadFavorites}
              style={{
                marginLeft: '16px', backgroundColor: '#E50914',
                border: 'none', color: '#fff', padding: '6px 16px',
                borderRadius: '4px', cursor: 'pointer', fontSize: '13px',
              }}
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Liste vide */}
        {!error && favorites.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎬</div>
            <p style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700 }}>
              Aucun favori pour l'instant
            </p>
            <p style={{ color: '#aaa', marginTop: '8px', fontSize: '14px' }}>
              Clique sur ❤️ sur un film pour l'ajouter ici
            </p>
            <button
              onClick={() => navigate('/browse')}
              style={{
                marginTop: '24px', backgroundColor: '#E50914', color: '#fff',
                border: 'none', borderRadius: '4px',
                padding: '12px 28px', fontSize: '16px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Explorer les films
            </button>
          </div>
        )}

        {/* Grille de favoris */}
        {favorites.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '24px',
          }}>
            {favorites.map(movie => (
              <div
                key={movie.imdbId}
                style={{
                  backgroundColor: '#1f1f1f',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.8)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Affiche */}
                <div style={{ position: 'relative', cursor: 'pointer' }}
                  onClick={() => navigate(`/movie/${movie.imdbId}`)}>
                  <img
                    src={fixPoster(movie.posterUrl) || movie.posterUrl}
                    alt={movie.title}
                    style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Badge favori */}
                  <div style={{
                    position: 'absolute', top: '8px', right: '8px',
                    backgroundColor: '#E50914', borderRadius: '50%',
                    width: '28px', height: '28px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px',
                  }}>
                    ❤️
                  </div>
                </div>

                {/* Infos */}
                <div style={{ padding: '12px' }}>
                  <p style={{
                    color: '#fff', fontSize: '14px', fontWeight: 700,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    marginBottom: '4px',
                  }}>
                    {movie.title}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ color: '#46d369', fontSize: '12px' }}>{movie.year}</span>
                    {movie.imdbRating && (
                      <span style={{ color: '#f5c518', fontSize: '12px' }}>⭐ {movie.imdbRating}</span>
                    )}
                  </div>

                  {/* Note personnelle */}
                  {movie.personalNote && (
                    <p style={{
                      color: '#aaa', fontSize: '12px', fontStyle: 'italic',
                      marginBottom: '10px', lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                    }}>
                      "{movie.personalNote}"
                    </p>
                  )}

                  {/* Date d'ajout */}
                  {movie.addedAt && (
                    <p style={{ color: '#555', fontSize: '11px', marginBottom: '10px' }}>
                      Ajouté le {new Date(movie.addedAt).toLocaleDateString('fr-FR')}
                    </p>
                  )}

                  {/* Bouton retirer */}
                  <button
                    onClick={() => handleRemove(movie.imdbId, movie.title)}
                    style={{
                      width: '100%', backgroundColor: 'transparent',
                      border: '1px solid #555', color: '#aaa',
                      padding: '7px', borderRadius: '4px',
                      fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#E50914';
                      e.currentTarget.style.color = '#E50914';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#555';
                      e.currentTarget.style.color = '#aaa';
                    }}
                  >
                    🗑️ Retirer des favoris
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### Fichier 3 — Modifier `src/App.tsx` — Ajouter la route Favoris

Ajouter ces 2 lignes dans les imports et les routes :

```tsx
// Ajouter dans les imports
import Favorites from './pages/Favorites';

// Ajouter dans les routes (après /history)
<Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
```

---

### Fichier 4 — Modifier `src/components/Navbar.tsx` — Ajouter le lien Favoris

Dans le tableau des liens de navigation, ajouter `Favoris` :

```tsx
{ label: 'Accueil',    path: '/browse' },
{ label: 'Séries',     path: '/series' },
{ label: 'Films',      path: '/films' },
{ label: 'Nouveautés', path: '/nouveautes' },
{ label: '❤️ Favoris', path: '/favorites' },   // ← AJOUTER CETTE LIGNE
```

---

### Fichier 5 — Ajouter le bouton ❤️ dans `MovieDetail.tsx`

Dans la section des boutons (après le bouton Retour), ajouter :

```tsx
// Ajouter en haut du composant
import { myApi } from '../services/myApi';
// ...
const [isFav, setIsFav] = useState(false);

// Dans le useEffect du movie, ajouter la vérification
useEffect(() => {
  if (!movie) return;
  myApi.isFavorite(movie.imdbID ?? '').then(setIsFav).catch(() => {});
}, [movie]);

// Fonction pour toggle favori
const handleFavoriteToggle = async () => {
  if (!movie) return;
  try {
    if (isFav) {
      await myApi.removeFavorite(movie.imdbID ?? '');
      setIsFav(false);
    } else {
      await myApi.addFavorite({
        imdbId:    movie.imdbID ?? '',
        title:     movie.Title,
        posterUrl: movie.Poster,
        year:      movie.Year,
        genre:     movie.Genre,
        imdbRating: movie.imdbRating,
      });
      setIsFav(true);
    }
  } catch (e) {
    console.error('Erreur favoris:', e);
  }
};

// Bouton à ajouter dans le JSX, après le bouton Retour :
<button
  onClick={handleFavoriteToggle}
  style={{
    backgroundColor: isFav ? '#E50914' : 'transparent',
    border: `2px solid ${isFav ? '#E50914' : '#fff'}`,
    color: '#fff', borderRadius: '4px',
    padding: '14px 28px', fontSize: '16px', fontWeight: 700, cursor: 'pointer',
    transition: 'all 0.2s',
  }}
>
  {isFav ? '❤️ Dans mes favoris' : '🤍 Ajouter aux favoris'}
</button>
```

---

## ⚡ PHASE 5 — Déployer l'API sur Railway (En ligne)

Railway est un hébergeur gratuit parfait pour Spring Boot.

1. Aller sur **https://railway.app** → se connecter avec GitHub
2. **New Project** → **Deploy from GitHub repo** → sélectionner `netflix-api`
3. Railway détecte automatiquement Maven → déploiement en 3 min
4. Aller dans **Variables** → ajouter :
   ```
   SPRING_DATASOURCE_URL=jdbc:postgresql://...
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=...
   ```
5. Railway fournit une URL publique comme `https://netflix-api-production.up.railway.app`
6. Copier cette URL → dans ton projet React sur Vercel → Settings → Environment Variables :
   ```
   VITE_API_URL=https://netflix-api-production.up.railway.app
   ```

---

## 📊 Récapitulatif des endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/movies` | Tous les favoris |
| `GET` | `/api/movies/paginated?page=0&size=10` | Avec pagination |
| `GET` | `/api/movies/check/{imdbId}` | Est-ce un favori ? |
| `GET` | `/api/movies/search?title=avengers` | Rechercher dans favoris |
| `POST` | `/api/movies` | Ajouter un favori |
| `PATCH` | `/api/movies/{imdbId}/note` | Modifier la note perso |
| `DELETE` | `/api/movies/{imdbId}` | Retirer des favoris |

---

## ❗ Problèmes fréquents et solutions

| Problème | Cause | Solution |
|----------|-------|----------|
| `Connection refused 5432` | PostgreSQL non démarré | Services Windows → démarrer PostgreSQL |
| `password authentication failed` | Mauvais mdp dans `.properties` | Vérifier le mot de passe PostgreSQL |
| `CORS error` dans React | URL Vercel manquante dans CorsConfig | Ajouter l'URL exacte dans `CorsConfig.java` |
| `mvn not found` | Maven pas dans le PATH | Vérifier les variables d'environnement Windows |
| `java not found` | Java pas installé | Réinstaller depuis adoptium.net |
| Favoris ne s'affichent pas en prod | `VITE_API_URL` manquant sur Vercel | Ajouter la variable Railway dans Vercel Settings |

---

## 🚀 Ordre de démarrage (chaque session de dev)

```bash
# Terminal 1 — Spring Boot
cd Bureau/netflix-api
mvn spring-boot:run

# Terminal 2 — React
cd Bureau/netflix-clone
npm run dev
```

Ouvrir : `http://localhost:5173` → tout fonctionne ensemble. ✅

---

*README — Netflix × Spring Boot · REST API · Favoris · Pagination · Mai 2026 🍿*
