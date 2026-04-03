import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/** Blocks authenticated users — redirects them to /dashboard */
function PublicRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  // Only fully-registered users are redirected away from public pages.
  // An authenticated-but-unregistered user must still be able to reach /register
  // to complete the interests + notification steps.
  if (user && user.isRegistered) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;
