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
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '0 40px', height: '68px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled
        ? '#141414'
        : 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)',
      transition: 'background 0.4s ease',
    }}>

      {/* Logo */}
      <div onClick={() => navigate('/browse')} style={{
        color: '#E50914', fontSize: '1.8rem', fontWeight: 900,
        letterSpacing: '4px', cursor: 'pointer', flexShrink: 0,
      }}>
        NETFLIX
      </div>

      {/* Liens navigation */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        {[
          { label: 'Accueil',    path: '/browse' },
          { label: 'Séries',     path: '/series' },
          { label: 'Films',      path: '/films' },
          { label: 'Nouveautés', path: '/nouveautes' },
          { label: '❤️ Favoris', path: '/favorites' },
          { label: '👤 Profil', path: '/profile' },
          { label: '💳 Abonnement', path: '/pricing' },
        ].map(item => (
          <span key={item.label} onClick={() => navigate(item.path)} style={{
            color: '#e5e5e5', fontSize: '14px', cursor: 'pointer', transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#e5e5e5')}
          >
            {item.label}
          </span>
        ))}
      </div>

      {/* Droite : recherche + profil */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

        {/* Icône recherche */}
        <div
          onClick={() => navigate('/search')}
          style={{
            color: '#fff', fontSize: '20px', cursor: 'pointer',
            padding: '4px', borderRadius: '4px', transition: 'color 0.2s',
          }}
          title="Rechercher"
          onMouseEnter={e => (e.currentTarget.style.color = '#E50914')}
          onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
        >
          🔍
        </div>

        <span style={{ color: '#e5e5e5', fontSize: '13px' }}>
          {user?.email?.split('@')[0]}
        </span>

        {/* Avatar — clic → historique ou menu */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              width: '32px', height: '32px', borderRadius: '4px',
              backgroundColor: '#E50914',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: '14px',
              cursor: 'pointer', flexShrink: 0,
            }}
            title="Mon compte"
          >
            {user?.email?.[0]?.toUpperCase()}
          </div>

          {menuOpen && (
            <div style={{
              position: 'absolute', top: '40px', right: 0,
              backgroundColor: '#141414', border: '1px solid #333',
              borderRadius: '4px', padding: '8px 0',
              minWidth: '180px', zIndex: 100,
            }}>
              <p style={{
                color: '#aaa', padding: '8px 16px',
                fontSize: '12px', borderBottom: '1px solid #333',
              }}>
                {user?.email}
              </p>
              <button
                onClick={() => { setMenuOpen(false); navigate('/search'); }}
                style={{
                  width: '100%', textAlign: 'left',
                  backgroundColor: 'transparent', border: 'none',
                  color: '#fff', padding: '10px 16px',
                  fontSize: '13px', cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2a2a2a')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                🔍 Rechercher
              </button>
              <button
                onClick={() => { setMenuOpen(false); navigate('/history'); }}
                style={{
                  width: '100%', textAlign: 'left',
                  backgroundColor: 'transparent', border: 'none',
                  color: '#fff', padding: '10px 16px',
                  fontSize: '13px', cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2a2a2a')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                🕐 Historique
              </button>
              <div style={{ borderTop: '1px solid #333', marginTop: '4px' }} />
              <button
                onClick={handleLogout}
                style={{
                  width: '100%', textAlign: 'left',
                  backgroundColor: 'transparent', border: 'none',
                  color: '#E50914', padding: '10px 16px',
                  fontSize: '13px', cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2a2a2a')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}