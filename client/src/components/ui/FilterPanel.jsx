import PriceRange from './PriceRange';

const MOBILIER_CATEGORIES = ['table', 'chaise', 'armoire', 'lit', 'canapé', 'étagère', 'autre'];
const ART_CATEGORIES = ['tableau', 'peinture abstraite', 'portrait', 'paysage', 'autre'];

export default function FilterPanel({ atelier, filters, setFilter }) {
  const categories = atelier === 'art' ? ART_CATEGORIES : MOBILIER_CATEGORIES;

  return (
    <aside className="bg-white rounded-xl p-4 border border-cabrel-wood/10 space-y-4">
      <h3 className="font-semibold">Filtres</h3>

      <div>
        <label className="text-sm font-medium block mb-1">Catégorie</label>
        <select
          value={filters.categorie}
          onChange={(e) => setFilter('categorie', e.target.value)}
          className="w-full border border-cabrel-wood/30 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Toutes</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <PriceRange
        prixMin={filters.prixMin}
        prixMax={filters.prixMax}
        onChangeMin={(v) => setFilter('prixMin', v)}
        onChangeMax={(v) => setFilter('prixMax', v)}
      />

      <div>
        <label className="text-sm font-medium block mb-1">Disponibilité</label>
        <select
          value={filters.disponible}
          onChange={(e) => setFilter('disponible', e.target.value)}
          className="w-full border border-cabrel-wood/30 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Tous</option>
          <option value="true">Disponible</option>
          <option value="false">Indisponible</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Tri</label>
        <select
          value={filters.sort}
          onChange={(e) => setFilter('sort', e.target.value)}
          className="w-full border border-cabrel-wood/30 rounded-lg px-3 py-2 text-sm"
        >
          <option value="recent">Plus récent</option>
          <option value="prix_asc">Prix croissant</option>
          <option value="prix_desc">Prix décroissant</option>
        </select>
      </div>
    </aside>
  );
}
