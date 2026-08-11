import { MOCK_PRODUCTS } from '../mockData';
import { Product } from '../types';
import { StrapiService } from './strapiService';

// Strapi is the source of truth once products are published there; until
// then (or if it's unreachable) the site falls back to the 12 seed
// products ported from the Claude Design export, so the catalogue is
// never empty.
let cachedAll: Product[] | null = null;

async function loadAll(): Promise<Product[]> {
  if (cachedAll) return cachedAll;
  try {
    const resp = await StrapiService.getProducts({ pageSize: 200 });
    cachedAll = resp.data.length > 0 ? resp.data : MOCK_PRODUCTS;
  } catch (error) {
    console.warn('Failed to fetch from Strapi, using local catalogue:', error);
    cachedAll = MOCK_PRODUCTS;
  }
  return cachedAll;
}

export const ProductService = {
  getAll: (): Promise<Product[]> => loadAll(),

  getFeatured: async (limit = 4): Promise<Product[]> => {
    const all = await loadAll();
    return [...all].sort((a, b) => b.viewsSeed - a.viewsSeed).slice(0, limit);
  },

  getById: async (idOrSlug: string): Promise<Product | undefined> => {
    const all = await loadAll();
    return all.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  },
};
