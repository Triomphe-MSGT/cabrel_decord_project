import { Link } from 'react-router-dom';

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="announcement-bar-inner">
        <p className="announcement-bar-text">
          Produits artisanaux — pièces uniques fabriquées localement.
        </p>
        <Link to="/produits" className="announcement-bar-link">
          Découvrir la collection
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}