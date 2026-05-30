import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Star, StarOff } from 'lucide-react';
import { featuredApi } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import AdminShell from '../../components/admin/AdminShell';
import PageTransition from '../../components/layout/PageTransition';

const emptySection = {
  kicker: 'Sélection du moment',
  title: 'À la une',
  subtitle: '',
  maxItems: 6,
  actif: true,
  ctaLabel: 'Explorer le catalogue',
  ctaLink: '/mobilier',
};

export default function AdminFeatured() {
  const [section, setSection] = useState(emptySection);
  const [featured, setFeatured] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const maxItems = Math.min(12, Math.max(1, Number(section.maxItems) || 6));

  const load = () => {
    featuredApi.getAdmin().then(({ data }) => {
      setSection({ ...emptySection, ...data.section });
      setFeatured(data.featured || []);
      setAllProducts(data.all || []);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const saveSection = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const nextMax = Math.min(12, Math.max(1, Number(section.maxItems) || 6));
      await featuredApi.updateSection({
        ...section,
        maxItems: nextMax,
      });
      if (featured.length > nextMax) {
        await featuredApi.updateProducts(
          featured.slice(0, nextMax).map((p, i) => ({
            _id: p._id,
            enVedette: true,
            ordreVedette: i + 1,
          })).concat(
            featured.slice(nextMax).map((p) => ({
              _id: p._id,
              enVedette: false,
              ordreVedette: 0,
            }))
          )
        );
      }
      setMessage('Configuration enregistrée.');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const saveProducts = async (list) => {
    setSaving(true);
    setMessage('');
    try {
      const trimmed = list.slice(0, maxItems);
      const items = trimmed.map((p, i) => ({
        _id: p._id,
        enVedette: true,
        ordreVedette: i + 1,
      }));
      allProducts
        .filter((p) => !trimmed.some((f) => f._id === p._id))
        .forEach((p) => {
          if (p.enVedette) {
            items.push({ _id: p._id, enVedette: false, ordreVedette: 0 });
          }
        });
      await featuredApi.updateProducts(items);
      setMessage('Sélection enregistrée.');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const toggleFeatured = (product) => {
    const isFeatured = featured.some((p) => p._id === product._id);
    if (isFeatured) {
      saveProducts(featured.filter((p) => p._id !== product._id));
      return;
    }
    if (featured.length >= maxItems) {
      setMessage(`Limite atteinte (${maxItems} produits). Augmentez le nombre ou retirez un produit.`);
      return;
    }
    saveProducts([...featured, product]);
  };

  const moveFeatured = (index, direction) => {
    const next = [...featured];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    saveProducts(next);
  };

  const notFeatured = allProducts.filter((p) => !featured.some((f) => f._id === p._id));

  return (
    <PageTransition>
      <AdminShell
        title="À la une"
        description="Choisissez combien de produits afficher et lesquels mettre en avant."
      >
        {message && <p className="admin-toast">{message}</p>}

        <form onSubmit={saveSection} className="admin-card admin-card--spaced">
          <h2 className="admin-card__title">Affichage sur l&apos;accueil</h2>

          <div className="admin-featured-count">
            <div className="admin-featured-count__head">
              <label htmlFor="maxItems" className="admin-featured-count__label">
                Nombre de produits affichés
              </label>
              <span className="admin-featured-count__value">{maxItems}</span>
            </div>
            <input
              id="maxItems"
              type="range"
              min={1}
              max={12}
              value={maxItems}
              onChange={(e) => setSection({ ...section, maxItems: Number(e.target.value) })}
              className="admin-featured-count__range"
            />
            <div className="admin-featured-count__slots" aria-hidden>
              {Array.from({ length: 12 }).map((_, i) => (
                <span
                  key={i}
                  className={`admin-featured-count__slot${i < maxItems ? ' admin-featured-count__slot--on' : ''}${i === 0 && maxItems > 0 ? ' admin-featured-count__slot--lead' : ''}`}
                />
              ))}
            </div>
            <p className="admin-featured-count__hint">
              {maxItems === 1
                ? '1 produit en pleine largeur.'
                : `${maxItems} produits — le 1er en grand format, les autres en grille.`}
            </p>
          </div>

          <h2 className="admin-card__title admin-card__title--sub">Textes de la section</h2>
          <div className="admin-form-grid">
            <label className="admin-field">
              <span className="admin-field__label">Kicker</span>
              <input
                value={section.kicker}
                onChange={(e) => setSection({ ...section, kicker: e.target.value })}
                className="admin-field__input"
              />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Titre</span>
              <input
                value={section.title}
                onChange={(e) => setSection({ ...section, title: e.target.value })}
                required
                className="admin-field__input"
              />
            </label>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">Sous-titre</span>
              <textarea
                value={section.subtitle}
                onChange={(e) => setSection({ ...section, subtitle: e.target.value })}
                rows={2}
                className="admin-field__input"
              />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Bouton — libellé</span>
              <input
                value={section.ctaLabel}
                onChange={(e) => setSection({ ...section, ctaLabel: e.target.value })}
                className="admin-field__input"
              />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Bouton — lien</span>
              <input
                value={section.ctaLink}
                onChange={(e) => setSection({ ...section, ctaLink: e.target.value })}
                className="admin-field__input"
                placeholder="/mobilier"
              />
            </label>
            <label className="admin-field admin-field--check admin-field--full">
              <input
                type="checkbox"
                checked={section.actif !== false}
                onChange={(e) => setSection({ ...section, actif: e.target.checked })}
              />
              <span>Section visible sur le site</span>
            </label>
          </div>
          <button type="submit" disabled={saving} className="admin-btn admin-btn--primary">
            Enregistrer
          </button>
        </form>

        <div className="admin-card admin-card--spaced">
          <h2 className="admin-card__title">
            Produits sélectionnés ({featured.length}/{maxItems})
          </h2>
          <p className="admin-card__desc">
            Le premier produit = mise en avant principale. Flèches pour réordonner.
          </p>
          {featured.length === 0 && (
            <p className="admin-empty">Aucun produit sélectionné.</p>
          )}
          <ul className="admin-list">
            {featured.map((p, i) => (
              <li key={p._id} className="admin-list__item">
                <img src={p.images?.[0]} alt="" className="admin-list__thumb" />
                <div className="admin-list__body">
                  <p className="admin-list__title">{p.titre}</p>
                  <p className="admin-list__meta">
                    {p.atelier} · {formatPrice(p.prix)}
                    {i === 0 && ' · Principal'}
                  </p>
                </div>
                <div className="admin-list__actions">
                  <button type="button" onClick={() => moveFeatured(i, -1)} disabled={i === 0 || saving} className="admin-icon-btn" aria-label="Monter">
                    <ChevronUp size={18} />
                  </button>
                  <button type="button" onClick={() => moveFeatured(i, 1)} disabled={i === featured.length - 1 || saving} className="admin-icon-btn" aria-label="Descendre">
                    <ChevronDown size={18} />
                  </button>
                  <button type="button" onClick={() => toggleFeatured(p)} disabled={saving} className="admin-icon-btn admin-icon-btn--danger" aria-label="Retirer">
                    <StarOff size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="admin-card">
          <h2 className="admin-card__title">Ajouter un produit</h2>
          <ul className="admin-list admin-list--scroll">
            {notFeatured.map((p) => (
              <li key={p._id} className="admin-list__item admin-list__item--flat">
                <img src={p.images?.[0]} alt="" className="admin-list__thumb admin-list__thumb--sm" />
                <div className="admin-list__body">
                  <p className="admin-list__title">{p.titre}</p>
                  <p className="admin-list__meta">{p.atelier}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFeatured(p)}
                  disabled={saving || featured.length >= maxItems}
                  className="admin-btn admin-btn--ghost admin-btn--sm"
                >
                  <Star size={15} />
                  Ajouter
                </button>
              </li>
            ))}
          </ul>
        </div>
      </AdminShell>
    </PageTransition>
  );
}
