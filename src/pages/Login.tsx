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
   } catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion.';
  setError(errorMessage);
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