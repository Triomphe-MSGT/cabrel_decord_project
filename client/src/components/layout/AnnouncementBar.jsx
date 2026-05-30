import { Link } from 'react-router-dom';

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="announcement-bar-inner">
        <p className="announcement-bar-text">
          Mobilier artisanal &amp; art décoratif — pièces uniques fabriquées localement.
        </p>
        <Link to="/mobilier" className="announcement-bar-link">
          Découvrir la collection
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
