import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/** Blocks unauthenticated users — redirects them to /login */
function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User has verified OTP and is authenticated but hasn't finished registration
  // (interests + notification not set yet). Send them back to complete it.
  if (!user.isRegistered) {
    return <Navigate to="/register" replace />;
  }

  return children;
}

export default ProtectedRoute;
