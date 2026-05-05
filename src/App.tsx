import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login       from './pages/Login';
import Browse      from './pages/Browse';
import Series      from './pages/Series';
import Films       from './pages/Films';
import Nouveautes  from './pages/Nouveautes';
import MovieDetail from './pages/MovieDetail';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"      element={<Login />} />
      <Route path="/browse"     element={<ProtectedRoute><Browse /></ProtectedRoute>} />
      <Route path="/series"     element={<ProtectedRoute><Series /></ProtectedRoute>} />
      <Route path="/films"      element={<ProtectedRoute><Films /></ProtectedRoute>} />
      <Route path="/nouveautes" element={<ProtectedRoute><Nouveautes /></ProtectedRoute>} />
      <Route path="/movie/:id"  element={<ProtectedRoute><MovieDetail /></ProtectedRoute>} />
      <Route path="*"           element={<Navigate to="/login" />} />
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