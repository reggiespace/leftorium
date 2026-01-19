import { Product } from '../types';
import { StrapiService } from './strapiService';

export const ProductService = {
  getAll: async (): Promise<Product[]> => {
    try {
      return await StrapiService.getProducts();
    } catch (error) {
      console.warn('Failed to fetch from Strapi, returning empty list:', error);
      return [];
    }
  },

  getFeatured: async (limit: number = 3): Promise<Product[]> => {
    try {
      const all = await StrapiService.getProducts();
      return all.slice(0, limit);
    } catch (error) {
      return [];
    }
  },

  getById: async (idOrSlug: string): Promise<Product | undefined> => {
    try {
      // Try optimized fetch by slug first if it looks like a slug
      if (isNaN(Number(idOrSlug))) {
         const bySlug = await StrapiService.getProductBySlug(idOrSlug);
         if (bySlug) return bySlug;
      }
      
      // Fallback to fetching all (for ID lookup or "fetch everything" strategy)
      const all = await StrapiService.getProducts();
      return all.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    } catch (error) {
      return undefined;
    }
  },

  getRelated: async (id: string, limit: number = 3): Promise<Product[]> => {
    try {
      const all = await StrapiService.getProducts();
      return all.filter(p => p.id !== id).slice(0, limit);
    } catch (error) {
      return [];
    }
  }
};

