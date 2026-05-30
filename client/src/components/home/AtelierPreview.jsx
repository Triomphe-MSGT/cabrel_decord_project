import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../ui/ProductCard';
import ArtCard from '../ui/ArtCard';

export default function AtelierPreview() {
  const { products: mobilier, loading: loadMob } = useProducts({ atelier: 'mobilier', limit: 3 });
  const { products: art, loading: loadArt } = useProducts({ atelier: 'art', limit: 3 });

  return (
    <section className="section-block">
      <div className="section-block__inner">
        <h2 className="section-block__title">Nos ateliers</h2>
        <p className="section-block__subtitle">
          Survolez une image pour découvrir le produit en situation.
        </p>

        <div className="atelier-preview-grid">
          <div className="atelier-preview-col">
            <div className="atelier-preview-header">
              <h3 className="atelier-preview-label">Atelier Mobilier</h3>
              <Link to="/mobilier" className="atelier-preview-link">Voir tout →</Link>
            </div>
            {loadMob && <p className="text-sm opacity-60">Chargement...</p>}
            <div className="atelier-preview-products">
              {mobilier.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>

          <div className="atelier-preview-col">
            <div className="atelier-preview-header">
              <h3 className="atelier-preview-label">Atelier Art</h3>
              <Link to="/art" className="atelier-preview-link">Voir tout →</Link>
            </div>
            {loadArt && <p className="text-sm opacity-60">Chargement...</p>}
            <div className="atelier-preview-products">
              {art.map((p) => (
                <ArtCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
