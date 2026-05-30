import { X } from 'lucide-react';
import { SORT_OPTIONS, DISPONIBILITE_OPTIONS } from '../../config/ateliers';
import { formatPrice } from '../../utils/formatPrice';

const sortLabel = (value) => SORT_OPTIONS.find((o) => o.value === value)?.label;
const dispoLabel = (value) => DISPONIBILITE_OPTIONS.find((o) => o.value === value)?.label;

export default function ActiveFilters({ filters, setFilter, resetFilters }) {
  const chips = [];

  if (filters.categorie) {
    chips.push({ key: 'categorie', label: filters.categorie, onRemove: () => setFilter('categorie', '') });
  }
  if (filters.prixMin) {
    chips.push({
      key: 'prixMin',
      label: `Min ${formatPrice(Number(filters.prixMin))}`,
      onRemove: () => setFilter('prixMin', ''),
    });
  }
  if (filters.prixMax) {
    chips.push({
      key: 'prixMax',
      label: `Max ${formatPrice(Number(filters.prixMax))}`,
      onRemove: () => setFilter('prixMax', ''),
    });
  }
  if (filters.disponible) {
    chips.push({
      key: 'disponible',
      label: dispoLabel(filters.disponible),
      onRemove: () => setFilter('disponible', ''),
    });
  }
  if (filters.sort && filters.sort !== 'recent') {
    chips.push({
      key: 'sort',
      label: sortLabel(filters.sort),
      onRemove: () => setFilter('sort', 'recent'),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="atelier-chips" aria-label="Filtres actifs">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          className="atelier-chip"
          onClick={chip.onRemove}
        >
          {chip.label}
          <X size={14} aria-hidden />
        </button>
      ))}
      <button type="button" className="atelier-chips__clear" onClick={resetFilters}>
        Tout effacer
      </button>
    </div>
  );
}
