import React, { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useLikes } from '../lib/useLikes';
import { ProductService } from '../services/productService';
import { Product } from '../types';

type Filter = 'all' | 'real' | 'fake';
type Sort = 'views' | 'likes' | 'name';

const SEG_BASE = 'cursor-pointer select-none px-3.5 py-1.5 text-[13px] transition-colors';

const SegButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({
  active,
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    className={`${SEG_BASE} ${active ? 'text-primary shadow-[inset_0_0_0_1px_var(--primary)]' : 'text-ink-dim'}`}
  >
    {children}
  </button>
);

const ProductList: React.FC = () => {
  const [all, setAll] = useState<Product[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('views');
  const { displayLikes } = useLikes();

  useEffect(() => {
    ProductService.getAll().then(setAll);
  }, []);

  const filtered = useMemo(
    () => all.filter((p) => filter === 'all' || (filter === 'real') === p.isReal),
    [all, filter]
  );

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      if (sort === 'likes') return displayLikes(b.id, b.likesSeed) - displayLikes(a.id, a.likesSeed);
      if (sort === 'name') return a.name.localeCompare(b.name);
      return b.viewsSeed - a.viewsSeed;
    });
    return list;
  }, [filtered, sort, displayLikes]);

  const resultLabel = `${sorted.length} of ${all.length} tools — ${all.filter((p) => p.isReal).length} you can actually buy, ${
    all.filter((p) => !p.isReal).length
  } we invented.`;

  return (
    <div className="px-5 md:px-10 pt-[52px] pb-20 max-w-[1320px] mx-auto">
      <h1 className="mb-2 text-4xl md:text-[42px] font-medium tracking-[-0.025em]">The catalogue</h1>
      <p className="mb-[30px] text-[15px] text-ink-faint">{resultLabel}</p>

      <div className="flex flex-wrap gap-5 items-center pb-[18px] mb-[26px] border-b border-border">
        <div className="flex items-center gap-2.5">
          <span className="font-mono-tag text-[10px] tracking-[0.12em] uppercase text-ink-faint">Kind</span>
          <div className="inline-flex border border-border rounded-lg overflow-hidden">
            <SegButton active={filter === 'all'} onClick={() => setFilter('all')}>
              Everything
            </SegButton>
            <SegButton active={filter === 'real'} onClick={() => setFilter('real')}>
              Real
            </SegButton>
            <SegButton active={filter === 'fake'} onClick={() => setFilter('fake')}>
              Invented
            </SegButton>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="font-mono-tag text-[10px] tracking-[0.12em] uppercase text-ink-faint">Sort</span>
          <div className="inline-flex border border-border rounded-lg overflow-hidden">
            <SegButton active={sort === 'views'} onClick={() => setSort('views')}>
              Most viewed
            </SegButton>
            <SegButton active={sort === 'likes'} onClick={() => setSort('likes')}>
              Most liked
            </SegButton>
            <SegButton active={sort === 'name'} onClick={() => setSort('name')}>
              A–Z
            </SegButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
