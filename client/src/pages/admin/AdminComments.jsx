import { useEffect, useState } from 'react';
import { commentsApi } from '../../services/api';
import AdminShell from '../../components/admin/AdminShell';
import PageTransition from '../../components/layout/PageTransition';

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    commentsApi.getAdmin()
      .then(response => {
        // Log the full response for debugging
        console.log('AdminComments: API response received:', response);
        // Extract data from response (since interceptor returns full response object)
        const data = response.data;
        // Log the extracted data
        console.log('AdminComments: Extracted data:', data);
        console.log('AdminComments: Data type:', typeof data);
        console.log('AdminComments: Is data array?', Array.isArray(data));
        if (Array.isArray(data)) {
          console.log('AdminComments: Data length:', data.length);
          setComments(data);
          setError(null); // Clear any previous error
        } else {
          // Unexpected response format - log for debugging but treat as empty
          console.warn('Expected array of comments from API but received:', data);
          setComments([]);
          setError('Format de réponse inattendu du serveur. Veuillez contacter l\'administrateur si le problème persiste.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching comments:', err); // Debug log
        let errorMessage = 'Erreur lors du chargement des commentaires';
        if (err.response) {
          // Server responded with error status
          errorMessage += `: ${err.response.data?.message || err.response.statusText}`;
        } else if (err.request) {
          // Request made but no response received
          errorMessage += ': Aucune réponse du serveur. Vérifiez votre connexion.';
        } else {
          // Error in setting up the request
          errorMessage += `: ${err.message || 'Erreur inconnue'}`;
        }
        setComments([]); // Clear comments on error
        setError(errorMessage);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []); // Empty deps means run once on mount

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleValidate = async (id) => {
    if (!id) {
      setError('Impossible de valider ce commentaire : identifiant manquant');
      return;
    }
    try {
      await commentsApi.validate(id);
      setMessage('Commentaire validé avec succès.');
      load(); // Refresh comments list
    } catch (err) {
      let msg = 'Erreur lors de la validation du commentaire.';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.message) {
        msg = err.message;
      }
      setMessage(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError('Impossible de supprimer ce commentaire : identifiant manquant');
      return;
    }
    if (!confirm('Supprimer ce commentaire ?')) return;
    try {
      await commentsApi.remove(id);
      setMessage('Commentaire supprimé avec succès.');
      load(); // Refresh comments list
    } catch (err) {
      let msg = 'Erreur lors de la suppression du commentaire.';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.message) {
        msg = err.message;
      }
      setMessage(msg);
    }
  };

  return (
    <PageTransition>
      <AdminShell title="Commentaires" description="Gérez tous les commentaires (en attente et validés).">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button
              onClick={load}
              className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        )}
        {loading && <p className="opacity-60">Chargement des commentaires...</p>}
        {message && <p className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">{message}</p>}
        {!loading && comments.length === 0 && (
          <p className="opacity-60">
            Aucun commentaire trouvé.
            {window.location.pathname.includes('/cdm') && (
              <>
                <br />
                <span className="text-cabrel-wood">Vous pouvez ajouter des commentaires depuis la fiche produit.</span>
              </>
            )}
          </p>
        )}
        {!loading && comments.length > 0 && (
          <ul className="space-y-4">
            {comments.map((c, index) => {
              // Use _id as key if available and truthy, otherwise use fallback key
              const commentKey = c._id && c._id.toString().length > 0 ? c._id : `fallback-${index}`;
              if (!c._id || c._id.toString().length === 0) {
                console.warn(`Comment missing or empty _id, using fallback key: ${commentKey}`, c);
              }

              return (
                <li key={commentKey} className="bg-white p-4 rounded-xl border border-cabrel-wood/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{c.auteur || 'Auteur inconnu'}</p>
                      <p className="text-sm text-cabrel-wood">
                        Produit : {
                          c.produit && typeof c.produit === 'object' && c.produit.titre
                            ? c.produit.titre
                            : c.produit
                            ? String(c.produit)
                            : 'Produit inconnu'
                        }
                      </p>
                      <p className="mt-2">{c.contenu || 'Contenu non disponible'}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {c.valide ? (
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">Validé</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">En attente</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    {!c.valide && (
                      <button
                        type="button"
                        onClick={() => handleValidate(c._id)}
                        className="px-4 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                      >
                        Valider
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(c._id)}
                      className="px-4 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </AdminShell>
    </PageTransition>
  );
}