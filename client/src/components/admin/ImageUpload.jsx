import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadApi } from '../../services/api';
import { resolveMediaUrl } from '../../utils/mediaUrl';

export default function ImageUpload({
  value,
  onChange,
  folder = 'misc',
  label = 'Image',
  required = false,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const { data } = await uploadApi.upload(file, folder);
      onChange(data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Échec du téléversement');
    } finally {
      setUploading(false);
    }
  };

  const preview = resolveMediaUrl(value);

  return (
    <div className="admin-image-upload">
      <span className="admin-field__label">
        {label}
        {required && ' *'}
      </span>
      <div className="admin-image-upload__box">
        {preview ? (
          <div className="admin-image-upload__preview">
            <img src={preview} alt="" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="admin-image-upload__remove"
              aria-label="Retirer l'image"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="admin-image-upload__picker"
          >
            {uploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Envoi en cours…
              </>
            ) : (
              <>
                <Upload size={20} />
                Choisir une image
              </>
            )}
          </button>
        )}
        {preview && !uploading && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="admin-btn admin-btn--ghost admin-btn--sm mt-2"
          >
            Remplacer
          </button>
        )}
      </div>
      {error && <p className="admin-login__error mt-1 text-xs">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        className="sr-only"
      />
    </div>
  );
}
