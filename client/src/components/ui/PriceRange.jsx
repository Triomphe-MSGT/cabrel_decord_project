import { formatPrice } from '../../utils/formatPrice';

export default function PriceRange({ prixMin, prixMax, onChangeMin, onChangeMax }) {
  return (
    <div>
      <p className="filter-panel__label">Budget (FCFA)</p>
      <div className="filter-panel__price">
        <input
          type="number"
          placeholder="Min"
          value={prixMin}
          onChange={(e) => onChangeMin(e.target.value)}
          className="filter-panel__input"
          min={0}
          aria-label="Prix minimum"
        />
        <span className="filter-panel__price-sep">—</span>
        <input
          type="number"
          placeholder="Max"
          value={prixMax}
          onChange={(e) => onChangeMax(e.target.value)}
          className="filter-panel__input"
          min={0}
          aria-label="Prix maximum"
        />
      </div>
      {(prixMin || prixMax) && (
        <p className="filter-panel__price-hint">
          {prixMin && prixMax
            ? `${formatPrice(Number(prixMin))} – ${formatPrice(Number(prixMax))}`
            : prixMin
              ? `À partir de ${formatPrice(Number(prixMin))}`
              : `Jusqu’à ${formatPrice(Number(prixMax))}`}
        </p>
      )}
    </div>
  );
}
