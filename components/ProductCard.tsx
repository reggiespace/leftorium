import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link 
      to={`/product/${product.slug || product.id}`}
      className="group block h-full shrink-0"
    >
      <Card className="overflow-hidden border-2 transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-xl group-hover:border-primary/50 flex flex-col h-full bg-card">
        <div className="aspect-[4/3] relative overflow-hidden shrink-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute top-4 left-4">
            <Badge variant={product.isReal ? "secondary" : "outline"} className="shadow-md">
              {product.isReal ? 'Real Product' : 'The Lab Edition'}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </CardTitle>
            <span className="text-primary font-black shrink-0">{product.price}</span>
          </div>
          <StarRating 
            productId={product.id}
            initialAvg={product.ratingAvg || 0}
            initialCount={product.ratingCount || 0}
            interactive={false}
          />
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-grow">
          <p className="text-muted-foreground text-sm line-clamp-2">
            {product.description}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0 mt-auto flex items-center text-primary font-bold text-sm gap-2">
          View Details
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
