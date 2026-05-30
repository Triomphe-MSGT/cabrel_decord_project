import { Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { uploadApi } from '../../services/api';
import { resolveMediaUrl } from '../../utils/mediaUrl';

export default function ImageListEditor({ images = [], onChange, folder = 'products' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const list = images.filter(Boolean);

  const remove = (index) => {
    onChange(list.filter((_, i) => i !== index));
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;

    setUploading(true);
    setError(null);
    try {
      const urls = [];
      for (const file of files) {
        const { data } = await uploadApi.upload(file, folder);
        urls.push(data.url);
      }
      onChange([...list, ...urls]);
    } catch (err) {
      setError(err.response?.data?.message || 'Échec du téléversement');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-image-list">
      <p className="admin-field__label">Images du produit</p>
      <p className="admin-card__desc mb-3">
        Téléversez vos photos — la première s&apos;affiche par défaut, la seconde au survol.
      </p>

      {list.length > 0 && (
        <ul className="admin-image-list__grid">
          {list.map((url, index) => (
            <li key={`${url}-${index}`} className="admin-image-list__card">
              <img src={resolveMediaUrl(url)} alt="" />
              <span className="admin-image-list__badge">{index + 1}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="admin-image-list__remove"
                aria-label="Supprimer l'image"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="admin-image-upload__picker admin-image-upload__picker--inline"
      >
        {uploading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Envoi en cours…
          </>
        ) : (
          <>
            <Plus size={18} />
            {list.length ? 'Ajouter des images' : 'Téléverser des images'}
          </>
        )}
      </button>

      {error && <p className="admin-login__error mt-2 text-xs">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleFiles}
        className="sr-only"
      />
    </div>
  );
}
