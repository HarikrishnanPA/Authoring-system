import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import OverviewPage from './components/OverviewPage';
import ServicesPage from './components/ServicesPage';
import ServiceDetailPage from './components/ServiceDetailPage';
import ServiceFormPage from './components/ServiceFormPage';
import CaseStudiesPage from './components/CaseStudiesPage';
import CaseStudyDetailPage from './components/CaseStudyDetailPage';
import CaseStudyFormPage from './components/CaseStudyFormPage';
import NewsPage from './components/NewsPage';
import NewsDetailPage from './components/NewsDetailPage';
import NewsFormPage from './components/NewsFormPage';
import ArticlesPage from './components/ArticlesPage';
import PortfoliosPage from './components/PortfoliosPage';
import BlogsPage from './components/BlogsPage';

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
