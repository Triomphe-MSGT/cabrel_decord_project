import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, LogOut, ExternalLink, User } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import BrandLogo from '../ui/BrandLogo';
import { ADMIN_NAV } from '../../config/adminNav';

const navClass = ({ isActive }) =>
  `admin-shell__nav-link${isActive ? ' admin-shell__nav-link--active' : ''}`;

export default function AdminShell({ title, description, children, wide = false }) {
  const { logout, adminUser } = useAdmin();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="admin-shell">
      <aside className={`admin-shell__sidebar${menuOpen ? ' admin-shell__sidebar--open' : ''}`}>
        <div className="admin-shell__sidebar-head">
          <BrandLogo size="sm" linkTo="/admin/dashboard" />
          <button
            type="button"
            className="admin-shell__close lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-shell__nav" aria-label="Navigation admin">
          {ADMIN_NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={navClass}
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={18} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-shell__sidebar-foot">
          {adminUser && (
            <Link to="/admin/profil" className="admin-shell__user-link" onClick={() => setMenuOpen(false)}>
              <User size={15} />
              <span className="truncate">{adminUser.nom || adminUser.email}</span>
            </Link>
          )}
          <Link to="/" className="admin-shell__site-link" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={15} />
            Voir le site
          </Link>
          <button type="button" onClick={logout} className="admin-shell__logout-btn">
            <LogOut size={15} />
            Déconnexion
          </button>
        </div>
      </aside>

      {menuOpen && (
        <button
          type="button"
          className="admin-shell__backdrop lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Fermer le menu"
        />
      )}

      <div className="admin-shell__main">
        <header className="admin-shell__topbar">
          <button
            type="button"
            className="admin-shell__menu-btn lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={22} />
          </button>
          <div className="admin-shell__topbar-titles min-w-0">
            {title && <h1 className="admin-shell__title">{title}</h1>}
            {description && <p className="admin-shell__desc">{description}</p>}
          </div>
        </header>

        <div className={`admin-shell__content${wide ? ' admin-shell__content--wide' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
