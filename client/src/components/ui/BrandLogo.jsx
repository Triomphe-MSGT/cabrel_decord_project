import { Link } from 'react-router-dom';

export const LOGO_SRC = '/assets/logo-cabrel.png';
export const BRAND_NAME = 'Cabrel Décor et Meubles';

const SIZES = {
  sm: { img: 40, name: 'text-sm' },
  md: { img: 48, name: 'text-base' },
  lg: { img: 72, name: 'text-lg' },
  xl: { img: 96, name: 'text-xl' },
};

export default function BrandLogo({
  size = 'md',
  showName = false,
  className = '',
  linkTo,
  onDark = false,
}) {
  const { img, name } = SIZES[size] || SIZES.md;

  const content = (
    <>
      <span className={`brand-logo__mark${onDark ? ' brand-logo__mark--on-dark' : ''}`}>
        <img
          src={LOGO_SRC}
          alt={`CD&M — ${BRAND_NAME}`}
          width={img}
          height={img}
          className="brand-logo__img"
        />
      </span>
      {showName && (
        <span className={`brand-logo__name ${name}${onDark ? ' brand-logo__name--on-dark' : ''}`}>
          Cabrel Décor
        </span>
      )}
    </>
  );

  const classes = `brand-logo brand-logo--${size}${showName ? ' brand-logo--with-name' : ''} ${className}`.trim();

  if (linkTo) {
    return (
      <Link to={linkTo} className={classes} aria-label={`Accueil — ${BRAND_NAME}`}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
