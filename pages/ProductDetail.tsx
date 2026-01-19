import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import { MOCK_COMMENTS } from '../mockData';
import { ProductService } from '../services/productService';
import { Comment, Product } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      ProductService.getById(id).then(p => {
        setProduct(p);
        setComments(MOCK_COMMENTS.filter(c => c.productId === id));
        setLoading(false);
      });
      ProductService.getRelated(id).then(setRelatedProducts);
    }
  }, [id]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !product) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      productId: product.id,
      userName: 'Current Southpaw',
      userAvatar: 'https://picsum.photos/seed/user/100/100',
      content: newComment,
      timestamp: 'Just now',
      likes: 0
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <Link to="/products" className="text-primary font-bold hover:underline">Return to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <nav className="flex items-center gap-2 mb-8 text-sm font-medium">
        <Link to="/products" className="text-slate-500 hover:text-primary transition-colors">Catalog</Link>
        <span className="text-slate-300">/</span>
        <span className="text-primary font-bold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content: Right on Desktop (order-2), Top on Mobile (order-1) */}
        <div className="lg:col-span-8 space-y-10 order-1 lg:order-2">
          <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6 flex gap-3">
              <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl text-white ${product.isReal ? 'bg-green-500' : 'bg-primary'}`}>
                {product.isReal ? 'Real Product' : 'Lab Prototype'}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
               <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">{product.name}</h1>
                 <p className="text-primary font-bold text-sm uppercase tracking-widest">{product.category}</p>
               </div>
               <Button className="flex items-center gap-2">
                  <span className="material-symbols-outlined">share</span>
                  Share Struggle
               </Button>
            </div>

            <div className="prose dark:prose-invert max-w-none">
               <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-300 italic mb-8">
                 "{product.description}"
               </p>
               <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                 {product.longDescription || "This specialized tool was designed with the biomechanics of left-handed rotation and grip in mind. It addresses the common frustrations that southpaws face in a world dominated by right-handed defaults."}
               </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6">
              {product.features.map(f => (
                <div key={f} className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="material-symbols-outlined text-primary mb-2">check_circle</span>
                  <p className="font-bold text-sm">{f}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <section className="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-8">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-black">The Southpaw Forum</h3>
              <span className="bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-500">{comments.length} Comments</span>
            </div>

            <form onSubmit={handleSubmitComment} className="bg-white dark:bg-background-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Input 
                multiline
                placeholder="Share your experience or join the debate..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="flex justify-end mt-4">
                <Button type="submit">
                  Post Comment
                </Button>
              </div>
            </form>

            <div className="space-y-6">
              {comments.map(c => (
                <div key={c.id} className="flex gap-4">
                   <div className="size-10 rounded-full bg-slate-200 overflow-hidden shrink-0 ring-2 ring-primary/10">
                      <img src={c.userAvatar} alt={c.userName} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-sm">{c.userName}</span>
                         <span className="text-xs text-slate-400">{c.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {c.content}
                      </p>
                      <div className="flex items-center gap-4">
                         <button className="flex items-center gap-1 text-primary hover:text-primary/70">
                            <span className="material-symbols-outlined text-sm">thumb_up</span>
                            <span className="text-xs font-bold">{c.likes}</span>
                         </button>
                         <button className="text-xs font-bold text-slate-400 hover:underline">Reply</button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: Left on Desktop (order-1), Bottom on Mobile (order-2) */}
        <aside className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="bg-white dark:bg-background-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 sticky top-24">
             <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
               <span className="material-symbols-outlined text-primary">shopping_basket</span>
               Related Gear
             </h4>
             <div className="space-y-6">
                {relatedProducts.map(p => (
                  <Link key={p.id} to={`/product/${p.id}`} className="group flex gap-4 items-center">
                    <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <p className="text-sm font-bold group-hover:text-primary transition-colors">{p.name}</p>
                      <p className="text-xs text-slate-500 font-bold">{p.price}</p>
                    </div>
                  </Link>
                ))}
             </div>
             <hr className="my-6 border-slate-200 dark:border-slate-800" />
             <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
               <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">Southpaw Secret</p>
               <p className="text-sm text-slate-600 dark:text-slate-400">Did you know? Leonardo da Vinci wrote his journals from right to left in mirror-image to avoid ink smudges.</p>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProductDetail;
