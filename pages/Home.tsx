import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { ProductService } from '../services/productService';
import { Product } from '../types';

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    ProductService.getFeatured().then(setFeatured);
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
              Leftorium was born out of a simple, persistent frustration. In a world optimized for the right-handed majority, southpaws live in a state of constant, low-level friction. From smudged ink to power tools that blow sawdust directly into our faces, the 'Right-Handed Default' is everywhere.
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
               src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800" 
               alt="Left handed scissors" 
               className="w-full h-full object-cover"
             />
             <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <p className="text-white text-lg italic font-medium">"Finally, a world that isn't backwards."</p>
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
