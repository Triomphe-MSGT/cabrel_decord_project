import { useParams } from 'react-router-dom';
import ProductDetailContent from './ProductDetailContent';

export default function MobilierDetail() {
  const { id } = useParams();
  return <ProductDetailContent id={id} atelier="mobilier" />;
}
