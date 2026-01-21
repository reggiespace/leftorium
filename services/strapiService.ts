import { Product } from '../types';

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


const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN;

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Prefer user token if available, otherwise use global token if it exists
  const userToken = localStorage.getItem('strapi_jwt');
  const tokenToUse = userToken || STRAPI_TOKEN;

  if (tokenToUse) {
    headers['Authorization'] = `Bearer ${tokenToUse}`;
  }
  return headers;
};


// Helper to map Strapi response to our Product type
const mapStrapiToProduct = (item: any): Product => {
  const id = item.documentId || item.id; // Prefer documentId for v5
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
    longDescription: data.description,
    ratingAvg: data.rating_avg || 0,
    ratingCount: data.rating_count || 0
  };
};

export const StrapiService = {
  async getProducts(options: GetProductsOptions = {}): Promise<PaginatedResponse<Product>> {
    try {
      const { page = 1, pageSize = 8, category, isReal } = options;
      
      let query = `pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`;
      
      if (category && category !== 'all') {
        query += `&filters[category][$eq]=${category}`;
      }
      
      if (isReal !== undefined) {
        query += `&filters[is_real][$eq]=${isReal}`;
      }

      const response = await fetch(`${STRAPI_URL}/api/leftorium-products?${query}`, {
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const json = await response.json();
      if (!json.data) {
        return { data: [], meta: { pagination: { page: 1, pageSize: 8, pageCount: 0, total: 0 } } };
      }

      return {
        data: json.data.map(mapStrapiToProduct),
        meta: json.meta
      };
    } catch (error) {
      console.error('StrapiService getProducts error:', error);
      if (error instanceof Error && error.message.includes('403')) {
         console.error('🚨 PERMISSION ERROR: Check Strapi Settings > Users & Permissions > Roles > Public/Authenticated > Leftorium Product > find');
      }
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
  },

  // Auth Methods
  async login(identifier: string, password: string) {
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Login failed');
    }

    return response.json();
  },

  async register(username: string, email: string, password: string) {
      // 1. Register the Auth User
      const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Registration failed');
      }

      const data = await response.json();
      
      // 2. Create the associated Leftorium User profile
      // We assume there is a 'leftorium-users' collection linked to 'user' (from permissions)
      try {
        await fetch(`${STRAPI_URL}/api/leftorium-users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.jwt}`
            },
            body: JSON.stringify({
                data: {
                    username: username, // Duplicating username for display convenience
                    email: email,
                    users_permissions_user: data.user.id // Link strict relation to auth user
                }
            })
        });
      } catch (err: any) {
          console.error('Failed to create user profile after auth registration:', err);
          if (err instanceof Error && err.message.includes('403')) {
            console.error('🚨 PERMISSION ERROR: The "Authenticated" role cannot create "Leftorium Users". Go to Strapi > Settings > Roles > Authenticated > Leftorium-user > check "create".');
          }
      }

      return data;
  },

  async getMe() {
      const headers = getHeaders();
      // 1. Get Auth User
      const response = await fetch(`${STRAPI_URL}/api/users/me`, {
          headers
      });

      if (!response.ok) {
           throw new Error('Failed to fetch user profile');
      }
      
      const authUser = await response.json();
      const authUserId = authUser.documentId || authUser.id; // Use documentId if available (Strapi v5 standard)

      // 2. Fetch associated Leftorium User profile
      // Strategy: Filter by the 'username' attribute on Leftorium User.
      // IMPORTANT: Add publicationState=preview to find Draft profiles (which auto-creation might produce).
      try {
          const profileRes = await fetch(`${STRAPI_URL}/api/leftorium-users?filters[username][$eq]=${authUser.username}&populate=*&publicationState=preview`, {
              headers
          });
          
          if (profileRes.ok) {
              const profileJson = await profileRes.json();
              if (profileJson.data && profileJson.data.length > 0) {
                  const profile = profileJson.data[0];
                  // v5: documentId is the main ID, id is internal int. We often use documentId for public.
                  const profileId = profile.documentId || profile.id; 
                  const attrs = profile.attributes || profile;
                  
                  // Merge profile data into user object
                  return {
                      ...authUser,
                      id: authUserId,
                      username: attrs.username || authUser.username,
                      email: attrs.email || authUser.email,
                      leftoriumUserId: profileId,
                      avatar: attrs.avatar?.data?.attributes?.url || attrs.avatar?.url || null
                  };
              } else {
                  // Profile not found - Auto-create it (Lazy Creation)
                  // "Invalid key" errors suggest we can't set the relation easily during creation via API.
                  // Fallback: Create profile WITHOUT relation first (essential data), then try to link it.
                  // Since we now look up by 'username', this is sufficient for the app to work.
                  try {
                      const createPayload = {
                        data: {
                            username: authUser.username,
                            email: authUser.email,
                            publishedAt: new Date().toISOString() // Create as PUBLISHED immediately
                        }
                      };

                      const createRes = await fetch(`${STRAPI_URL}/api/leftorium-users`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(createPayload)
                      });

                      if (createRes.ok) {
                          const newProfileJson = await createRes.json();
                          const newProfile = newProfileJson.data;
                          const newProfileId = newProfile.documentId || newProfile.id;
                          
                          // Best-effort attempt to link the relation afterwards
                          try {
                              await fetch(`${STRAPI_URL}/api/leftorium-users/${newProfile.documentId}`, {
                                  method: 'PUT',
                                  headers,
                                  body: JSON.stringify({
                                      data: {
                                          users_permissions_user: authUserId
                                      }
                                  })
                              });
                          } catch (linkErr) {
                              // Non-critical: linking might fail due to permissions, but app works via username matching
                          }

                          return {
                              ...authUser,
                              id: authUserId,
                              username: authUser.username,
                              email: authUser.email,
                              leftoriumUserId: newProfileId,
                              avatar: null 
                          };
                      } else {
                         // Fallback logging for creation failure
                         console.warn('Failed to auto-create profile:', await createRes.text());
                      }
                  } catch (createErr) {
                      console.error('Error auto-creating profile:', createErr);
                  }
              }
          } else {
              console.warn('Failed to check for profile:', await profileRes.text());
          }
      } catch (e) {
          console.warn('Could not fetch extended profile', e);
      }

      return authUser;
  },

  async getComments(productId: string, page: number = 1, pageSize: number = 5): Promise<PaginatedResponse<any>> {
    try {
      const query = `filters[product][documentId][$eq]=${productId}&populate[user][populate]=avatar&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
      const response = await fetch(`${STRAPI_URL}/api/leftorium-comments?${query}`, {
        headers: getHeaders()
      });

      if (!response.ok) return { data: [], meta: { pagination: { page, pageSize, pageCount: 0, total: 0 } } };

      const json = await response.json();
      if (!json.data) return { data: [], meta: { pagination: { page, pageSize, pageCount: 0, total: 0 } } };

      const processedData = json.data.map((item: any) => {
        const data = item.attributes || item; 
        
        // Handle relation: 'user'
        const rawUser = data.user;
        const userData = rawUser?.data?.attributes || rawUser?.attributes || rawUser;
        
        return {
          id: item.id,
          content: data.content,
          createdAt: data.createdAt,
          user: {
            username: userData?.username || 'Anonymous',
            avatar: userData?.avatar?.data?.attributes?.url || userData?.avatar?.url || null
          }
        };
      });

      return {
        data: processedData,
        meta: json.meta
      };
    } catch (error) {
      console.error('Failed to fetch comments', error);
      return { data: [], meta: { pagination: { page, pageSize, pageCount: 0, total: 0 } } };
    }
  },

  async submitComment(productId: string, content: string) {
    const user = await this.getMe(); 
    
    // Schema confirmed: relation field is 'user'
    const body: any = {
        data: {
          content,
          product: productId, // Assuming 'product' relation accepts documentId or ID. 
        }
    };

    if (user.leftoriumUserId) {
        body.data.user = user.leftoriumUserId;
    } 

    const response = await fetch(`${STRAPI_URL}/api/leftorium-comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
       throw new Error('Failed to post comment');
    }
    
    return response.json();
  },

  async getUserRating(productId: string, leftoriumUserId: string) {
    try {
      const query = `filters[product][documentId][$eq]=${productId}&filters[user][documentId][$eq]=${leftoriumUserId}`;
      const response = await fetch(`${STRAPI_URL}/api/leftorium-ratings?${query}`, {
        headers: getHeaders()
      });

      if (!response.ok) return null;

      const json = await response.json();
      if (!json.data || json.data.length === 0) return null;

      const item = json.data[0];
      const data = item.attributes || item;

      return {
        id: item.documentId || item.id,
        score: data.score
      };
    } catch (error) {
      console.error('Failed to fetch user rating', error);
      return null;
    }
  },

  async submitRating(productId: string, score: number, leftoriumUserId: string, existingRatingId?: string) {
    const method = existingRatingId ? 'PUT' : 'POST';
    const url = existingRatingId 
      ? `${STRAPI_URL}/api/leftorium-ratings/${existingRatingId}`
      : `${STRAPI_URL}/api/leftorium-ratings`;

    const body: any = {
      data: {
        score,
        product: productId,
        user: leftoriumUserId
      }
    };

    const response = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
       const errorData = await response.json().catch(() => ({}));
       console.error('Strapi submitRating error:', errorData);
       throw new Error(errorData.error?.message || 'Failed to submit rating');
    }
    
    return response.json();
  },

  async updateProductStats(productId: string, ratingAvg: number, ratingCount: number) {
    const response = await fetch(`${STRAPI_URL}/api/leftorium-products/${productId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        data: {
          rating_avg: ratingAvg,
          rating_count: ratingCount
        }
      })
    });

    if (!response.ok) {
       const errorData = await response.json().catch(() => ({}));
       console.error('Strapi updateProductStats error:', errorData);
       throw new Error(errorData.error?.message || 'Failed to update product stats');
    }
    
    return response.json();
  }
};
