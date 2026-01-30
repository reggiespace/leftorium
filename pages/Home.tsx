import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Sparkles, Wand2 } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="space-y-20 pb-20 bg-background text-foreground">
      {/* Split Hero Section */}
      <section className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)] border-b">
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-16 lg:px-20 relative overflow-hidden">
          {/* Subtle pastel background accents */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>
          
          <div className="max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              <Sparkles className="h-3 w-3" />
              Welcome to Leftorium
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight tracking-tighter mb-8 italic">
              The World is <span className="text-primary not-italic underline decoration-accent decoration-4 underline-offset-8">Right-Handed.</span> We’re Here to Fix That.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12">
              Navigating a right-handed world has always required a little extra effort—until now. We’ve collected the best products designed specifically for left-handed ergonomics. Welcome to a collection of tools that finally feel like they were made for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg font-bold shadow-lg shadow-primary/20">
                  Browse Gear
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/submit">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg font-bold border-2">
                  The Idea Lab
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 bg-muted/30 flex items-center justify-center p-8 lg:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
          <div className="relative z-10 w-full max-w-xl aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-background">
             <img 
               src="https://plus.unsplash.com/premium_photo-1679496828364-380f02ee5e0c?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
               alt="Left handed" 
               className="w-full h-full object-cover"
             />
             <div className="absolute bottom-6 left-6 right-6 p-6 bg-background/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                <p className="text-foreground text-lg italic font-medium">"Where the left hand finally feels right."</p>
             </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">How we make life 10% better</h2>
            <p className="text-muted-foreground text-lg">
              Discover a world of products thoughtfully designed for left-handed individuals. No more awkward tools.
            </p>
          </div>
          <div className="h-1 lg:w-32 bg-accent rounded-full mb-2"></div>
        </div>

        {loading ? (
          <div className="text-center py-24 flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4"></div>
            <p className="text-muted-foreground font-medium">Curating the best left-handed gear...</p>
          </div>
        ) : featured.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-16">
               <Link to="/products">
                  <Button variant="link" size="lg" className="text-primary font-bold text-lg hover:no-underline group">
                    View All Southpaw Products
                    <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
               </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-muted/50 rounded-[3rem] border-4 border-dashed border-muted flex flex-col items-center">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Wand2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-black mb-2">The shelves are temporarily bare!</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-10">
              We're connecting to our warehouse. If you're the store manager, make sure the backend is running.
            </p>
            <Link to="/submit">
              <Button size="lg" className="rounded-full px-8">Add the First Product</Button>
            </Link>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="bg-primary/5 py-24 px-6 border-y border-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div className="relative group">
               <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative bg-background p-12 rounded-3xl text-center border-2 border-primary/10 shadow-sm transition-transform hover:-translate-y-2">
                  <p className="text-primary/60 text-sm font-bold uppercase tracking-widest mb-4">Global Population</p>
                  <h3 className="text-primary text-6xl font-black italic">10%</h3>
                  <div className="w-12 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
                  <p className="text-xs text-muted-foreground mt-4 font-bold">Under-represented & Proud</p>
               </div>
            </div>
            <div className="relative group">
               <div className="absolute inset-0 bg-accent/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative bg-background p-12 rounded-3xl text-center border-2 border-accent/10 shadow-sm transition-transform hover:-translate-y-2">
                  <p className="text-accent/60 text-sm font-bold uppercase tracking-widest mb-4">Daily Struggles</p>
                  <h3 className="text-primary text-6xl font-black italic">∞</h3>
                  <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
                  <p className="text-xs text-muted-foreground mt-4 font-bold">Smudged Ink & Spiral Bites</p>
               </div>
            </div>
            <div className="relative group">
               <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative bg-background p-12 rounded-3xl text-center border-2 border-primary/10 shadow-sm transition-transform hover:-translate-y-2">
                  <p className="text-primary/60 text-sm font-bold uppercase tracking-widest mb-4">Community</p>
                  <h3 className="text-primary text-6xl font-black italic">800M+</h3>
                  <div className="w-12 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
                  <p className="text-xs text-muted-foreground mt-4 font-bold">World-Wide Southpaws</p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
