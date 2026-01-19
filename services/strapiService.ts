import { Product } from '../types';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN;

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }
  return headers;
};

// Helper to map Strapi response to our Product type
const mapStrapiToProduct = (item: any): Product => {
  const id = item.documentId || item.id; // Strapi V5 uses documentId, V4 uses id
  const attr = item; // In Strapi v4 REST API, attributes are nested. In V5 or flat calls, they might be direct. 
  // We'll assume standard Strapi v4/v5 format: { id, attributes: { ... } } or flattened if configured.
  // Actually, standard Strapi REST (v4/v5) wraps attributes. 
  // Let's inspect the payload structure from our previous detailed plan/logs.
  // "data": { "title": ... } 
  // When fetching, it usually returns { data: [ { id: 1, attributes: { title: ... } } ] }
  
  // However, for simplicity and robustness, let's handle both "flat" and "nested" attributes if possible, 
  // but standard Strapi client often gets: item.attributes.
  
  const data = item.attributes || item;

  return {
    id: String(id),
    name: data.title,
    slug: data.slug,
    description: data.short_description || '',
    category: data.category,
    price: data.price,
    image: data.art_url || 'https://via.placeholder.com/300', // Fallback
    isReal: data.is_real,
    features: Array.isArray(data.features) 
      ? data.features.map((f: any) => ({
          text: f.text || (typeof f === 'string' ? f : JSON.stringify(f)),
          icon: f.icon || 'check_circle' // Default icon if missing
        }))
      : [],
    longDescription: data.description
  };
};

export const StrapiService = {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${STRAPI_URL}/api/leftorium-products?populate=*`, {
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const json = await response.json();
      if (!json.data) return [];

      return json.data.map(mapStrapiToProduct);
    } catch (error) {
      console.error('StrapiService getProducts error:', error);
      throw error;
    }
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      // filters[slug][$eq]=...
      const response = await fetch(`${STRAPI_URL}/api/leftorium-products?filters[slug][$eq]=${slug}&populate=*`, {
        headers: getHeaders()
      });

      if (!response.ok) return null;
      
      const json = await response.json();
      if (!json.data || json.data.length === 0) return null;

      return mapStrapiToProduct(json.data[0]);
    } catch (error) {
      console.error('StrapiService getProductBySlug error:', error);
      return null;
    }
  },

  async submitProduct(payload: any) {
    const response = await fetch(`${STRAPI_URL}/api/leftorium-products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to submit product');
    }
    return response.json();
  },

  async submitSuggestion(payload: any) {
    const response = await fetch(`${STRAPI_URL}/api/leftorium-suggestions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to submit suggestion');
    }
    return response.json();
  }
};
