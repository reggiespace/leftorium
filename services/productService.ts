import { Product } from '../types';
import { GetProductsOptions, PaginatedResponse, StrapiService } from './strapiService';

export const ProductService = {
  getProducts: async (options: GetProductsOptions = {}): Promise<PaginatedResponse<Product>> => {
    try {
      return await StrapiService.getProducts(options);
    } catch (error) {
      console.warn('Failed to fetch from Strapi:', error);
      return { data: [], meta: { pagination: { page: 1, pageSize: 8, pageCount: 0, total: 0 } } };
    }
  },

  getAll: async (): Promise<Product[]> => {
    try {
      const resp = await StrapiService.getProducts({ pageSize: 100 }); // High limit for "all"
      return resp.data;
    } catch (error) {
      console.warn('Failed to fetch from Strapi, returning empty list:', error);
      return [];
    }
  },

  getFeatured: async (limit: number = 3): Promise<Product[]> => {
    try {
      const resp = await StrapiService.getProducts({ pageSize: limit });
      return resp.data;
    } catch (error) {
      return [];
    }
  },

  getById: async (idOrSlug: string): Promise<Product | undefined> => {
    try {
      if (isNaN(Number(idOrSlug))) {
         const bySlug = await StrapiService.getProductBySlug(idOrSlug);
         if (bySlug) return bySlug;
      }
      
      const resp = await StrapiService.getProducts({ pageSize: 100 });
      return resp.data.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    } catch (error) {
      return undefined;
    }
  },

  getRelated: async (id: string, limit: number = 3): Promise<Product[]> => {
    try {
      const resp = await StrapiService.getProducts({ pageSize: limit + 1 });
      return resp.data.filter(p => p.id !== id).slice(0, limit);
    } catch (error) {
      return [];
    }
  }
};


