import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import AdminShell from '../../components/admin/AdminShell';
import ImageListEditor from '../../components/admin/ImageListEditor';
import PageTransition from '../../components/layout/PageTransition';

// Category lists (must match those in Product model)
const MOBILIER_CATEGORIES = [
  'table',
  'chaise',
  'armoire',
  'lit',
  'canapé',
  'étagère',
  'autre',
];
const ART_CATEGORIES = [
  'tableau',
  'peinture abstraite',
  'portrait',
  'paysage',
  'autre',
];

const emptyProduct = () => ({
  titre: '',
  description: '',
  prix: '',
  disponible: true,
  enVedette: false,
  images: [],
  tags: [],
  categorie_mobilier: '',
  categorie_art: '',
  matiere: '',
  technique: '',
  dimensions: '',
});

export default function AdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formRef, setFormRef] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct());
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

  // When editing, load product data into form
  useEffect(() => {
    if (editingId) {
      const product = products.find((p) => p._id === editingId);
      if (product) {
        setForm({
          titre: product.titre,
          description: product.description,
          prix: product.prix ?? '',
          disponible: product.disponible ?? true,
          enVedette: product.enVedette ?? false,
          images: product.images || [],
          tags: product.tags || [],
          categorie_mobilier: product.categorie_mobilier || '',
          categorie_art: product.categorie_art || '',
          matiere: product.matiere || '',
          technique: product.technique || '',
          dimensions: product.dimensions || '',
        });
        setImages(product.images || []);
      }
    }
  }, [editingId, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const formRefEl = formRef.current;
    if (formRefEl) {
      formRefEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

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
      prix,
      disponible: form.disponible,
      enVedette: form.enVedette,
      images,
      tags: form.tags || [],
      categorie_mobilier: form.categorie_mobilier ?? '',
      categorie_art: form.categorie_art ?? '',
      matiere: form.matiere ?? '',
      technique: form.technique ?? '',
      dimensions: form.dimensions ?? '',
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

  const resetForm = () => {
    setForm(emptyProduct());
    setEditingId(null);
    setImages([]);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    // Form will be populated via useEffect above
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await productsApi.remove(id);
    if (editingId === id) resetForm();
    load();
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    let newMobilier = '';
    let newArt = '';
    if (val) {
      if (MOBILIER_CATEGORIES.includes(val)) {
        newMobilier = val;
      } else if (ART_CATEGORIES.includes(val)) {
        newArt = val;
      }
    }
    setForm(prev => ({
      ...prev,
      categorie_mobilier: newMobilier,
      categorie_art: newArt,
    }));
  };

  return (
    <PageTransition>
      <AdminShell
        title="Produits"
        description={`Gérez le catalogue complet. Total : ${products.length} produit${products.length !== 1 ? 's' : ''}`}
      >
        {/* No atelier tabs */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="admin-card admin-card--spaced"
        >
          <h2 className="admin-card__title">
            {editingId ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          <p className="admin-card__desc -mt-2 mb-6">
            Remplissez chaque section ci-dessous.
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
            <legend className="admin-form-section__title">Catégorie</legend>
            <p className="admin-form-section__desc">
              Sélectionnez la catégorie du produit.
            </p>
            <div className="admin-form-grid">
              <label className="admin-field">
                <span className="admin-field__label">Catégorie</span>
                <select
                  value={form.categorie_mobilier || form.categorie_art || ''}
                  onChange={handleCategoryChange}
                  className="admin-field__input"
                >
                  <option value="">— Choisir une catégorie —</option>
                  {/* Mobilier categories */}
                  {MOBILIER_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                  {/* Art categories */}
                  {ART_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                <span className="admin-field__hint">Catégorie du produit.</span>
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
            <legend className="admin-form-section__title">Caractéristiques techniques</legend>
            <p className="admin-form-section__desc">
              Détails supplémentaires sur le produit (optionnels).
            </p>
            <div className="admin-form-grid">
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">Matière</span>
                <input
                  type="text"
                  value={form.matiere}
                  onChange={(e) => setForm({ ...form, matiere: e.target.value })}
                  placeholder="Ex. Teck massif, Iroko, Chêne…"
                  className="admin-field__input"
                />
                <span className="admin-field__hint">Matériau principal du produit.</span>
              </label>

              <label className="admin-field admin-field--full">
                <span className="admin-field__label">Technique</span>
                <input
                  type="text"
                  value={form.technique}
                  onChange={(e) => setForm({ ...form, technique: e.target.value })}
                  placeholder="Ex. Acrylique sur toile, Sculpture sur bois…"
                  className="admin-field__input"
                />
                <span className="admin-field__hint">Pour les œuvres d’art, indiquez la technique utilisée.</span>
              </label>

              <label className="admin-field admin-field--full">
                <span className="admin-field__label">Dimensions</span>
                <input
                  type="text"
                  value={form.dimensions}
                  onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                  placeholder="Ex. 60 x 80 cm, 200 x 100 x 75 cm…"
                  className="admin-field__input"
                />
                <span className="admin-field__hint">Largeur × Hauteur × Profondeur (si applicable).</span>
              </label>
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
            {products.length} produit{products.length !== 1 ? 's' : ''} — Tous les produits
          </h2>
          {products.length === 0 ? (
            <p className="admin-empty">Aucun produit dans le catalogue.</p>
          ) : (
            <ul className="admin-list">
              {products.map((p) => (
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