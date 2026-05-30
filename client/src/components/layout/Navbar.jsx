import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import SearchBar from '../ui/SearchBar';
import BrandLogo from '../ui/BrandLogo';

const navLinkClass = ({ isActive }) =>
  `navbar-link${isActive ? ' navbar-link--active' : ''}`;

const links = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/mobilier', label: 'Mobilier' },
  { to: '/art', label: 'Art' },
  { to: '/a-propos', label: 'À propos' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isSolid = scrolled || open;

  return (
    <header className={`navbar${isSolid ? ' navbar--scrolled' : ''}`}>
      <div className="navbar-inner">
        <BrandLogo size="md" showName linkTo="/" />

        <SearchBar compact className="navbar-search-desktop" />

        <ul className="navbar-links">
          {links.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={navLinkClass}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="navbar-mobile">
          <SearchBar compact />
          <ul className="navbar-mobile-links">
            {links.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
