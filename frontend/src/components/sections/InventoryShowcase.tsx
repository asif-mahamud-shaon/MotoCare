'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { carsApi } from '@/lib/api';
import { CarCard } from '@/components/ui/CarCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ChevronRight, TrendingUp } from 'lucide-react';

export function InventoryShowcase() {
  const [featuredCars, setFeaturedCars] = useState<any[]>([]);

  const { data, isLoading, error } = useQuery(
    'featured-cars',
    () => carsApi.getCars({ limit: 6, approved: true }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  useEffect(() => {
    if (data?.data?.cars) {
      setFeaturedCars(data.data.cars);
    }
  }, [data]);

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">Failed to load featured cars</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="w-6 h-6 text-primary-600" />
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wide">
              Featured Inventory
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Premium
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
              {' '}Automobiles
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our curated collection of exceptional vehicles, each carefully selected for quality, performance, and style.
          </p>
        </div>

        {/* Cars Grid */}
        {featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Cars Available</h3>
            <p className="text-gray-600 mb-8">Check back soon for our latest inventory updates.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center">
          <Link
            href="/inventory"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2 group"
          >
            <span>View All Cars</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Cars in Stock</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">Brands Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
              <div className="text-gray-600">Quality Guaranteed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
