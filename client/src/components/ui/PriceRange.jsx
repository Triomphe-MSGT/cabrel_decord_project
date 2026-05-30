export default function PriceRange({ prixMin, prixMax, onChangeMin, onChangeMax }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1">Prix (FCFA)</label>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min"
          value={prixMin}
          onChange={(e) => onChangeMin(e.target.value)}
          className="w-full border border-cabrel-wood/30 rounded-lg px-3 py-2 text-sm"
          min={0}
        />
        <input
          type="number"
          placeholder="Max"
          value={prixMax}
          onChange={(e) => onChangeMax(e.target.value)}
          className="w-full border border-cabrel-wood/30 rounded-lg px-3 py-2 text-sm"
          min={0}
        />
      </div>
    </div>
  );
}
