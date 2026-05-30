import { resolveMediaUrl } from '../../utils/mediaUrl';

export default function ProductImageHover({ images = [], alt = '', aspect = '4/3' }) {
  const primary = resolveMediaUrl(images[0]);
  const secondary = resolveMediaUrl(images[1]);
  const hasAlternate = Boolean(primary && secondary && secondary !== primary);
  const extraCount = Math.max(0, images.length - 1);

  if (!primary) {
    return (
      <div className={`product-image-hover product-image-hover--${aspect.replace('/', '-')}`}>
        <div className="product-image-hover__empty">Aucune image</div>
      </div>
    );
  }

  return (
    <div className={`product-image-hover product-image-hover--${aspect.replace('/', '-')}`}>
      <img
        src={primary}
        alt={alt}
        className="product-image-hover__img product-image-hover__primary"
        loading="lazy"
      />
      {hasAlternate && (
        <img
          src={secondary}
          alt=""
          aria-hidden
          className="product-image-hover__img product-image-hover__secondary"
          loading="lazy"
        />
      )}
      {extraCount > 0 && (
        <span className="product-image-hover__hint">
          {hasAlternate ? 'Vue en situation' : `+${extraCount} photo${extraCount > 1 ? 's' : ''}`}
        </span>
      )}
    </div>
  );
}
