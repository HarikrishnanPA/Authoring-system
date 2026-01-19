import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import OverviewPage from './pages/overview/OverviewPage';
import ServicesPage from './pages/services/ServicesPage';
import ServiceDetailPage from './pages/services/ServiceDetailPage';
import ServiceFormPage from './pages/services/ServiceFormPage';
import CaseStudiesPage from './pages/case-studies/CaseStudiesPage';
import CaseStudyDetailPage from './pages/case-studies/CaseStudyDetailPage';
import CaseStudyFormPage from './pages/case-studies/CaseStudyFormPage';
import NewsPage from './pages/news/NewsPage';
import NewsDetailPage from './pages/news/NewsDetailPage';
import NewsFormPage from './pages/news/NewsFormPage';
import ArticlesPage from './pages/placeholder/ArticlesPage';
import PortfoliosPage from './pages/placeholder/PortfoliosPage';
import BlogsPage from './pages/placeholder/BlogsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return token ? <Navigate to="/overview" replace /> : <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/overview"
        element={
          <ProtectedRoute>
            <OverviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <ServicesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services/new"
        element={
          <ProtectedRoute>
            <ServiceFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services/:id/edit"
        element={
          <ProtectedRoute>
            <ServiceFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services/:id"
        element={
          <ProtectedRoute>
            <ServiceDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/case-studies"
        element={
          <ProtectedRoute>
            <CaseStudiesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/case-studies/new"
        element={
          <ProtectedRoute>
            <CaseStudyFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/case-studies/:id/edit"
        element={
          <ProtectedRoute>
            <CaseStudyFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/case-studies/:id"
        element={
          <ProtectedRoute>
            <CaseStudyDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/news"
        element={
          <ProtectedRoute>
            <NewsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/news/new"
        element={
          <ProtectedRoute>
            <NewsFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/news/:id/edit"
        element={
          <ProtectedRoute>
            <NewsFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/news/:id"
        element={
          <ProtectedRoute>
            <NewsDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles"
        element={
          <ProtectedRoute>
            <ArticlesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolios"
        element={
          <ProtectedRoute>
            <PortfoliosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs"
        element={
          <ProtectedRoute>
            <BlogsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
