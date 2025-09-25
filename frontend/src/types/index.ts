export interface User {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'SHOP' | 'VENDOR' | 'ADMIN';
  phone?: string;
  address?: string;
  businessName?: string;
  businessType?: string;
  licenseNumber?: string;
  isVerified: boolean;
  createdAt: string;
  _count?: {
    cars: number;
  };
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  condition: 'NEW' | 'RECONDITIONED' | 'PRE_OWNED';
  price: number;
  description?: string;
  images: string[];
  approved: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    gallery: number;
  };
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  carId: string;
  createdAt: string;
  car?: {
    id: string;
    brand: string;
    model: string;
    year: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
    pagination: PaginationMeta;
  };
}

export interface CarFilters {
  page?: number;
  limit?: number;
  brand?: string;
  condition?: 'NEW' | 'RECONDITIONED' | 'PRE_OWNED';
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  approved?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string, 
    email: string, 
    password: string, 
    role?: 'OWNER' | 'SHOP' | 'VENDOR',
    phone?: string,
    address?: string,
    businessName?: string,
    businessType?: string,
    licenseNumber?: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface AdminStats {
  overview: {
    totalUsers: number;
    totalCars: number;
    approvedCars: number;
    pendingCars: number;
    totalRevenue: number;
  };
  recentCars: Car[];
  recentUsers: User[];
}
