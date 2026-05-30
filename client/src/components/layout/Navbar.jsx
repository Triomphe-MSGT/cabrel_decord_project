import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded transition-colors ${
    isActive ? 'text-cabrel-wood font-semibold' : 'hover:text-cabrel-wood'
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cabrel-cream/95 backdrop-blur border-b border-cabrel-wood/20">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl font-bold text-cabrel-wood">
          Cabrel Décor
        </Link>

        <ul className="hidden md:flex items-center gap-2">
          <li><NavLink to="/" end className={navLinkClass}>Accueil</NavLink></li>
          <li><NavLink to="/mobilier" className={navLinkClass}>Mobilier</NavLink></li>
          <li><NavLink to="/art" className={navLinkClass}>Art</NavLink></li>
          <li><NavLink to="/recherche" className={navLinkClass}>Recherche</NavLink></li>
        </ul>

        <button
          type="button"
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <ul className="md:hidden border-t border-cabrel-wood/20 px-4 py-3 flex flex-col gap-2">
          <li><NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>Accueil</NavLink></li>
          <li><NavLink to="/mobilier" className={navLinkClass} onClick={() => setOpen(false)}>Mobilier</NavLink></li>
          <li><NavLink to="/art" className={navLinkClass} onClick={() => setOpen(false)}>Art</NavLink></li>
          <li><NavLink to="/recherche" className={navLinkClass} onClick={() => setOpen(false)}>Recherche</NavLink></li>
        </ul>
      )}
    </header>
  );
}
