import { MOCK_PRODUCTS } from '../mockData';
import { Product } from '../types';

export const ProductService = {
  getAll: (): Promise<Product[]> => {
    return Promise.resolve(MOCK_PRODUCTS);
  },

  getFeatured: (limit: number = 3): Promise<Product[]> => {
    return Promise.resolve(MOCK_PRODUCTS.slice(0, limit));
  },

  getById: (id: string): Promise<Product | undefined> => {
    return Promise.resolve(MOCK_PRODUCTS.find(p => p.id === id));
  },

  getRelated: (id: string, limit: number = 3): Promise<Product[]> => {
    return Promise.resolve(MOCK_PRODUCTS.filter(p => p.id !== id).slice(0, limit));
  }
};
