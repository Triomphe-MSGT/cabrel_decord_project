import { useEffect, useState } from 'react';
import { heroApi } from '../../services/api';
import AdminShell from '../../components/admin/AdminShell';
import ImageUpload from '../../components/admin/ImageUpload';
import PageTransition from '../../components/layout/PageTransition';
import { resolveMediaUrl } from '../../utils/mediaUrl';

const emptySlide = {
  mainImage: '',
  insetImage: '',
  kicker: '',
  title: '',
  name: '',
  description: '',
  badge: '',
  ctaLabel: '',
  ctaLink: '/mobilier',
  ordre: 1,
  actif: true,
};

export default function AdminHero() {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState(emptySlide);
  const [editingId, setEditingId] = useState(null);

  const load = () => {
    heroApi.getAll().then(({ data }) => setSlides(data));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      ordre: Number(form.ordre),
      actif: Boolean(form.actif),
    };
    if (editingId) {
      await heroApi.update(editingId, payload);
    } else {
      await heroApi.create(payload);
    }
    setForm(emptySlide);
    setEditingId(null);
    load();
  };

  const handleEdit = (slide) => {
    setEditingId(slide._id);
    setForm({
      mainImage: slide.mainImage || '',
      insetImage: slide.insetImage || '',
      kicker: slide.kicker || '',
      title: slide.title || '',
      name: slide.name || '',
      description: slide.description || '',
      badge: slide.badge || '',
      ctaLabel: slide.ctaLabel || '',
      ctaLink: slide.ctaLink || '',
      ordre: slide.ordre ?? 1,
      actif: slide.actif !== false,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce slide ?')) return;
    await heroApi.remove(id);
    load();
  };

  return (
    <PageTransition>
      <AdminShell title="Bannière hero" description="Images et textes du slider page d'accueil.">

        <form onSubmit={handleSubmit} className="admin-card admin-card--spaced">
          <h2 className="admin-card__title">
            {editingId ? 'Modifier le slide' : 'Nouveau slide'}
          </h2>
          <p className="admin-card__desc -mt-2 mb-6">
            Chaque slide correspond à une diapositive du bandeau d&apos;accueil.
          </p>

          <fieldset className="admin-form-section">
            <legend className="admin-form-section__title">Images</legend>
            <div className="admin-form-grid">
              <div className="admin-field admin-field--full">
                <ImageUpload
                  label="Photo principale (grand format)"
                  value={form.mainImage}
                  onChange={(url) => setForm({ ...form, mainImage: url })}
                  folder="hero"
                  required
                />
                <span className="admin-field__hint">
                  Image de fond plein écran — paysage, bonne résolution.
                </span>
              </div>
              <div className="admin-field admin-field--full">
                <ImageUpload
                  label="Petite vignette (optionnelle)"
                  value={form.insetImage}
                  onChange={(url) => setForm({ ...form, insetImage: url })}
                  folder="hero"
                />
                <span className="admin-field__hint">
                  Miniature superposée en bas à gauche de la photo principale.
                </span>
              </div>
            </div>
          </fieldset>

          <fieldset className="admin-form-section">
            <legend className="admin-form-section__title">Textes affichés</legend>
            <div className="admin-form-grid">
              <label className="admin-field">
                <span className="admin-field__label">Surtitre (petit texte)</span>
                <input
                  value={form.kicker}
                  onChange={(e) => setForm({ ...form, kicker: e.target.value })}
                  required
                  className="admin-field__input"
                  placeholder="Ex. Atelier Mobilier"
                />
                <span className="admin-field__hint">Ligne discrète au-dessus du titre.</span>
              </label>
              <label className="admin-field">
                <span className="admin-field__label">Titre principal</span>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="admin-field__input"
                  placeholder="Ex. Mobilier"
                />
              </label>
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">Accroche (en gras)</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="admin-field__input"
                  placeholder="Ex. L'élégance du bois noble"
                />
                <span className="admin-field__hint">Phrase d&apos;impact mise en valeur sous le titre.</span>
              </label>
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  rows={3}
                  className="admin-field__input"
                  placeholder="Quelques mots pour présenter cette slide…"
                />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">Badge (optionnel)</span>
                <input
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="admin-field__input"
                  placeholder="Ex. Sur mesure"
                />
                <span className="admin-field__hint">Étiquette à côté du bouton d&apos;action.</span>
              </label>
              <label className="admin-field">
                <span className="admin-field__label">Ordre d&apos;affichage</span>
                <input
                  type="number"
                  min={1}
                  value={form.ordre}
                  onChange={(e) => setForm({ ...form, ordre: e.target.value })}
                  className="admin-field__input"
                />
                <span className="admin-field__hint">1 = en premier, 2 = en second, etc.</span>
              </label>
            </div>
          </fieldset>

          <fieldset className="admin-form-section">
            <legend className="admin-form-section__title">Bouton d&apos;action</legend>
            <div className="admin-form-grid">
              <label className="admin-field">
                <span className="admin-field__label">Texte du bouton</span>
                <input
                  value={form.ctaLabel}
                  onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                  required
                  className="admin-field__input"
                  placeholder="Ex. Voir le catalogue"
                />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">Lien de destination</span>
                <input
                  value={form.ctaLink}
                  onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                  required
                  className="admin-field__input"
                  placeholder="/mobilier ou /art"
                />
                <span className="admin-field__hint">Page interne du site (commence par /).</span>
              </label>
              <label className="admin-field--check admin-field--full">
                <input
                  type="checkbox"
                  checked={form.actif}
                  onChange={(e) => setForm({ ...form, actif: e.target.checked })}
                />
                <span>
                  <strong>Visible sur le site</strong>
                  <em>Décocher pour masquer ce slide sans le supprimer.</em>
                </span>
              </label>
            </div>
          </fieldset>

          <div className="flex flex-wrap gap-2 pt-2">
            <button type="submit" className="admin-btn admin-btn--primary mt-0">
              {editingId ? 'Enregistrer les modifications' : 'Créer le slide'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setForm(emptySlide); }}
                className="admin-btn admin-btn--ghost mt-4"
              >
                Annuler
              </button>
            )}
          </div>
        </form>

        <section>
          <h2 className="admin-card__title">Slides existants ({slides.length})</h2>
          <ul className="admin-list mt-4">
            {slides.map((slide) => (
              <li key={slide._id} className="admin-list__item">
                <img
                  src={resolveMediaUrl(slide.mainImage)}
                  alt=""
                  className="admin-list__thumb"
                />
                <div className="admin-list__body">
                  <p className="admin-list__title">{slide.title}</p>
                  <p className="admin-list__meta">
                    {slide.kicker} · ordre {slide.ordre}
                    {!slide.actif && ' · Masqué'}
                  </p>
                </div>
                <div className="admin-list__actions">
                  <button type="button" onClick={() => handleEdit(slide)} className="admin-btn admin-btn--ghost admin-btn--sm">
                    Modifier
                  </button>
                  <button type="button" onClick={() => handleDelete(slide._id)} className="admin-btn admin-btn--ghost admin-btn--sm text-red-600">
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </AdminShell>
    </PageTransition>
  );
}
