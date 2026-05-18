import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase'; // ← à adapter selon ton vrai chemin
import Navbar from '../components/Navbar';

const GENRES = ['Action', 'Comédie', 'Drame', 'Horreur', 'Science-Fiction', 'Romance', 'Thriller', 'Animation', 'Documentaire', 'Africain'];

interface Profile {
  id: string;
  username: string;
  bio: string;
  preferred_genres: string[];
  language: string;
  avatar_url: string;
}

export default function Profile() {
  const [username, setUsername]   = useState('');
  const [bio, setBio]             = useState('');
  const [genres, setGenres]       = useState<string[]>([]);
  const [language, setLanguage]   = useState('fr');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [message, setMessage]     = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        const p = data as Profile;
        setUsername(p.username || '');
        setBio(p.bio || '');
        setGenres(p.preferred_genres || []);
        setLanguage(p.language || 'fr');
        setAvatarUrl(p.avatar_url || '');
      }
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (error) { alert('Erreur upload avatar'); return; }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
    setAvatarUrl(publicUrl);
    setMessage('Avatar mis à jour !');
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('profiles').update({
      username,
      bio,
      preferred_genres: genres,
      language,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id);

    setSaving(false);
    setMessage(error ? '❌ Erreur lors de la sauvegarde' : '✅ Profil sauvegardé !');
  };

  const toggleGenre = (genre: string) => {
    setGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  if (loading) return (
    <div style={{ backgroundColor: '#141414', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#E50914', fontSize: '2rem', fontWeight: 900 }}>Chargement...</div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '90px 40px 40px', maxWidth: '700px', margin: '0 auto' }}>

        <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginBottom: '32px' }}>
          👤 Mon Profil
        </h1>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: '100px', height: '100px', borderRadius: '50%',
              backgroundColor: '#333', cursor: 'pointer', overflow: 'hidden',
              border: '3px solid #E50914',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '2.5rem' }}>👤</span>
            }
          </div>
          <div>
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                backgroundColor: '#333', color: '#fff', border: '1px solid #555',
                borderRadius: '4px', padding: '8px 20px', cursor: 'pointer', fontSize: '14px',
              }}
            >
              Changer la photo
            </button>
            <p style={{ color: '#aaa', fontSize: '12px', marginTop: '6px' }}>JPG, PNG — max 2MB</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
        </div>

        {/* Champs */}
        {[
          { label: "Nom d'affichage", value: username, setter: setUsername, placeholder: 'Ton pseudo' },
          { label: 'Bio', value: bio, setter: setBio, placeholder: 'Parle un peu de toi...' },
        ].map(({ label, value, setter, placeholder }) => (
          <div key={label} style={{ marginBottom: '20px' }}>
            <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '6px' }}>{label}</label>
            <input
              value={value}
              onChange={e => setter(e.target.value)}
              placeholder={placeholder}
              style={{
                width: '100%', backgroundColor: '#222', border: '1px solid #444',
                borderRadius: '4px', padding: '12px', color: '#fff', fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>
        ))}

        {/* Langue */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Langue préférée</label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{
              backgroundColor: '#222', border: '1px solid #444', borderRadius: '4px',
              padding: '12px', color: '#fff', fontSize: '14px', width: '100%',
            }}
          >
            <option value="fr">🇫🇷 Français</option>
            <option value="en">🇬🇧 English</option>
            <option value="wo">🇸🇳 Wolof</option>
            <option value="yo">🇳🇬 Yoruba</option>
            <option value="sw">🇰🇪 Swahili</option>
          </select>
        </div>

        {/* Genres favoris */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '12px' }}>Genres favoris</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                style={{
                  backgroundColor: genres.includes(genre) ? '#E50914' : '#222',
                  border: `1px solid ${genres.includes(genre) ? '#E50914' : '#444'}`,
                  color: '#fff', borderRadius: '20px',
                  padding: '6px 16px', cursor: 'pointer', fontSize: '13px',
                  transition: 'all 0.2s',
                }}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            backgroundColor: message.includes('❌') ? '#2a1a1a' : '#1a2a1a',
            border: `1px solid ${message.includes('❌') ? '#E50914' : '#46d369'}`,
            borderRadius: '4px', padding: '12px', marginBottom: '20px',
            color: message.includes('❌') ? '#ff6b6b' : '#46d369', fontSize: '14px',
          }}>
            {message}
          </div>
        )}

        {/* Bouton sauvegarde */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%', backgroundColor: saving ? '#666' : '#E50914',
            color: '#fff', border: 'none', borderRadius: '4px',
            padding: '14px', fontSize: '16px', fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Sauvegarde...' : '💾 Sauvegarder le profil'}
        </button>

        {/* Déconnexion */}
        <button
          onClick={async () => { await supabase.auth.signOut(); navigate('/'); }}
          style={{
            width: '100%', backgroundColor: 'transparent',
            border: '1px solid #555', color: '#aaa',
            borderRadius: '4px', padding: '12px',
            fontSize: '14px', cursor: 'pointer', marginTop: '12px',
          }}
        >
          🚪 Se déconnecter
        </button>
      </div>
    </div>
  );
}