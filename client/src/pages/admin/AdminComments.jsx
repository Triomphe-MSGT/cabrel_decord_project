import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { commentsApi } from '../../services/api';
import PageTransition from '../../components/layout/PageTransition';

export default function AdminComments() {
  const [comments, setComments] = useState([]);

  const load = () => {
    commentsApi.getPending().then(({ data }) => setComments(data));
  };

  useEffect(() => {
    load();
  }, []);

  const handleValidate = async (id) => {
    await commentsApi.validate(id);
    load();
  };

  const handleReject = async (id) => {
    if (!confirm('Rejeter ce commentaire ?')) return;
    await commentsApi.remove(id);
    load();
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link to="/admin/dashboard" className="text-sm text-cabrel-wood hover:underline mb-4 inline-block">
          ← Dashboard
        </Link>
        <h1 className="font-serif text-3xl mb-8">Commentaires en attente</h1>

        {comments.length === 0 && (
          <p className="opacity-60">Aucun commentaire en attente.</p>
        )}

        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c._id} className="bg-white p-4 rounded-xl border border-cabrel-wood/10">
              <p className="font-medium">{c.auteur}</p>
              <p className="text-sm text-cabrel-wood">
                Produit : {c.produit?.titre || c.produit}
              </p>
              <p className="mt-2">{c.contenu}</p>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => handleValidate(c._id)}
                  className="px-4 py-1 bg-green-600 text-white text-sm rounded-lg"
                >
                  Valider
                </button>
                <button
                  type="button"
                  onClick={() => handleReject(c._id)}
                  className="px-4 py-1 bg-red-600 text-white text-sm rounded-lg"
                >
                  Rejeter
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PageTransition>
  );
}
