import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAdmin } from './context/AdminContext';
import Navbar from './components/layout/Navbar';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Produits from './pages/Produits';
import ProductDetail from './pages/ProductDetail';
import SearchResults from './pages/SearchResults';
import About from './pages/About';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminComments from './pages/admin/AdminComments';
import AdminHero from './pages/admin/AdminHero';
import AdminFeatured from './pages/admin/AdminFeatured';
import AdminProfile from './pages/admin/AdminProfile';
import AdminContact from './pages/admin/AdminContact';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAdmin();
  if (!isAuthenticated) {
    return <Navigate to="/cdm" replace />;
  }
  return children;
}

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/cdm');
  const isPublicLayout = !isAdminRoute;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      {isPublicLayout && <Navbar />}
      {isPublicLayout && <AnnouncementBar />}
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/produits" element={<Produits />} />
          <Route path="/produits/:slug" element={<ProductDetail />} />
          <Route path="/recherche" element={<SearchResults />} />
          <Route path="/a-propos" element={<About />} />

          {/* Admin */}
          <Route path="/cdm" element={<AdminLogin />} />
          <Route
            path="/cdm/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cdm/produits"
            element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cdm/hero"
            element={
              <ProtectedRoute>
                <AdminHero />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cdm/featured"
            element={
              <ProtectedRoute>
                <AdminFeatured />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cdm/commentaires"
            element={
              <ProtectedRoute>
                <AdminComments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cdm/profil"
            element={
              <ProtectedRoute>
                <AdminProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cdm/contact"
            element={
              <ProtectedRoute>
                <AdminContact />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {isPublicLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return <AppLayout />;
}