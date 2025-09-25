'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Car, Calendar, DollarSign, MapPin, Phone, Mail, ArrowLeft, Share2, Heart } from 'lucide-react';
import { carsApi } from '@/lib/api';
import { Car as CarType } from '@/types';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function CarDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [car, setCar] = useState<CarType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const response = await carsApi.getCar(params.id as string);
        
        if (response.success) {
          setCar(response.data);
        } else {
          setError('Car not found');
        }
      } catch (err: any) {
        console.error('Error fetching car:', err);
        setError('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCar();
    }
  }, [params.id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${car?.brand} ${car?.model}`,
        text: `Check out this ${car?.year} ${car?.brand} ${car?.model} for $${car?.price?.toLocaleString()}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleContact = () => {
    if (car?.user?.phone) {
      window.open(`tel:${car.user.phone}`);
    } else if (car?.user?.email) {
      window.open(`mailto:${car.user.email}`);
    } else {
      toast.error('Contact information not available');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="xl" text="Loading car details..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Car Not Found</h1>
            <p className="text-gray-600 mb-6">The car you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/inventory')}
              className="btn btn-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Inventory
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => router.push('/inventory')}
                className="text-primary-600 hover:text-primary-800 transition-colors duration-200"
              >
                Inventory
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">{car.brand} {car.model}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
                {car.images && car.images.length > 0 ? (
                  <Image
                    src={car.images[selectedImage] || '/placeholder-car.jpg'}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                      console.error('Image load error:', e);
                      e.currentTarget.src = '/placeholder-car.jpg';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Car className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {car.images && car.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {car.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-video bg-gray-100 rounded-lg overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-primary-500' : ''
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${car.brand} ${car.model} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          console.error('Thumbnail image load error:', e);
                          e.currentTarget.src = '/placeholder-car.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Car Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {car.brand} {car.model}
                </h1>
                <p className="text-xl text-primary-600 font-semibold">
                  ${car.price?.toLocaleString()}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {car.condition}
                  </span>
                  <span className="text-gray-600">{car.year}</span>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-semibold">{car.year}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <DollarSign className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold">${car.price?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {car.description || 'No description provided.'}
                </p>
              </div>

              {/* Seller Information */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {car.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{car.user?.name || 'Unknown Seller'}</p>
                      <p className="text-sm text-gray-600">{car.user?.role || 'Seller'}</p>
                    </div>
                  </div>
                  
                  {car.user?.businessName && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{car.user.businessName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleContact}
                  className="flex-1 btn btn-primary flex items-center justify-center"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Seller
                </button>
                <button
                  onClick={handleShare}
                  className="btn btn-outline flex items-center justify-center"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                <button className="btn btn-outline flex items-center justify-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
