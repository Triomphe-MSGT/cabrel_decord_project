import SearchBar from '../ui/SearchBar';

export default function Hero() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-cabrel-wood/10 to-cabrel-cream">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="font-serif text-4xl md:text-5xl text-cabrel-dark mb-4">
          Mobilier artisanal &amp; Art décoratif
        </h1>
        <p className="text-lg text-cabrel-dark/70 mb-8">
          Découvrez nos créations uniques, façonnées avec soin dans nos ateliers.
        </p>
        <SearchBar className="max-w-xl mx-auto" />
      </div>
    </section>
  );
}
