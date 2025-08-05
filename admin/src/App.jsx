import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminLogin from './components/AdminLogin';
import Match from './pages/Match';
import Player from './pages/Player';
import Tournament from './pages/Tournament';

import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import FloatingActionButton from './components/FloatingActionButton';
import ImageBanner from './components/ImageBanner';

const AppContent = () => {
  const location = useLocation();
  const { admin } = useAuth();

  const privatePaths = ['/player', '/match', '/tournament'];
  const isPrivateRoute = privatePaths.includes(location.pathname);

  // Show FAB only if authenticated AND not on login page
  const showFab = admin && location.pathname !== '/login';

  return (
    <>
      {showFab && <FloatingActionButton />}

      {/* ✅ Show banner only on private routes */}
      {isPrivateRoute && <ImageBanner />}

      <Routes>
        <Route path="/login" element={<AdminLogin />} />

        <Route path="/" element={<Navigate to="/player" replace />} />

        <Route
          path="/player"
          element={
            <PrivateRoute>
              <Player />
            </PrivateRoute>
          }
        />
        <Route
          path="/match"
          element={
            <PrivateRoute>
              <Match />
            </PrivateRoute>
          }
        />
        <Route
          path="/tournament"
          element={
            <PrivateRoute>
              <Tournament />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      <AppContent />
    </AuthProvider>
  );
};

export default App;
