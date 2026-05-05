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
   } catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion.';
  setError(errorMessage);
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