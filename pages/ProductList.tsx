import React, { useCallback, useEffect, useState } from 'react';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { ProductService } from '../services/productService';
import { Category, Product } from '../types';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState<'all' | 'real' | 'fake'>('all');
  const [category, setCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(false);

  const PAGE_SIZE = 8;

  const fetchProducts = useCallback(async (pageNum: number, isInitial: boolean = false) => {
    if (isInitial) {
      setLoading(true);
      setError(false);
    } else {
      setLoadingMore(true);
    }

    try {
      const isReal = filter === 'all' ? undefined : filter === 'real';
      const resp = await ProductService.getProducts({
        page: pageNum,
        pageSize: PAGE_SIZE,
        category: category,
        isReal
      });

      if (isInitial) {
        setProducts(resp.data);
      } else {
        setProducts(prev => [...prev, ...resp.data]);
      }
      
      setHasMore(resp.meta.pagination.page < resp.meta.pagination.pageCount);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      if (isInitial) setError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filter, category]);

  useEffect(() => {
    setPage(1);
    fetchProducts(1, true);
  }, [fetchProducts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  const categories = ['all', ...Object.values(Category)];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="flex flex-wrap gap-3 order-2 md:order-1">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-800'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('real')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'real' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-800'}`}
          >
            Real
          </button>
          <button 
            onClick={() => setFilter('fake')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'fake' ? 'bg-slate-600 text-white shadow-lg shadow-slate-600/30' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-800'}`}
          >
            Fictional
          </button>
        </div>

        <div className="text-right order-1 md:order-2">
          <h1 className="text-4xl font-black tracking-tight mb-3">Product Catalog</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl ml-auto">
            A curated collection of tools designed specifically for the left-handed life. Some are game-changers, others are just for awareness.
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && products.length === 0 ? (
         <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
         </div>
      ) : error ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-900/50">
           <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">cloud_off</span>
           <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No connection to inventory</h3>
           <p className="text-slate-500 max-w-md mx-auto">
             We couldn't load the products from Strapi. Please ensure your local server is running at {import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'}.
           </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">search_off</span>
              <p className="text-slate-500 font-bold">No products found matching your filters.</p>
            </div>
          ) : (
            hasMore && (
              <div className="mt-12 text-center">
                <Button 
                  onClick={handleLoadMore} 
                  disabled={loadingMore}
                  variant="outline"
                  size="lg"
                  className="px-12"
                >
                  {loadingMore ? 'Loading More...' : 'Show More Products'}
                </Button>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;

