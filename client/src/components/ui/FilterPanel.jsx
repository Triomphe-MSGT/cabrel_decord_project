import { RotateCcw } from 'lucide-react';
import { ATELIER_CONFIG } from '../../config/ateliers';
import PriceRange from './PriceRange';

export default function FilterPanel({
  atelier,
  filters,
  setFilter,
  resetFilters,
  activeFilterCount = 0,
  onApply,
}) {
  const { categories } = ATELIER_CONFIG[atelier];

  return (
    <div className="filter-panel">
      <div className="filter-panel__section">
        <p className="filter-panel__label">Catégorie</p>
        <div className="filter-panel__pills">
          <button
            type="button"
            className={`filter-panel__pill${!filters.categorie ? ' filter-panel__pill--active' : ''}`}
            onClick={() => setFilter('categorie', '')}
          >
            Toutes
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`filter-panel__pill${filters.categorie === c ? ' filter-panel__pill--active' : ''}`}
              onClick={() => setFilter('categorie', c)}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-panel__section">
        <PriceRange
          prixMin={filters.prixMin}
          prixMax={filters.prixMax}
          onChangeMin={(v) => setFilter('prixMin', v)}
          onChangeMax={(v) => setFilter('prixMax', v)}
        />
      </div>

      <div className="filter-panel__section">
        <p className="filter-panel__label">Disponibilité</p>
        <div className="filter-panel__pills">
          {[
            { value: '', label: 'Tous' },
            { value: 'true', label: 'Disponible' },
            { value: 'false', label: 'Indisponible' },
          ].map(({ value, label }) => (
            <button
              key={value || 'all'}
              type="button"
              className={`filter-panel__pill${filters.disponible === value ? ' filter-panel__pill--active' : ''}`}
              onClick={() => setFilter('disponible', value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-panel__footer">
        {activeFilterCount > 0 && (
          <button type="button" className="filter-panel__reset" onClick={resetFilters}>
            <RotateCcw size={15} />
            Réinitialiser
          </button>
        )}
        {onApply && (
          <button type="button" className="filter-panel__apply lg:hidden" onClick={onApply}>
            Voir les résultats
          </button>
        )}
      </div>
    </div>
  );
}
