'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from 'react-query';
import { carsApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CarCard } from '@/components/ui/CarCard';
import { 
  Car, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  DollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery(
    ['my-cars', currentPage],
    () => carsApi.getMyCars(currentPage, 12),
    {
      enabled: !!user,
    }
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const handleDeleteCar = async (carId: string) => {
    if (!confirm('Are you sure you want to delete this car listing?')) {
      return;
    }

    try {
      await carsApi.deleteCar(carId);
      toast.success('Car listing deleted successfully');
      refetch();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to delete car';
      toast.error(message);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const cars = data?.data?.cars || [];
  const pagination = data?.data?.pagination;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Welcome back,
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
                    {' '}{user.name}
                  </span>
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                    {user.role}
                  </span>
                  {user.businessName && (
                    <span className="text-lg text-gray-600">
                      {user.businessName}
                    </span>
                  )}
                </div>
                <p className="text-xl text-gray-600">
                  {user.role === 'OWNER' && 'Manage your car listings and track your sales'}
                  {user.role === 'SHOP' && 'Manage your auto shop inventory and repairs'}
                  {user.role === 'VENDOR' && 'Manage your wholesale car inventory'}
                  {user.role === 'ADMIN' && 'Manage the platform and oversee all activities'}
                </p>
              </div>
              
              <div className="mt-6 md:mt-0">
                <Link
                  href="/sell"
                  className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>List New Car</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Car className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Cars</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination?.total || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cars.filter(car => car.approved).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <EyeOff className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cars.filter(car => !car.approved).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${cars.reduce((sum, car) => sum + car.price, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* My Cars Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Car Listings</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {pagination && Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <option key={page} value={page}>Page {page}</option>
                  ))}
                </select>
              </div>
            </div>

            {error ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Failed to load your cars</p>
                <button
                  onClick={() => refetch()}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            ) : cars.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <div key={car.id} className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {car.images?.[0] ? (
                          <img
                            src={car.images[0].startsWith('http') ? car.images[0] : `http://localhost:5000${car.images[0]}`}
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Car className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            car.approved 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {car.approved ? 'Approved' : 'Pending'}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex space-x-2">
                            <Link
                              href={`/cars/${car.id}`}
                              className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                              title="View"
                            >
                              <Eye className="w-4 h-4 text-gray-700" />
                            </Link>
                            <button
                              onClick={() => handleDeleteCar(car.id)}
                              className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {car.brand} {car.model}
                        </h3>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{car.year}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>${car.price.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {car.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {car.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {car.condition}
                          </span>
                          <div className="flex space-x-2">
                            <Link
                              href={`/cars/${car.id}/edit`}
                              className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200"
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={!pagination.hasPrev}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                      >
                        Previous
                      </button>
                      
                      <span className="px-4 py-2 text-sm text-gray-700">
                        Page {currentPage} of {pagination.totalPages}
                      </span>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                        disabled={!pagination.hasNext}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No cars listed yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by listing your first car to get started
                </p>
                <Link
                  href="/sell"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>List Your First Car</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
