import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Armchair, Palette, MessageSquareWarning, Plus, ArrowRight } from 'lucide-react';
import { adminApi } from '../../services/api';
import AdminShell from '../../components/admin/AdminShell';
import { ADMIN_QUICK_ACTIONS } from '../../config/adminNav';
import PageTransition from '../../components/layout/PageTransition';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.getStats().then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  return (
    <PageTransition>
      <AdminShell
        wide
        title="Tableau de bord"
        description="Vue d'ensemble du catalogue et accès rapide."
      >
        {stats && (
          <>
            <section className="admin-dash-summary">
              <div className="admin-dash-stat">
                <h3 className="admin-dash-stat-title">Produits</h3>
                <p className="admin-dash-stat-value">
                  <strong>{stats.mobilier + stats.art}</strong> produit{(stats.mobilier + stats.art) !== 1 ? 's' : ''}
                  {(stats.mobilierVedette + stats.artVedette) > 0 && (
                    <>
                      {' · '}
                      <strong>{stats.mobilierVedette + stats.artVedette}</strong> en vedette
                    </>
                  )}
                </p>
              </div>
              <div className="admin-dash-stat">
                <h3 className="admin-dash-stat-title">Commentaires</h3>
                <p className="admin-dash-stat-value">
                  <strong>{stats.pendingComments}</strong> en attente de modération
                </p>
              </div>
            </section>

            {stats.pendingComments > 0 && (
              <div className="admin-dash-alert">
                <MessageSquareWarning size={20} />
                <p>
                  <strong>{stats.pendingComments}</strong> commentaire
                  {stats.pendingComments !== 1 ? 's' : ''} en attente de modération
                </p>
                <Link to="/cdm/commentaires" className="admin-dash-alert__link">
                  Modérer
                </Link>
              </div>
            )}
          </>
        )}

        <section className="admin-dash-section">
          <h2 className="admin-dash-section__title">Actions rapides</h2>
          <div className="admin-dash-grid">
            {ADMIN_QUICK_ACTIONS.map(({ to, label, desc, icon: Icon, primary }) => (
              <Link
                key={to}
                to={to}
                className={`admin-dash-card${primary ? ' admin-dash-card--primary' : ''}`}
              >
                <span className="admin-dash-card__icon">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <span className="admin-dash-card__label">{label}</span>
                <span className="admin-dash-card__desc">{desc}</span>
              </Link>
            ))}
          </div>
        </section>
      </AdminShell>
    </PageTransition>
  );
}