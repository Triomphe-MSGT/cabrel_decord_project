import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function SearchBar({ defaultValue = '', className = '' }) {
  const [q, setQ] = useState(defaultValue);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cabrel-dark/40" size={18} />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher mobilier, art..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-cabrel-wood/30 bg-white focus:outline-none focus:ring-2 focus:ring-cabrel-wood/40"
        />
      </div>
      <button
        type="submit"
        className="px-5 py-3 bg-cabrel-wood text-white rounded-lg hover:opacity-90 transition-opacity"
      >
        Rechercher
      </button>
    </form>
  );
}
