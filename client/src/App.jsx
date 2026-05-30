import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from './context/AdminContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Mobilier from './pages/Mobilier';
import MobilierDetail from './pages/MobilierDetail';
import Art from './pages/Art';
import ArtDetail from './pages/ArtDetail';
import SearchResults from './pages/SearchResults';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminComments from './pages/admin/AdminComments';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAdmin();
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin') && location.pathname !== '/admin';

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/mobilier" element={<Mobilier />} />
          <Route path="/mobilier/:id" element={<MobilierDetail />} />
          <Route path="/art" element={<Art />} />
          <Route path="/art/:id" element={<ArtDetail />} />
          <Route path="/recherche" element={<SearchResults />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/produits"
            element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/commentaires"
            element={
              <ProtectedRoute>
                <AdminComments />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

export default function App() {
  return <AppLayout />;
}
