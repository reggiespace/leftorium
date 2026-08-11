import { Category, Comment, Product } from '../types';

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    pagination: StrapiPagination;
  };
}

export interface GetProductsOptions {
  page?: number;
  pageSize?: number;
  category?: string;
  isReal?: boolean;
}

// Runtime-configurable so the built image can point at a different Strapi
// instance without a rebuild — see index.html / docker/docker-entrypoint.sh.
const STRAPI_URL =
  (typeof window !== 'undefined' && (window as any).__ENV__?.VITE_STRAPI_URL) ||
  import.meta.env.VITE_STRAPI_URL ||
  'http://localhost:1337';
const STRAPI_TOKEN =
  (typeof window !== 'undefined' && (window as any).__ENV__?.VITE_STRAPI_TOKEN) ||
  import.meta.env.VITE_STRAPI_TOKEN;

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (STRAPI_TOKEN) headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  return headers;
};

const mapStrapiToProduct = (item: any): Product => {
  const id = item.documentId || item.id;
  const data = item.attributes || item;
  const media = data.image?.data?.attributes || data.image;

  return {
    id: String(id),
    slug: data.slug,
    name: data.title,
    category: (data.category as Category) || Category.LAB,
    isReal: !!data.is_real,
    price: data.price || 'Concept',
    blurb: data.blurb || '',
    longDescription: data.description || '',
    features: Array.isArray(data.features) ? data.features : [],
    cost: data.cost_note || '',
    imgLabel: data.img_label || data.title || 'product photo',
    // S3 providers (Garage included) return an absolute URL already;
    // Strapi's local-disk provider returns a path relative to STRAPI_URL.
    imageUrl: media?.url ? (media.url.startsWith('http') ? media.url : `${STRAPI_URL}${media.url}`) : undefined,
    likesSeed: data.likes_seed ?? 0,
    viewsSeed: data.views_seed ?? 0,
  };
};

const mapStrapiToComment = (item: any): Comment => {
  const data = item.attributes || item;
  return {
    id: String(item.documentId || item.id),
    who: data.author_name || 'Anonymous',
    when: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : '',
    text: data.text || '',
  };
};

export const StrapiService = {
  async getProducts(options: GetProductsOptions = {}): Promise<PaginatedResponse<Product>> {
    const { page = 1, pageSize = 100, category, isReal } = options;
    let query = `pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`;
    if (category && category !== 'all') query += `&filters[category][$eq]=${encodeURIComponent(category)}`;
    if (isReal !== undefined) query += `&filters[is_real][$eq]=${isReal}`;

    const response = await fetch(`${STRAPI_URL}/api/leftorium-products?${query}`, { headers: getHeaders() });
    if (!response.ok) throw new Error(`Failed to fetch products (${response.status})`);

    const json = await response.json();
    if (!json.data) return { data: [], meta: { pagination: { page: 1, pageSize, pageCount: 0, total: 0 } } };

    return { data: json.data.map(mapStrapiToProduct), meta: json.meta };
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const response = await fetch(
      `${STRAPI_URL}/api/leftorium-products?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
      { headers: getHeaders() }
    );
    if (!response.ok) return null;
    const json = await response.json();
    if (!json.data || json.data.length === 0) return null;
    return mapStrapiToProduct(json.data[0]);
  },

  async submitProduct(payload: { data: Record<string, unknown> }) {
    const response = await fetch(`${STRAPI_URL}/api/leftorium-suggestions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to submit product');
    }
    return response.json();
  },

  async submitSuggestion(payload: { data: Record<string, unknown> }) {
    const response = await fetch(`${STRAPI_URL}/api/leftorium-suggestions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to submit suggestion');
    }
    return response.json();
  },

  /** Read-only, admin-curated flavor comments. No submission endpoint — see mockData.ts for the fallback. */
  async getComments(productId: string): Promise<Comment[]> {
    const query = `filters[product][id][$eq]=${encodeURIComponent(productId)}&sort=createdAt:desc`;
    const response = await fetch(`${STRAPI_URL}/api/leftorium-comments?${query}`, { headers: getHeaders() });
    if (!response.ok) return [];
    const json = await response.json();
    if (!json.data) return [];
    return json.data.map(mapStrapiToComment);
  },
};
