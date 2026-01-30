import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Info, Share2, ShoppingBag } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import { ProductService } from '../services/productService';
import { Product } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      setLoading(true);
      ProductService.getById(id).then(p => {
        setProduct(p);
        setLoading(false);
      });
      ProductService.getRelated(id).then(setRelatedProducts);
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <Link to="/products">
          <Button variant="link" className="text-primary font-bold text-lg">
            Return to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-background text-foreground">
      <nav className="flex items-center gap-2 mb-10 text-sm font-medium">
        <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">Catalog</Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
        <span className="text-primary font-bold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content: Right on Desktop (order-2), Top on Mobile (order-1) */}
        <div className="lg:col-span-8 space-y-12 order-1 lg:order-2">
          <div className="relative aspect-[16/10] bg-muted rounded-[2rem] overflow-hidden border-4 border-background shadow-xl">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6 flex gap-3">
              <Badge variant={product.isReal ? "secondary" : "default"} className="shadow-xl py-2 px-4 text-xs font-black uppercase tracking-widest">
                {product.isReal ? 'Real Product' : 'Lab Prototype'}
              </Badge>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="space-y-4">
                  <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1 font-bold tracking-widest uppercase text-[10px]">
                    {product.category}
                  </Badge>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight italic">{product.name}</h1>
                  <StarRating 
                    productId={product.id}
                    initialAvg={product.ratingAvg || 0}
                    initialCount={product.ratingCount || 0}
                    interactive={true}
                    userId={user?.id?.toString()}
                    leftoriumUserId={(user as any)?.leftoriumUserId}
                  />
                </div>
               <Button className="flex items-center gap-2 rounded-full px-6 h-12 shadow-lg shadow-primary/20">
                  <Share2 className="h-4 w-4" />
                  Share Struggle
               </Button>
            </div>

            <div className="prose dark:prose-invert max-w-none">
               <p className="text-2xl leading-relaxed text-muted-foreground italic mb-10 border-l-4 border-accent pl-6 py-2">
                 "{product.description}"
               </p>
               <p className="text-lg leading-relaxed text-foreground/80">
                 {product.longDescription || "This specialized tool was designed with the biomechanics of left-handed rotation and grip in mind. It addresses the common frustrations that southpaws face in a world dominated by right-handed defaults."}
               </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6">
              {product.features.map((f, i) => (
                <Card key={i} className="bg-muted/30 border-2 border-transparent hover:border-primary/20 hover:bg-background transition-all">
                  <CardHeader className="p-5">
                    <div className="p-2 w-fit rounded-xl bg-primary/10 text-primary mb-3">
                      <span className="material-symbols-outlined">{f.icon}</span>
                    </div>
                    <CardTitle className="text-sm font-bold">{f.text}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Comments */}
          <CommentsSection productId={product.id} />
        </div>

        {/* Sidebar: Left on Desktop (order-1), Bottom on Mobile (order-2) */}
        <aside className="lg:col-span-4 space-y-8 order-2 lg:order-1">
          <Card className="rounded-[2rem] border-4 shadow-lg sticky top-24 overflow-hidden">
             <CardHeader className="bg-primary/5 border-b p-6">
               <CardTitle className="text-xl font-black flex items-center gap-3 italic">
                 <ShoppingBag className="h-6 w-6 text-primary" />
                 Related Gear
               </CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-8">
                {relatedProducts.map(p => (
                  <Link key={p.id} to={`/product/${p.id}`} className="group flex gap-4 items-center">
                    <div className="size-20 bg-muted rounded-2xl overflow-hidden shrink-0 border-2 border-transparent group-hover:border-primary/20 transition-all shadow-sm">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black group-hover:text-primary transition-colors line-clamp-1">{p.name}</p>
                      <p className="text-xs text-primary font-bold mt-1 bg-primary/10 w-fit px-2 py-0.5 rounded-full">{p.price}</p>
                    </div>
                  </Link>
                ))}
                
                <div className="pt-4">
                  <div className="bg-accent/10 p-5 rounded-2xl border-2 border-accent/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Info className="h-12 w-12" />
                    </div>
                    <p className="text-[10px] font-black text-accent mb-2 uppercase tracking-widest">Southpaw Secret</p>
                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">Did you know? Leonardo da Vinci wrote his journals from right to left in mirror-image to avoid ink smudges.</p>
                  </div>
                </div>
             </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default ProductDetail;
