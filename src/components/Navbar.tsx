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