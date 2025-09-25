'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SellCarForm } from '@/components/forms/SellCarForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Car, Upload, Shield, DollarSign, Clock } from 'lucide-react';

export default function SellPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login?redirect=/sell');
    return null;
  }

  const features = [
    {
      icon: DollarSign,
      title: 'Get Best Price',
      description: 'Our experts help you get the maximum value for your car',
    },
    {
      icon: Shield,
      title: 'Secure Process',
      description: 'Safe and secure transaction with verified buyers',
    },
    {
      icon: Clock,
      title: 'Quick Sale',
      description: 'Fast and efficient selling process',
    },
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Simple photo upload and listing process',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Sell Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
                  {' '}Car
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get the best price for your car with our trusted marketplace. 
                List your vehicle in minutes and connect with serious buyers.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  List Your Vehicle
                </h2>
                <p className="text-gray-600">
                  Fill out the form below to create your car listing
                </p>
              </div>

              <SellCarForm />
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose MotoCare?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We make selling your car simple, safe, and profitable
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-400 mb-2">500+</div>
                <div className="text-gray-300">Cars Sold Monthly</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-400 mb-2">4.9/5</div>
                <div className="text-gray-300">Customer Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-400 mb-2">24/7</div>
                <div className="text-gray-300">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
