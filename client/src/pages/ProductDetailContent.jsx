import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { commentsApi } from '../services/api';
import { formatPrice } from '../utils/formatPrice';
import ImageGallery from '../components/ui/ImageGallery';
import ContactButtons from '../components/ui/ContactButtons';
import CommentList from '../components/ui/CommentList';
import CommentForm from '../components/ui/CommentForm';
import PageTransition from '../components/layout/PageTransition';

export default function ProductDetailContent({ id, atelier }) {
  const { product, loading, error } = useProduct(id);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const listPath = atelier === 'art' ? '/art' : '/mobilier';

  const loadComments = () => {
    if (!id) return;
    setCommentsLoading(true);
    commentsApi
      .getByProduct(id)
      .then(({ data }) => setComments(data))
      .finally(() => setCommentsLoading(false));
  };

  useEffect(() => {
    loadComments();
  }, [id]);

  if (loading) return <p className="text-center py-20 opacity-60">Chargement...</p>;
  if (error || !product) {
    return (
      <p className="text-center py-20 text-red-600">
        {error || 'Produit introuvable'}
      </p>
    );
  }

  const categorie =
    atelier === 'art' ? product.categorie_art : product.categorie_mobilier;

  return (
    <PageTransition>
      <div className="product-detail max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <Link to={listPath} className="text-sm text-cabrel-wood hover:underline mb-4 sm:mb-6 inline-block">
          ← Retour
        </Link>
        <div className="product-detail__layout">
          <ImageGallery images={product.images} title={product.titre} />
          <div className="product-detail__info">
            <p className="text-xs sm:text-sm uppercase text-cabrel-wood">{categorie}</p>
            <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl mt-1 leading-tight break-words">
              {product.titre}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-cabrel-wood font-semibold mt-3 sm:mt-4">
              {formatPrice(product.prix)}
            </p>
            <p className="mt-2 text-sm">
              {product.disponible ? (
                <span className="text-green-700">Disponible</span>
              ) : (
                <span className="text-red-600">Indisponible</span>
              )}
            </p>
            <p className="product-detail__description">{product.description}</p>
            {product.matiere && (
              <p className="mt-2 text-sm break-words">
                <strong>Matière :</strong> {product.matiere}
              </p>
            )}
            {product.technique && (
              <p className="mt-2 text-sm break-words">
                <strong>Technique :</strong> {product.technique}
              </p>
            )}
            {product.dimensions && (
              <p className="mt-2 text-sm break-words">
                <strong>Dimensions :</strong> {product.dimensions}
              </p>
            )}
            <div className="mt-6 sm:mt-8">
              <h2 className="font-semibold mb-3 text-base sm:text-lg">Nous contacter</h2>
              <ContactButtons produit={product} />
            </div>
          </div>
        </div>

        <section className="mt-10 sm:mt-16 max-w-2xl">
          <h2 className="font-serif text-xl mb-6">Commentaires</h2>
          <CommentList comments={comments} loading={commentsLoading} />
          <div className="mt-8">
            <CommentForm produitId={product._id} />
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
