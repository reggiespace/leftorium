import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import { ImgPlaceholder } from '../components/ImgPlaceholder';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCount, Tag } from '../components/Tag';
import { useLikes } from '../lib/useLikes';
import { ProductService } from '../services/productService';
import { Product } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { isLiked, toggleLike, displayLikes } = useLikes();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    ProductService.getById(id).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!product) {
    return (
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 py-20 text-center">
        <h2 className="text-3xl font-medium mb-4">Product not found</h2>
        <Link to="/products" className="text-primary">
          ← Back to the catalogue
        </Link>
      </div>
    );
  }

  const liked = isLiked(product.id);
  const likeCount = displayLikes(product.id, product.likesSeed);

  return (
    <div className="px-5 md:px-10 pt-[34px] pb-20 max-w-[1180px] mx-auto">
      <Link to="/products" className="inline-flex mb-[26px] text-[13px] text-primary">
        ← Back to the catalogue
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <figure className="m-0 lg:sticky lg:top-[98px]">
          <ImgPlaceholder label={product.imgLabel} src={product.imageUrl} aspect="aspect-square" />
          <figcaption className="mt-2 text-[11px] text-ink-faint">
            {product.isReal ? 'Real product. Photograph to be sourced from the maker.' : 'Invented product. Image to be generated.'}
          </figcaption>
        </figure>

        <div>
          <div className="flex items-center gap-3 mb-3.5">
            <span className="font-mono-tag text-[10px] tracking-[0.12em] uppercase text-ink-faint">
              {product.category}
            </span>
            <Tag isReal={product.isReal} />
          </div>
          <h1 className="mb-3 text-4xl md:text-[40px] font-medium tracking-[-0.025em] leading-[1.06]">
            {product.name}
          </h1>
          <p className="mb-[22px] text-base text-ink-dim text-pretty">{product.longDescription}</p>

          <div className="flex gap-3 flex-wrap mb-[26px]">
            <button
              onClick={() => toggleLike(product.id)}
              className="inline-flex items-center px-[18px] py-2.5 rounded-lg text-[15px] font-medium border transition-colors"
              style={
                liked
                  ? { borderColor: 'var(--primary)', background: 'rgba(145,132,217,.14)', color: 'var(--primary-hover)' }
                  : { borderColor: 'var(--primary)', color: 'var(--primary)' }
              }
            >
              {liked ? `♥ Liked · ${formatCount(likeCount)}` : `♥ Like · ${formatCount(product.likesSeed)}`}
            </button>
            <span className="inline-flex items-center px-4 py-2.5 border border-border rounded-lg font-mono-tag text-xs tracking-[0.08em] text-ink-mute">
              ◍ {formatCount(product.viewsSeed)} views
            </span>
            <span className="inline-flex items-center px-4 py-2.5 border border-border rounded-lg font-mono-tag text-xs tracking-[0.08em] text-ink-mute">
              {product.price}
            </span>
          </div>

          <div className="border-t border-border pt-[22px] mb-[26px]">
            <p className="mb-3 font-mono-tag text-[10px] tracking-[0.14em] uppercase text-ink-faint">
              What makes it left
            </p>
            <ul className="flex flex-col gap-2.5">
              {product.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-[14.5px] text-ink-dim">
                  <span className="text-primary">—</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-[14px] px-5 py-[18px] mb-[34px]">
            <p className="mb-2 font-mono-tag text-[10px] tracking-[0.14em] uppercase text-primary">
              The right-handed version costs a lefty
            </p>
            <p className="text-[14.5px] text-ink-dim text-pretty">{product.cost}</p>
          </div>

          <CommentsSection productId={product.id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
