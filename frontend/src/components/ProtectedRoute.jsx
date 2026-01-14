import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initialize, initialized } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
    setChecking(false);
  }, [initialized, initialize]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const token = localStorage.getItem('token');
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
