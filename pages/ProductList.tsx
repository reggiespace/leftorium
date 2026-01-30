import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CloudOff, Loader2, SearchX } from "lucide-react";
import React, { useCallback, useEffect, useState } from 'react';
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
    <div className="max-w-7xl mx-auto px-6 py-12 bg-background text-foreground min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="flex flex-wrap gap-2 order-2 md:order-1">
          <Button 
            variant={filter === 'all' ? "default" : "outline"} 
            onClick={() => setFilter('all')}
            className="rounded-full px-6 transition-all"
          >
            All
          </Button>
          <Button 
            variant={filter === 'real' ? "default" : "outline"} 
            onClick={() => setFilter('real')}
            className={`rounded-full px-6 transition-all ${filter === 'real' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''}`}
          >
            Real
          </Button>
          <Button 
            variant={filter === 'fake' ? "default" : "outline"} 
            onClick={() => setFilter('fake')}
            className={`rounded-full px-6 transition-all ${filter === 'fake' ? 'bg-accent text-accent-foreground hover:bg-accent/80' : ''}`}
          >
            Fictional
          </Button>
        </div>

        <div className="text-right order-1 md:order-2">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-3 italic">Product Catalog</h1>
          <p className="text-muted-foreground max-w-xl ml-auto text-lg leading-relaxed">
            A curated collection of tools designed specifically for the left-handed life.
          </p>
        </div>
      </div>

      <div className="flex gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={category === cat ? "default" : "outline"}
            className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${category === cat ? '' : 'hover:bg-muted'}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {loading && products.length === 0 ? (
         <div className="text-center py-20 flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
         </div>
      ) : error ? (
        <div className="text-center py-20 border-4 border-dashed rounded-[2rem] bg-muted/20 flex flex-col items-center">
           <CloudOff className="h-16 w-16 text-muted-foreground mb-4" />
           <h3 className="text-2xl font-black mb-2">No connection to inventory</h3>
           <p className="text-muted-foreground max-w-md mx-auto px-4">
             We couldn't load the products from Strapi. Please ensure your local server is running.
           </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 border-4 border-dashed rounded-[2rem] flex flex-col items-center">
              <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-bold text-xl">No products found matching your filters.</p>
            </div>
          ) : (
            hasMore && (
              <div className="mt-16 text-center">
                <Button 
                  onClick={handleLoadMore} 
                  disabled={loadingMore}
                  variant="outline"
                  size="lg"
                  className="px-16 h-14 font-black text-lg rounded-full border-2"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : 'Show More Products'}
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

