import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, SlidersHorizontal, X } from 'lucide-react';
import { ATELIER_CONFIG } from '../../config/ateliers';
import FilterPanel from '../ui/FilterPanel';
import Pagination from '../ui/Pagination';
import ActiveFilters from './ActiveFilters';
import ProductGridSkeleton from './ProductGridSkeleton';
import PageTransition from '../layout/PageTransition';

export default function AtelierLayout({
  atelier,
  CardComponent,
  products,
  loading,
  error,
  pagination,
  filters,
  setFilter,
  resetFilters,
  activeFilterCount,
  page,
  setPage,
  productsPerPage,
}) {
  const config = ATELIER_CONFIG[atelier];
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <PageTransition>
      <div className="atelier-page">
        <header className="atelier-hero">
          <img src={config.heroImage} alt="" className="atelier-hero__img" />
          <div className="atelier-hero__overlay" aria-hidden />
          <div className="atelier-hero__content">
            <span className="atelier-hero__kicker">{config.title}</span>
            <h1 className="atelier-hero__title">{config.headline}</h1>
            <p className="atelier-hero__desc">{config.description}</p>
            <Link to={config.crossLink.to} className="atelier-hero__link">
              {config.crossLink.label}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </header>

        <div className="atelier-body">
          <div className="atelier-body__inner">
            <div className="atelier-toolbar">
              <div className="atelier-toolbar__left">
                <p className="atelier-toolbar__count">
                  {loading ? (
                    'Chargement…'
                  ) : (
                    <>
                      <strong>{pagination.total}</strong>{' '}
                      {config.productLabel}
                      {pagination.total > 1 ? 's' : ''}
                      {pagination.pages > 1 && (
                        <span className="atelier-toolbar__page">
                          {' '}· page {pagination.page}/{pagination.pages}
                        </span>
                      )}
                    </>
                  )}
                </p>
                <p className="atelier-toolbar__hint">{config.hint}</p>
              </div>

              <div className="atelier-toolbar__actions">
                <label className="atelier-sort">
                  <span className="sr-only">Trier par</span>
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilter('sort', e.target.value)}
                    className="atelier-sort__select"
                    aria-label="Trier les produits"
                  >
                    <option value="recent">Plus récent</option>
                    <option value="prix_asc">Prix croissant</option>
                    <option value="prix_desc">Prix décroissant</option>
                  </select>
                </label>

                <button
                  type="button"
                  className="atelier-filters-toggle"
                  onClick={() => setFiltersOpen(true)}
                  aria-expanded={filtersOpen}
                >
                  <SlidersHorizontal size={16} />
                  Filtres
                  {activeFilterCount > 0 && (
                    <span className="atelier-filters-toggle__badge">{activeFilterCount}</span>
                  )}
                </button>
              </div>
            </div>

            <ActiveFilters
              filters={filters}
              setFilter={setFilter}
              resetFilters={resetFilters}
            />

            <div className="atelier-layout">
              <aside className={`atelier-sidebar${filtersOpen ? ' atelier-sidebar--open' : ''}`}>
                <div className="atelier-sidebar__head">
                  <h2 className="atelier-sidebar__title">Affiner la sélection</h2>
                  <button
                    type="button"
                    className="atelier-sidebar__close lg:hidden"
                    onClick={() => setFiltersOpen(false)}
                    aria-label="Fermer les filtres"
                  >
                    <X size={20} />
                  </button>
                </div>
                <FilterPanel
                  atelier={atelier}
                  filters={filters}
                  setFilter={setFilter}
                  resetFilters={resetFilters}
                  activeFilterCount={activeFilterCount}
                  onApply={() => setFiltersOpen(false)}
                />
              </aside>

              {filtersOpen && (
                <button
                  type="button"
                  className="atelier-sidebar-backdrop lg:hidden"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Fermer les filtres"
                />
              )}

              <main className="atelier-main">
                {error && (
                  <div className="atelier-alert atelier-alert--error">{error}</div>
                )}

                {loading && <ProductGridSkeleton atelier={atelier} />}

                {!loading && products.length > 0 && (
                  <div className={`atelier-grid${atelier === 'art' ? ' atelier-grid--art' : ''}`}>
                    {products.map((p) => (
                      <CardComponent key={p._id} product={p} />
                    ))}
                  </div>
                )}

                {!loading && products.length === 0 && !error && (
                  <div className="atelier-empty">
                    <p className="atelier-empty__title">{config.emptyTitle}</p>
                    <p className="atelier-empty__text">{config.emptyText}</p>
                    {activeFilterCount > 0 && (
                      <button type="button" onClick={resetFilters} className="atelier-empty__btn">
                        Réinitialiser les filtres
                      </button>
                    )}
                  </div>
                )}

                {!loading && products.length > 0 && (
                  <Pagination
                    page={pagination.page}
                    pages={pagination.pages}
                    total={pagination.total}
                    limit={productsPerPage}
                    onPageChange={setPage}
                    className="mt-10"
                  />
                )}
              </main>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
