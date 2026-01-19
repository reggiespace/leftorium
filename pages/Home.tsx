import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { ProductService } from '../services/productService';
import { Product } from '../types';

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ProductService.getFeatured()
      .then(data => {
        setFeatured(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Split Hero Section */}
      <section className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)] bg-white dark:bg-background-dark">
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-16 lg:px-20">
          <div className="max-w-xl">
            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Welcome to Leftorium</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tighter mb-8 text-slate-900 dark:text-white">
              The World is <span className="text-primary italic">Right-Handed.</span> We’re Here to Fix That.
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-12">
              Navigating a right-handed world has always required a little extra effort—until now. We’ve collected the best products designed specifically for left-handed ergonomics. Say goodbye to the smudged ink on your hand and the sawdust in your face. Welcome to a collection of tools that finally feel like they were made for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button className="w-full sm:w-auto min-w-[200px] h-14">
                  Browse Gear
                </Button>
              </Link>
              <Link to="/submit">
                <Button variant="outline" className="w-full sm:w-auto min-w-[200px] h-14">
                  The Idea Lab
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 bg-slate-100 dark:bg-[#151d2c] flex items-center justify-center p-8 lg:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
          <div className="relative z-10 w-full max-w-xl aspect-square rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
             <img 
               src="https://plus.unsplash.com/premium_photo-1679496828364-380f02ee5e0c?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
               alt="Left handed" 
               className="w-full h-full object-cover"
             />
             <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <p className="text-white text-lg italic font-medium">"Where the left hand finally feels right."</p>
             </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">How we make life 10% better</h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg mt-4 max-w-2xl mx-auto">
            Discover a world of products thoughtfully designed for left-handed individuals. Say goodbye to awkward tools and hello to comfort and efficiency.
          </p>
          <div className="w-20 h-1.5 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-500">Curating the best left-handed gear...</p>
          </div>
        ) : featured.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-12">
               <Link to="/products" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                  View All Southpaw Products
                  <span className="material-symbols-outlined">chevron_right</span>
               </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">inventory_2</span>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">The shelves are temporarily bare!</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              We're connecting to our warehouse (Strapi). If you're the store manager, make sure the backend is running and populated.
            </p>
            <Link to="/submit">
              <Button>Add the First Product</Button>
            </Link>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="bg-slate-100 dark:bg-[#151d2c] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-background-dark p-10 rounded-2xl text-center border border-slate-200 dark:border-slate-800">
               <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Global Population</p>
               <h3 className="text-primary text-5xl font-black">10%</h3>
               <p className="text-xs text-slate-500 mt-2">Under-represented & Proud</p>
            </div>
            <div className="bg-white dark:bg-background-dark p-10 rounded-2xl text-center border border-slate-200 dark:border-slate-800">
               <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Daily Struggles</p>
               <h3 className="text-primary text-5xl font-black">Infinite</h3>
               <p className="text-xs text-slate-500 mt-2">Smudged Ink & Spiral Bites</p>
            </div>
            <div className="bg-white dark:bg-background-dark p-10 rounded-2xl text-center border border-slate-200 dark:border-slate-800">
               <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Community</p>
               <h3 className="text-primary text-5xl font-black">800M+</h3>
               <p className="text-xs text-slate-500 mt-2">World-Wide Southpaws</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
