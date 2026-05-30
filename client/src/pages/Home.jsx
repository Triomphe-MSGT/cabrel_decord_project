import Hero from '../components/home/Hero';
import AtelierPreview from '../components/home/AtelierPreview';
import FeaturedItems from '../components/home/FeaturedItems';
import PageTransition from '../components/layout/PageTransition';

export default function Home() {
  return (
    <PageTransition>
      <div className="hero-lead">
        <Hero />
      </div>
      <AtelierPreview />
      <FeaturedItems />
    </PageTransition>
  );
}
