import { Link } from 'react-router-dom';
import { Mail, MessageCircle, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import BrandLogo from '../ui/BrandLogo';
import { useContactSettings } from '../../context/ContactSettingsContext';
import {
  getGeneralWhatsAppLink,
  getGeneralEmailLink,
  getFacebookLink,
  formatWhatsAppDisplay,
} from '../../utils/contactLinks';

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/mobilier', label: 'Mobilier' },
  { to: '/art', label: 'Art décoratif' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/recherche', label: 'Recherche' },
];

const atelierLinks = [
  { to: '/mobilier', label: 'Atelier Mobilier', desc: 'Tables, chaises, sur mesure' },
  { to: '/art', label: 'Atelier Art', desc: 'Tableaux & œuvres originales' },
];

export default function Footer() {
  const { contact } = useContactSettings();
  const whatsappLink = getGeneralWhatsAppLink(contact);
  const emailLink = getGeneralEmailLink(contact);
  const facebookLink = getFacebookLink(contact);
  const whatsappDisplay = formatWhatsAppDisplay(contact?.whatsapp);

  return (
    <footer className="footer">
      <div className="footer__accent" aria-hidden />

      <div className="footer__main">
        <div className="footer__grid">
          <div className="footer__brand-col">
            <BrandLogo size="lg" onDark linkTo="/" />
            <p className="footer__tagline">
              CD&M — Cabrel Décor et Meubles. Mobilier artisanal en bois noble et art
              décoratif original, fabriqués avec passion au Cameroun.
            </p>
            <div className="footer__social">
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-btn"
                  aria-label="Nous contacter sur WhatsApp"
                >
                  <MessageCircle size={18} />
                </a>
              )}
              <a
                href={emailLink}
                className="footer__social-btn"
                aria-label="Nous envoyer un e-mail"
              >
                <Mail size={18} />
              </a>
              {facebookLink && (
                <a
                  href={facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-btn"
                  aria-label="Nous contacter sur Messenger"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.922 1.443 5.532 3.707 7.234V22l3.374-1.853c.898.248 1.848.382 2.919.382 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.016 12.451-2.558-2.732-4.994 2.732 5.494-5.842 2.624 2.732 4.928-2.732-5.494 5.842z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">Navigation</h3>
            <ul className="footer__links">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="footer__link">
                    {label}
                    <ArrowUpRight size={13} className="footer__link-icon" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">Nos ateliers</h3>
            <ul className="footer__ateliers">
              {atelierLinks.map(({ to, label, desc }) => (
                <li key={to}>
                  <Link to={to} className="footer__atelier-link">
                    <span className="footer__atelier-name">{label}</span>
                    <span className="footer__atelier-desc">{desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">Contact</h3>
            <ul className="footer__contact-list">
              <li>
                <Mail size={16} className="footer__contact-icon" aria-hidden />
                <a href={emailLink} className="footer__contact-link">
                  {contact?.email}
                </a>
              </li>
              {whatsappLink && whatsappDisplay && (
                <li>
                  <MessageCircle size={16} className="footer__contact-icon" aria-hidden />
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="footer__contact-link">
                    WhatsApp · {whatsappDisplay}
                  </a>
                </li>
              )}
              {contact?.adresse && (
                <li>
                  <MapPin size={16} className="footer__contact-icon" aria-hidden />
                  <span>{contact.adresse}</span>
                </li>
              )}
              {contact?.horaires && (
                <li>
                  <Clock size={16} className="footer__contact-icon" aria-hidden />
                  <span>{contact.horaires}</span>
                </li>
              )}
            </ul>
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="footer__cta">
                <MessageCircle size={16} />
                Discuter sur WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p>© {new Date().getFullYear()} Cabrel Décor et Meubles — Tous droits réservés</p>
          <p className="footer__bottom-sub">AGRANDISSEMENT PHOTO &amp; AMÉNAGEMENT</p>
        </div>
      </div>
    </footer>
  );
}
