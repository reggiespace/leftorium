import React from 'react';
import { Link } from 'react-router-dom';
import { useLikes } from '../lib/useLikes';
import { formatCount, Tag } from './Tag';
import { Product } from '../types';
import { ImgPlaceholder } from './ImgPlaceholder';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isLiked, toggleLike, displayLikes } = useLikes();
  const liked = isLiked(product.id);

  return (
    <article className="group bg-card border border-border rounded-[14px] overflow-hidden transition-all hover:border-ink-ghost hover:-translate-y-0.5">
      <Link to={`/product/${product.slug || product.id}`}>
        <ImgPlaceholder label={product.imgLabel} src={product.imageUrl} />
      </Link>
      <div className="p-4 pb-[18px]">
        <div className="flex items-center justify-between gap-2.5 mb-2">
          <span className="font-mono-tag text-[10px] tracking-[0.12em] uppercase text-ink-faint">
            {product.category}
          </span>
          <Tag isReal={product.isReal} />
        </div>
        <Link to={`/product/${product.slug || product.id}`}>
          <h3 className="mb-1.5 text-lg font-medium tracking-[-0.01em] hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mb-3.5 text-[13.5px] text-ink-mute text-pretty">{product.blurb}</p>
        <div className="flex items-center gap-3.5 font-mono-tag text-[11px] text-ink-faint">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleLike(product.id);
            }}
            className={`select-none transition-colors ${liked ? 'text-primary-hover' : 'text-ink-faint hover:text-ink-dim'}`}
          >
            ♥ {formatCount(displayLikes(product.id, product.likesSeed))}
          </button>
          <span>◍ {formatCount(product.viewsSeed)}</span>
          <span className="ml-auto text-ink-dim">{product.price}</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
