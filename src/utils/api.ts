// Frontend API utilities for PetCare Pro Deluxe
import { config } from '../src/config/env';

const API_BASE_URL = config.apiUrl;

// API Response Types
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items?: T[];
    services?: T[];
    products?: T[];
    bookings?: T[];
    pets?: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
  };
}

// Token management
class TokenManager {
  private static TOKEN_KEY = 'petcare_token';

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// HTTP Client
class HttpClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const requestConfig: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...TokenManager.getAuthHeaders(),
        ...options.headers,
      },

      ...options,
    };

    if (config.enableApiLogging) {
      console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`);
    }

    try {
      const response = await fetch(url, requestConfig);
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          TokenManager.removeToken();
          // Only redirect if we're not already on the login page
          if (!window.location.pathname.includes('/login')) {
            console.log('Session expired, redirecting to login...');
            // Could trigger a callback instead of direct redirect
            // window.location.href = '/login';
          }
        }
        
        if (config.enableApiLogging) {
          console.error(`❌ API Error: ${response.status} - ${data.message || 'Unknown error'}`);
        }
        
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (config.enableApiLogging) {
        console.log(`✅ API Success: ${options.method || 'GET'} ${url}`);
      }

      return data;
    } catch (error) {
      if (config.enableApiLogging) {
        console.error('API Request Error:', error);
      }
      
      // Enhance error messages for better user experience
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const http = new HttpClient();

// Authentication API
export const authAPI = {
  async register(userData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  }): Promise<ApiResponse<{ user: any; token: string }>> {
    const response = await http.post('/auth/register', userData);
    if (response.success && response.data?.token) {
      TokenManager.setToken(response.data.token);
    }
    return response;
  },

  async login(email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> {
    const response = await http.post('/auth/login', { email, password });
    if (response.success && response.data?.token) {
      TokenManager.setToken(response.data.token);
    }
    return response;
  },

  async logout(): Promise<ApiResponse> {
    try {
      await http.post('/auth/logout');
    } finally {
      TokenManager.removeToken();
    }
    return { success: true };
  },

  async getCurrentUser(): Promise<ApiResponse<{ user: any }>> {
    return http.get('/auth/me');
  },

  async updateProfile(profileData: {
    fullName?: string;
    phone?: string;
  }): Promise<ApiResponse<{ user: any }>> {
    return http.put('/auth/profile', profileData);
  },

  async forgotPassword(email: string): Promise<ApiResponse> {
    return http.post('/auth/forgot-password', { email });
  },
};

// Services API
export const servicesAPI = {
  async getServices(params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/services${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return http.get(endpoint);
  },

  async getService(id: string): Promise<ApiResponse<{ service: any }>> {
    return http.get(`/services/${id}`);
  },

  async getCategories(): Promise<ApiResponse<{ categories: any[] }>> {
    return http.get('/services/categories/summary');
  },

  async getFeaturedServices(): Promise<ApiResponse<{ services: any[] }>> {
    return http.get('/services/featured/list');
  },
};

// Pets API
export const petsAPI = {
  async getPets(): Promise<ApiResponse<{ pets: any[] }>> {
    return http.get('/pets');
  },

  async getPet(id: string): Promise<ApiResponse<{ pet: any }>> {
    return http.get(`/pets/${id}`);
  },

  async createPet(petData: {
    name: string;
    type: string;
    breed?: string;
    age?: number;
    weight?: number;
    specialNotes?: string;
  }): Promise<ApiResponse<{ pet: any }>> {
    return http.post('/pets', petData);
  },

  async updatePet(id: string, petData: {
    name: string;
    type: string;
    breed?: string;
    age?: number;
    weight?: number;
    specialNotes?: string;
  }): Promise<ApiResponse<{ pet: any }>> {
    return http.put(`/pets/${id}`, petData);
  },

  async deletePet(id: string): Promise<ApiResponse> {
    return http.delete(`/pets/${id}`);
  },

  async getPetStats(id: string): Promise<ApiResponse<{ stats: any }>> {
    return http.get(`/pets/${id}/stats`);
  },
};

// Bookings API
export const bookingsAPI = {
  async getBookings(params?: {
    status?: string;
    petId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/bookings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return http.get(endpoint);
  },

  async getBooking(id: string): Promise<ApiResponse<{ booking: any }>> {
    return http.get(`/bookings/${id}`);
  },

  async createBooking(bookingData: {
    serviceId: string;
    petId: string;
    scheduledAt: string;
    notes?: string;
    address: string;
    phone: string;
  }): Promise<ApiResponse<{ booking: any }>> {
    return http.post('/bookings', bookingData);
  },

  async updateBookingStatus(id: string, status: string): Promise<ApiResponse<{ booking: any }>> {
    return http.put(`/bookings/${id}/status`, { status });
  },

  async cancelBooking(id: string): Promise<ApiResponse<{ booking: any }>> {
    return http.put(`/bookings/${id}/cancel`);
  },

  async getBookingSummary(): Promise<ApiResponse<{ summary: any }>> {
    return http.get('/bookings/summary/stats');
  },
};

// Products API
export const productsAPI = {
  async getProducts(params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return http.get(endpoint);
  },

  async getProduct(id: string): Promise<ApiResponse<{ product: any }>> {
    return http.get(`/products/${id}`);
  },

  async getCategories(): Promise<ApiResponse<{ categories: any[] }>> {
    return http.get('/products/categories/summary');
  },

  async getFeaturedProducts(): Promise<ApiResponse<{ products: any[] }>> {
    return http.get('/products/featured/list');
  },

  async getRelatedProducts(id: string): Promise<ApiResponse<{ products: any[] }>> {
    return http.get(`/products/${id}/related`);
  },

  async searchProducts(query: string, params?: {
    category?: string;
    limit?: number;
  }): Promise<ApiResponse<{ products: any[]; query: string; count: number }>> {
    const queryParams = new URLSearchParams({ q: query });
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return http.get(`/products/search/query?${queryParams.toString()}`);
  },
};

// Cart API
export const cartAPI = {
  async getCart(): Promise<ApiResponse<{ items: any[]; summary: any }>> {
    return http.get('/cart');
  },

  async addToCart(productId: string, quantity: number): Promise<ApiResponse<{ cartItem: any }>> {
    return http.post('/cart/items', { productId, quantity });
  },

  async updateCartItem(productId: string, quantity: number): Promise<ApiResponse<{ cartItem?: any }>> {
    return http.put(`/cart/items/${productId}`, { quantity });
  },

  async removeFromCart(productId: string): Promise<ApiResponse> {
    return http.delete(`/cart/items/${productId}`);
  },

  async clearCart(): Promise<ApiResponse> {
    return http.delete('/cart/clear');
  },

  async getCartSummary(): Promise<ApiResponse<{ totalItems: number; subtotal: number; hasItems: boolean }>> {
    return http.get('/cart/summary');
  },
};

// Users API
export const usersAPI = {
  async getAddresses(): Promise<ApiResponse<{ addresses: any[] }>> {
    return http.get('/users/addresses');
  },

  async createAddress(addressData: {
    type: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  }): Promise<ApiResponse<{ address: any }>> {
    return http.post('/users/addresses', addressData);
  },

  async updateAddress(id: string, addressData: {
    type: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  }): Promise<ApiResponse<{ address: any }>> {
    return http.put(`/users/addresses/${id}`, addressData);
  },

  async setDefaultAddress(id: string): Promise<ApiResponse> {
    return http.put(`/users/addresses/${id}/default`);
  },

  async deleteAddress(id: string): Promise<ApiResponse> {
    return http.delete(`/users/addresses/${id}`);
  },

  async getDashboard(): Promise<ApiResponse<{ dashboard: any }>> {
    return http.get('/users/dashboard');
  },

  async getActivity(): Promise<ApiResponse<{ activities: any[] }>> {
    return http.get('/users/activity');
  },
};

// Storage utilities (backward compatibility)
export const storage = {
  setUser: (user: any) => {
    localStorage.setItem('petcare_user', JSON.stringify(user));
  },
  
  getUser: () => {
    const userData = localStorage.getItem('petcare_user');
    return userData ? JSON.parse(userData) : null;
  },
  
  clear: () => {
    localStorage.removeItem('petcare_user');
    TokenManager.removeToken();
  },
};

// Export token manager for direct access
export { TokenManager };

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    const healthUrl = API_BASE_URL.replace('/api', '') + '/health';
    if (config.enableApiLogging) {
      console.log('🏥 Checking backend health:', healthUrl);
    }
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const isHealthy = response.ok;
    if (config.enableApiLogging) {
      console.log(isHealthy ? '✅ Backend is healthy' : '❌ Backend is unhealthy');
    }
    
    return isHealthy;
  } catch (error) {
    if (config.enableApiLogging) {
      console.error('❌ Health check failed:', error);
    }
    return false;
  }
};

export default {
  auth: authAPI,
  services: servicesAPI,
  pets: petsAPI,
  bookings: bookingsAPI,
  products: productsAPI,
  cart: cartAPI,
  users: usersAPI,
  storage,
  healthCheck,
};