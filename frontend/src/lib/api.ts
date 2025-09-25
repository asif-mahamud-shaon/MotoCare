import axios from 'axios';
import { ApiResponse, PaginatedResponse, Car, User, GalleryImage, CarFilters, AdminStats } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('Network Error: Backend server is not running');
      throw new Error('Network Error: Please check if the backend server is running');
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (
    name: string, 
    email: string, 
    password: string, 
    role: 'OWNER' | 'SHOP' | 'VENDOR' = 'OWNER',
    phone?: string,
    address?: string,
    businessName?: string,
    businessType?: string,
    licenseNumber?: string
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/register', { 
      name, 
      email, 
      password, 
      role, 
      phone, 
      address, 
      businessName, 
      businessType, 
      licenseNumber 
    });
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Cars API
export const carsApi = {
  getCars: async (filters?: CarFilters): Promise<PaginatedResponse<Car>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const response = await api.get(`/cars?${params.toString()}`);
    return response.data;
  },

  getCar: async (id: string): Promise<ApiResponse<Car>> => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },

  createCar: async (carData: FormData): Promise<ApiResponse<Car>> => {
    const response = await api.post('/cars', carData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateCar: async (id: string, carData: FormData): Promise<ApiResponse<Car>> => {
    const response = await api.put(`/cars/${id}`, carData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteCar: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/cars/${id}`);
    return response.data;
  },

  getMyCars: async (page = 1, limit = 12): Promise<PaginatedResponse<Car>> => {
    const response = await api.get(`/cars/user/my-cars?page=${page}&limit=${limit}`);
    return response.data;
  },
};

// Gallery API
export const galleryApi = {
  getImages: async (page = 1, limit = 20): Promise<PaginatedResponse<GalleryImage>> => {
    const response = await api.get(`/gallery?page=${page}&limit=${limit}`);
    return response.data;
  },

  uploadImage: async (carId: string, image: File): Promise<ApiResponse<GalleryImage>> => {
    const formData = new FormData();
    formData.append('carId', carId);
    formData.append('image', image);
    
    const response = await api.post('/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteImage: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  },
};

// Admin API
export const adminApi = {
  getStats: async (): Promise<ApiResponse<AdminStats>> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (page = 1, limit = 20, search?: string): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append('search', search);
    
    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  getCars: async (page = 1, limit = 20, approved?: boolean, brand?: string): Promise<PaginatedResponse<Car>> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (approved !== undefined) params.append('approved', approved.toString());
    if (brand) params.append('brand', brand);
    
    const response = await api.get(`/admin/cars?${params.toString()}`);
    return response.data;
  },

  approveCar: async (id: string, approved: boolean): Promise<ApiResponse<Car>> => {
    const response = await api.put(`/admin/cars/${id}/approve`, { approved });
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  deleteCar: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/admin/cars/${id}`);
    return response.data;
  },
};

export default api;
