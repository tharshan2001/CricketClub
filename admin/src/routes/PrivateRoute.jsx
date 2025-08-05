// routes/PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return admin ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
