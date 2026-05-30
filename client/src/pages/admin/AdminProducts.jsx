import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import PageTransition from '../../components/layout/PageTransition';

const emptyProduct = {
  titre: '',
  description: '',
  atelier: 'mobilier',
  prix: 0,
  disponible: true,
  enVedette: false,
  images: [],
  tags: [],
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [imagesInput, setImagesInput] = useState('');

  const load = () => {
    productsApi.getAll({ limit: 100 }).then(({ data }) => {
      setProducts(data.products || data);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      prix: Number(form.prix),
      images: imagesInput.split('\n').map((s) => s.trim()).filter(Boolean),
    };
    if (editingId) {
      await productsApi.update(editingId, payload);
    } else {
      await productsApi.create(payload);
    }
    setForm(emptyProduct);
    setEditingId(null);
    setImagesInput('');
    load();
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({ ...p });
    setImagesInput((p.images || []).join('\n'));
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await productsApi.remove(id);
    load();
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link to="/admin/dashboard" className="text-sm text-cabrel-wood hover:underline mb-4 inline-block">
          ← Dashboard
        </Link>
        <h1 className="font-serif text-3xl mb-8">Produits</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-cabrel-wood/10 mb-10 space-y-4">
          <h2 className="font-semibold">{editingId ? 'Modifier' : 'Ajouter'} un produit</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              placeholder="Titre"
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              required
              className="border rounded-lg px-3 py-2"
            />
            <select
              value={form.atelier}
              onChange={(e) => setForm({ ...form, atelier: e.target.value })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="mobilier">Mobilier</option>
              <option value="art">Art</option>
            </select>
            <input
              type="number"
              placeholder="Prix"
              value={form.prix}
              onChange={(e) => setForm({ ...form, prix: e.target.value })}
              required
              className="border rounded-lg px-3 py-2"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.enVedette}
                onChange={(e) => setForm({ ...form, enVedette: e.target.checked })}
              />
              En vedette
            </label>
          </div>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={3}
            className="w-full border rounded-lg px-3 py-2"
          />
          <textarea
            placeholder="URLs images (une par ligne)"
            value={imagesInput}
            onChange={(e) => setImagesInput(e.target.value)}
            rows={2}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <button type="submit" className="px-5 py-2 bg-cabrel-wood text-white rounded-lg">
            {editingId ? 'Mettre à jour' : 'Créer'}
          </button>
        </form>

        <ul className="space-y-3">
          {products.map((p) => (
            <li key={p._id} className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div>
                <p className="font-medium">{p.titre}</p>
                <p className="text-sm opacity-70">{p.atelier} — {formatPrice(p.prix)}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => handleEdit(p)} className="text-sm text-cabrel-wood">
                  Modifier
                </button>
                <button type="button" onClick={() => handleDelete(p._id)} className="text-sm text-red-600">
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PageTransition>
  );
}
