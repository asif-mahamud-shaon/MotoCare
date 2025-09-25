'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Car, Heart, Eye, Calendar, DollarSign } from 'lucide-react';
import { formatPrice, getConditionLabel, getConditionColor, getImageUrl } from '@/lib/utils';
import { Car as CarType } from '@/types';

interface CarCardProps {
  car: CarType;
  showActions?: boolean;
  onFavorite?: (carId: string) => void;
  onView?: (carId: string) => void;
}

export function CarCard({ car, showActions = true, onFavorite, onView }: CarCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavorite?.(car.id);
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`/inventory/${car.id}`, '_blank');
  };

  const mainImage = car.images?.[0] || '/placeholder-car.jpg';
  const imageUrl = getImageUrl(mainImage);

  return (
    <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {!imageError ? (
          <Image
            src={imageUrl}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Car className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Condition Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getConditionColor(car.condition)}`}>
            {getConditionLabel(car.condition)}
          </span>
        </div>

        {/* Favorite Button */}
        {showActions && (
          <button
            onClick={handleFavorite}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Add to favorites"
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-200 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            />
          </button>
        )}

        {/* Quick Actions */}
        {showActions && (
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleView}
              className="w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Quick view"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Price Overlay */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(car.price)}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
            {car.brand} {car.model}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>{formatPrice(car.price)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {car.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {car.description}
          </p>
        )}

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {car.condition}
          </span>
          {car._count?.gallery && car._count.gallery > 0 && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
              {car._count.gallery} Photos
            </span>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-3">
            <Link
              href={`/inventory/${car.id}`}
              className="flex-1 btn-primary text-center py-2 text-sm"
            >
              View Details
            </Link>
            <button
              onClick={handleView}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
            >
              Quick View
            </button>
          </div>
        )}

        {/* Seller Info */}
        {car.user && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-600">
                  {car.user.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {car.user.name}
                </div>
                <div className="text-xs text-gray-500">
                  Verified Seller
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
