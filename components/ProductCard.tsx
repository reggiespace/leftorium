import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link 
      to={`/product/${product.id}`}
      className="group bg-white dark:bg-[#1a2335] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
    >
      <div className="aspect-[4/3] relative overflow-hidden shrink-0">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className={`absolute top-4 left-4 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-lg ${product.isReal ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'}`}>
          {product.isReal ? 'Real' : 'Fake'}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
          <span className="text-primary font-black shrink-0 ml-2">{product.price}</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 flex-grow">{product.description}</p>
        <div className="mt-auto flex items-center text-primary font-bold text-sm gap-2">
          View Details
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
