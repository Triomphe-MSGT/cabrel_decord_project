import { Star } from 'lucide-react';

export default function CommentList({ comments, loading }) {
  if (loading) return <p className="text-sm opacity-60">Chargement des commentaires...</p>;
  if (!comments?.length) {
    return <p className="text-sm opacity-60">Aucun commentaire pour le moment.</p>;
  }

  return (
    <ul className="space-y-4">
      {comments.map((c) => (
        <li key={c._id} className="bg-white rounded-lg p-4 border border-cabrel-wood/10">
          <div className="flex items-center justify-between">
            <span className="font-medium">{c.auteur}</span>
            {c.note && (
              <span className="flex items-center gap-0.5 text-cabrel-wood text-sm">
                {Array.from({ length: c.note }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </span>
            )}
          </div>
          <p className="mt-2 text-cabrel-dark/80">{c.contenu}</p>
        </li>
      ))}
    </ul>
  );
}
