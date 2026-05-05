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
      <div style={{ position: 'relative' }}>
  <div
    onClick={() => setMenuOpen(!menuOpen)}
    style={{
      width: '32px', height: '32px', borderRadius: '4px',
      backgroundColor: '#E50914',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
    }}>
    {user?.email?.[0]?.toUpperCase()}
  </div>

  {menuOpen && (
    <div style={{
      position: 'absolute', top: '40px', right: 0,
      backgroundColor: '#141414',
      border: '1px solid #333',
      borderRadius: '4px',
      padding: '8px 0',
      minWidth: '150px',
      zIndex: 100,
    }}>
      <p style={{ color: '#fff', padding: '8px 16px', fontSize: '13px', borderBottom: '1px solid #333' }}>
        {user?.email}
      </p>
      <button
        onClick={handleLogout}
        style={{
          width: '100%', textAlign: 'left',
          backgroundColor: 'transparent', border: 'none',
          color: '#fff', padding: '10px 16px',
          fontSize: '13px', cursor: 'pointer',
        }}>
        Déconnexion
      </button>
    </div>
  )}
</div>
    </nav>
  );
}