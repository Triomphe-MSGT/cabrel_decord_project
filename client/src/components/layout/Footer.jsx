import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-cabrel-dark text-cabrel-cream mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-serif text-lg text-cabrel-wood mb-2">Cabrel Décor</h3>
          <p className="text-sm opacity-80">
            Mobilier artisanal et art décoratif, fabriqués avec passion.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Navigation</h4>
          <ul className="space-y-1 text-sm opacity-80">
            <li><Link to="/mobilier" className="hover:text-cabrel-wood">Mobilier</Link></li>
            <li><Link to="/art" className="hover:text-cabrel-wood">Art</Link></li>
            <li><Link to="/recherche" className="hover:text-cabrel-wood">Recherche</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p className="text-sm opacity-80">
            {import.meta.env.VITE_CONTACT_EMAIL || 'contact@cabreldecor.com'}
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs py-4 opacity-60">
        © {new Date().getFullYear()} Cabrel Décor — Tous droits réservés
      </div>
    </footer>
  );
}
