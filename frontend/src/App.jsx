import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import PageTransition from './components/PageTransition';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LinkPage from './pages/LinkPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoadingProvider>
          <PageTransition>
            <Routes>
              <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/link-bank"
                element={
                  <ProtectedRoute>
                    <LinkPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </PageTransition>
        </LoadingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
