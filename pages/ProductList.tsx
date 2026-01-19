import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { ProductService } from '../services/productService';
import { Category, Product } from '../types';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<'all' | 'real' | 'fake'>('all');
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    ProductService.getAll().then(setProducts);
  }, []);

  const categories = ['all', ...Object.values(Category)];

  const filteredProducts = products.filter(p => {
    const filterMatch = filter === 'all' || (filter === 'real' ? p.isReal : !p.isReal);
    const categoryMatch = category === 'all' || p.category === category;
    return filterMatch && categoryMatch;
  });

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">search_off</span>
          <p className="text-slate-500 font-bold">No products found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
