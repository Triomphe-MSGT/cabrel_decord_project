import { Link } from 'react-router-dom';
import { Armchair, Palette } from 'lucide-react';

const ateliers = [
  {
    to: '/mobilier',
    title: 'Atelier Mobilier',
    description: 'Tables, chaises, armoires et pièces sur mesure en bois noble.',
    icon: Armchair,
  },
  {
    to: '/art',
    title: 'Atelier Art',
    description: 'Tableaux, portraits et œuvres originales pour sublimer vos espaces.',
    icon: Palette,
  },
];

export default function AtelierPreview() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="font-serif text-2xl text-center mb-10">Nos ateliers</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {ateliers.map(({ to, title, description, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group p-8 bg-white rounded-xl border border-cabrel-wood/10 hover:border-cabrel-wood/40 hover:shadow-md transition-all"
          >
            <Icon className="text-cabrel-wood mb-4" size={40} />
            <h3 className="font-serif text-xl mb-2 group-hover:text-cabrel-wood">{title}</h3>
            <p className="text-cabrel-dark/70">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
