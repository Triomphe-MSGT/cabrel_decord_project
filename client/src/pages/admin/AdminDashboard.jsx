import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Armchair, Palette, MessageSquareWarning, Plus, ArrowRight } from 'lucide-react';
import { adminApi } from '../../services/api';
import AdminShell from '../../components/admin/AdminShell';
import { ADMIN_QUICK_ACTIONS } from '../../config/adminNav';
import PageTransition from '../../components/layout/PageTransition';

function AtelierPanel({ title, icon: Icon, count, vedette, variant, productsLink, addLink }) {
  return (
    <article className={`admin-atelier-panel admin-atelier-panel--${variant}`}>
      <div className="admin-atelier-panel__head">
        <span className="admin-atelier-panel__icon">
          <Icon size={22} strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="admin-atelier-panel__title">{title}</h2>
          <p className="admin-atelier-panel__stats">
            <strong>{count}</strong> produit{count !== 1 ? 's' : ''}
            {vedette > 0 && (
              <>
                {' · '}
                <strong>{vedette}</strong> en vedette
              </>
            )}
          </p>
        </div>
      </div>
      <div className="admin-atelier-panel__actions">
        <Link to={productsLink} className="admin-atelier-panel__link">
          Gérer le catalogue
          <ArrowRight size={16} />
        </Link>
        <Link to={addLink} className="admin-atelier-panel__add">
          <Plus size={16} />
          Nouveau produit
        </Link>
      </div>
    </article>
  );
}

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
        description="Vue d'ensemble par atelier et accès rapide."
      >
        {stats && (
          <>
            <section className="admin-dash-ateliers">
              <AtelierPanel
                title="Atelier Mobilier"
                icon={Armchair}
                count={stats.mobilier}
                vedette={stats.mobilierVedette}
                variant="mobilier"
                productsLink="/admin/produits?atelier=mobilier"
                addLink="/admin/produits?atelier=mobilier&new=1"
              />
              <AtelierPanel
                title="Atelier Art"
                icon={Palette}
                count={stats.art}
                vedette={stats.artVedette}
                variant="art"
                productsLink="/admin/produits?atelier=art"
                addLink="/admin/produits?atelier=art&new=1"
              />
            </section>

            {stats.pendingComments > 0 && (
              <div className="admin-dash-alert">
                <MessageSquareWarning size={20} />
                <p>
                  <strong>{stats.pendingComments}</strong> commentaire
                  {stats.pendingComments !== 1 ? 's' : ''} en attente de modération
                </p>
                <Link to="/admin/commentaires" className="admin-dash-alert__link">
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
