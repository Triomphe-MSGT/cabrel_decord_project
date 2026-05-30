import { useState } from 'react';
import { commentsApi } from '../../services/api';

export default function CommentForm({ produitId, onSubmitted }) {
  const [auteur, setAuteur] = useState('');
  const [contenu, setContenu] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await commentsApi.create({
        produit: produitId,
        auteur,
        contenu,
        ...(note ? { note: Number(note) } : {}),
      });
      setSuccess(true);
      setAuteur('');
      setContenu('');
      setNote('');
      onSubmitted?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <p className="text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">
        Votre commentaire est en attente de validation.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold">Laisser un commentaire</h3>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input
        type="text"
        placeholder="Votre nom"
        value={auteur}
        onChange={(e) => setAuteur(e.target.value)}
        required
        maxLength={60}
        className="w-full border border-cabrel-wood/30 rounded-lg px-3 py-2"
      />
      <textarea
        placeholder="Votre message"
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        required
        maxLength={500}
        rows={4}
        className="w-full border border-cabrel-wood/30 rounded-lg px-3 py-2"
      />
      <select
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full border border-cabrel-wood/30 rounded-lg px-3 py-2"
      >
        <option value="">Note (optionnel)</option>
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2 bg-cabrel-wood text-white rounded-lg hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  );
}
