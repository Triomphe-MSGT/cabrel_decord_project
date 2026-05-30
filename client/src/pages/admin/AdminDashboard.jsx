import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { useAdmin } from '../../context/AdminContext';
import PageTransition from '../../components/layout/PageTransition';

export default function AdminDashboard() {
  const { logout } = useAdmin();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.getStats().then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl">Tableau de bord</h1>
          <button
            type="button"
            onClick={logout}
            className="text-sm text-red-600 hover:underline"
          >
            Déconnexion
          </button>
        </div>

        {stats && (
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-white p-6 rounded-xl border border-cabrel-wood/10">
              <p className="text-3xl font-bold text-cabrel-wood">{stats.mobilier}</p>
              <p className="text-sm opacity-70">Produits mobilier</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-cabrel-wood/10">
              <p className="text-3xl font-bold text-cabrel-wood">{stats.art}</p>
              <p className="text-sm opacity-70">Œuvres art</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-cabrel-wood/10">
              <p className="text-3xl font-bold text-orange-600">{stats.pendingComments}</p>
              <p className="text-sm opacity-70">Commentaires en attente</p>
            </div>
          </div>
        )}

        <nav className="flex flex-wrap gap-4">
          <Link
            to="/admin/produits"
            className="px-5 py-3 bg-cabrel-wood text-white rounded-lg hover:opacity-90"
          >
            Gérer les produits
          </Link>
          <Link
            to="/admin/commentaires"
            className="px-5 py-3 bg-white border border-cabrel-wood/30 rounded-lg hover:border-cabrel-wood"
          >
            Modérer les commentaires
          </Link>
        </nav>
      </div>
    </PageTransition>
  );
}
