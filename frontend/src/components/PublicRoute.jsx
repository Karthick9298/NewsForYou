import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

function AuthLoadingSpinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/** Blocks authenticated users — redirects them to /dashboard */
function PublicRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <AuthLoadingSpinner />;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;
