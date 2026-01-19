import { Product } from '../types';

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
  const id = item.documentId || item.id; // Strapi V5 uses documentId, V4 uses id
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
                    user: data.user.id // Link strict relation to auth user
                }
            })
        });
      } catch (err) {
          console.error('Failed to create user profile, but auth created', err);
          // Non-blocking but not ideal
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

      // 2. Fetch associated Leftorium User profile
      try {
          const profileRes = await fetch(`${STRAPI_URL}/api/leftorium-users?filters[user][id][$eq]=${authUser.id}&populate=*`, {
              headers
          });
          
          if (profileRes.ok) {
              const profileJson = await profileRes.json();
              if (profileJson.data && profileJson.data.length > 0) {
                  const profile = profileJson.data[0];
                  const attrs = profile.attributes || profile;
                  
                  // Merge profile data into user object
                  return {
                      ...authUser,
                      id: authUser.id, // Keep auth ID as primary for now (for token ref)
                      username: attrs.username || authUser.username, // Prefer local profile username
                      email: attrs.email || authUser.email,          // Prefer local profile email
                      leftoriumUserId: profile.id,
                      avatar: attrs.avatar?.data?.attributes?.url || attrs.avatar?.url || null
                  };
              }
          }
      } catch (e) {
          console.warn('Could not fetch extended profile', e);
      }

      return authUser;
  },

  async getComments(productId: string) {
    try {
      // populate 'leftorium_user' (snake_case likely) or 'leftoriumUser' (camelCase) - Strapi defaults to camelCase usually for API response keys 
      // but relation field might be 'leftorium_user'.
      // Let's try populate[leftorium_user]...
      const response = await fetch(`${STRAPI_URL}/api/leftorium-comments?filters[product][id][$eq]=${productId}&populate[leftorium_user][populate]=avatar&sort=createdAt:desc`, {
        headers: getHeaders()
      });

      if (!response.ok) return [];

      const json = await response.json();
      if (!json.data) return [];

      return json.data.map((item: any) => {
        const data = item.attributes || item; // Handle Strapi v4/v5
        
        // Handle relation: 'leftorium_user' or 'leftoriumUser'
        const rawUser = data.leftorium_user || data.leftoriumUser;
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
    } catch (error) {
      console.error('Failed to fetch comments', error);
      return [];
    }
  },

  async submitComment(productId: string, content: string) {
    const user = await this.getMe(); // This now returns object with leftoriumUserId if available
    
    // We link to 'leftorium_user' not 'user' (auth)
    // Relation key depends on field name. Assuming 'leftorium_user'.
    
    const body: any = {
        data: {
          content,
          product: productId,
        }
    };

    if (user.leftoriumUserId) {
        body.data.leftorium_user = user.leftoriumUserId;
    } else {
        // Fallback: try linking auth user if schema allows, or error?
        // Usually if we failed to get profile, we might not be able to comment nicely.
        // We'll proceed; maybe the user didn't have a profile doc created yet.
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
  }
};
