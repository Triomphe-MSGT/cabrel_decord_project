import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Armchair, Palette } from 'lucide-react';
import { productsApi } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import AdminShell from '../../components/admin/AdminShell';
import ImageListEditor from '../../components/admin/ImageListEditor';
import PageTransition from '../../components/layout/PageTransition';

const ATELIERS = [
  { id: 'mobilier', label: 'Atelier Mobilier', icon: Armchair },
  { id: 'art', label: 'Atelier Art', icon: Palette },
];

const emptyProduct = (atelier) => ({
  titre: '',
  description: '',
  atelier,
  prix: '',
  disponible: true,
  enVedette: false,
  images: [],
  tags: [],
});

export default function AdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const atelier = searchParams.get('atelier') === 'art' ? 'art' : 'mobilier';
  const formRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct(atelier));
  const [editingId, setEditingId] = useState(null);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  const load = () => {
    productsApi.getAll({ limit: 100 }).then(({ data }) => {
      setProducts(data.products || data);
    });
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setForm(emptyProduct(atelier));
    setEditingId(null);
    setImages([]);
  }, [atelier]);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSearchParams({ atelier }, { replace: true });
    }
  }, [searchParams, atelier, setSearchParams]);

  const filtered = products.filter((p) => p.atelier === atelier);

  const switchAtelier = (id) => {
    setSearchParams({ atelier: id });
  };

  const resetForm = () => {
    setForm(emptyProduct(atelier));
    setEditingId(null);
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!images.length) {
      setFormError('Ajoutez au moins une photo avant de publier.');
      return;
    }

    const prix = Number(form.prix);
    if (!form.prix && form.prix !== 0) {
      setFormError('Indiquez un prix de vente.');
      return;
    }
    if (Number.isNaN(prix) || prix < 0) {
      setFormError('Le prix doit être un nombre positif ou zéro.');
      return;
    }

    const payload = {
      titre: form.titre.trim(),
      description: form.description.trim(),
      atelier,
      prix,
      disponible: form.disponible,
      enVedette: form.enVedette,
      images,
      tags: form.tags || [],
    };

    setSaving(true);
    try {
      if (editingId) {
        await productsApi.update(editingId, payload);
        setFormSuccess('Produit mis à jour.');
      } else {
        await productsApi.create(payload);
        setFormSuccess('Produit publié avec succès.');
      }
      resetForm();
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Impossible de publier le produit. Réessayez.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      ...p,
      atelier,
      prix: p.prix ?? '',
    });
    setImages(p.images?.length ? p.images : []);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await productsApi.remove(id);
    if (editingId === id) resetForm();
    load();
  };

  const atelierMeta = ATELIERS.find((a) => a.id === atelier);

  return (
    <PageTransition>
      <AdminShell
        title="Produits par atelier"
        description="Gérez le catalogue séparément pour chaque atelier."
      >
        <div className="admin-atelier-tabs" role="tablist" aria-label="Choisir un atelier">
          {ATELIERS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={atelier === id}
              onClick={() => switchAtelier(id)}
              className={`admin-atelier-tabs__btn${atelier === id ? ' admin-atelier-tabs__btn--active' : ''}${id === 'art' ? ' admin-atelier-tabs__btn--art' : ''}`}
            >
              <Icon size={18} />
              {label}
              <span className="admin-atelier-tabs__count">
                {products.filter((p) => p.atelier === id).length}
              </span>
            </button>
          ))}
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="admin-card admin-card--spaced"
        >
          <h2 className="admin-card__title">
            {editingId ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          <p className="admin-card__desc -mt-2 mb-6">
            Atelier {atelierMeta?.label} — remplissez chaque section ci-dessous.
          </p>

          {formError && <p className="admin-login__error mb-4">{formError}</p>}
          {formSuccess && <p className="admin-toast mb-4">{formSuccess}</p>}

          <fieldset className="admin-form-section">
            <legend className="admin-form-section__title">Informations générales</legend>
            <p className="admin-form-section__desc">
              Ce que le client verra sur la fiche produit et dans le catalogue.
            </p>
            <div className="admin-form-grid">
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">Nom du produit</span>
                <input
                  type="text"
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  placeholder="Ex. Table à manger en bois massif"
                  required
                  className="admin-field__input"
                />
                <span className="admin-field__hint">Titre affiché en grand sur la page produit.</span>
              </label>

              <label className="admin-field admin-field--full">
                <span className="admin-field__label">Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Matériaux, dimensions, finitions, délais de fabrication…"
                  required
                  rows={4}
                  className="admin-field__input"
                />
                <span className="admin-field__hint">
                  Décrivez le produit en détail pour rassurer le client.
                </span>
              </label>
            </div>
          </fieldset>

          <fieldset className="admin-form-section">
            <legend className="admin-form-section__title">Prix et visibilité</legend>
            <div className="admin-form-grid">
              <label className="admin-field">
                <span className="admin-field__label">Prix de vente</span>
                <div className="admin-field__price">
                  <input
                    type="number"
                    value={form.prix}
                    onChange={(e) => setForm({ ...form, prix: e.target.value })}
                    placeholder="Ex. 150000"
                    required
                    min={0}
                    step={1}
                    className="admin-field__input"
                  />
                  <span className="admin-field__suffix">FCFA</span>
                </div>
                <span className="admin-field__hint">Saisissez le montant exact de votre choix, en francs CFA.</span>
              </label>

              <div className="admin-field-group sm:col-span-2">
                <label className="admin-field--check">
                  <input
                    type="checkbox"
                    checked={form.disponible}
                    onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
                  />
                  <span>
                    <strong>Produit disponible</strong>
                    <em>Décocher si l&apos;article est en rupture ou sur commande uniquement.</em>
                  </span>
                </label>
                <label className="admin-field--check">
                  <input
                    type="checkbox"
                    checked={form.enVedette}
                    onChange={(e) => setForm({ ...form, enVedette: e.target.checked })}
                  />
                  <span>
                    <strong>Mettre à la une</strong>
                    <em>Afficher ce produit dans la section « À la une » de l&apos;accueil.</em>
                  </span>
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset className="admin-form-section">
            <legend className="admin-form-section__title">Photos du produit</legend>
            <p className="admin-form-section__desc">
              Téléversez au moins une photo. La 2ᵉ s&apos;affiche au survol dans le catalogue.
            </p>
            <ImageListEditor images={images} onChange={setImages} folder="products" />
          </fieldset>

          <div className="flex flex-wrap gap-2 pt-2">
            <button type="submit" disabled={saving} className="admin-btn admin-btn--primary mt-0">
              {saving
                ? 'Publication…'
                : editingId
                  ? 'Enregistrer les modifications'
                  : 'Publier le produit'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="admin-btn admin-btn--ghost mt-4">
                Annuler
              </button>
            )}
          </div>
        </form>

        <section>
          <h2 className="admin-card__title">
            {filtered.length} produit{filtered.length !== 1 ? 's' : ''} — {atelierMeta?.label}
          </h2>
          {filtered.length === 0 ? (
            <p className="admin-empty">Aucun produit dans cet atelier.</p>
          ) : (
            <ul className="admin-list">
              {filtered.map((p) => (
                <li key={p._id} className="admin-list__item">
                  {p.images?.[0] && (
                    <img src={resolveMediaUrl(p.images[0])} alt="" className="admin-list__thumb admin-list__thumb--sm" />
                  )}
                  <div className="admin-list__body">
                    <p className="admin-list__title">{p.titre}</p>
                    <p className="admin-list__meta">
                      {formatPrice(p.prix)}
                      {p.images?.length > 1 && ` · ${p.images.length} images`}
                      {p.enVedette && ' · Vedette'}
                    </p>
                  </div>
                  <div className="admin-list__actions">
                    <button
                      type="button"
                      onClick={() => handleEdit(p)}
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p._id)}
                      className="admin-btn admin-btn--ghost admin-btn--sm text-red-600"
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </AdminShell>
    </PageTransition>
  );
}
