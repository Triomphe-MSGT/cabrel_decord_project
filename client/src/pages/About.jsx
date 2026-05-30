import PageTransition from '../components/layout/PageTransition';

export default function About() {
  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-cabrel-wood mb-3">Cabrel Décor</p>
        <h1 className="font-serif text-3xl md:text-4xl text-cabrel-dark mb-6">À propos</h1>
        <div className="space-y-4 text-cabrel-dark/70 leading-relaxed">
          <p>
            Cabrel Décor réunit deux ateliers complémentaires : mobilier artisanal en bois noble
            et art décoratif original. Chaque pièce est pensée pour sublimer votre intérieur.
          </p>
          <p>
            Du sur mesure à la pièce prête à emporter, nous accompagnons particuliers et
            professionnels à chaque étape de leur projet.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
