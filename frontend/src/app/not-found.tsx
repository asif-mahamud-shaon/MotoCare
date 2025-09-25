'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Car, Search } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* 404 Illustration */}
            <div className="mb-12">
              <div className="relative inline-block">
                <div className="text-9xl font-bold text-gray-200 select-none">
                  404
                </div>
                <div className="absolute -top-4 -right-4">
                  <Car className="w-16 h-16 text-primary-500 animate-bounce" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Oops! Page Not Found
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                The page you're looking for seems to have taken a detour. 
                Don't worry, let's get you back on track!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Maybe you were looking for:
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  href="/inventory"
                  className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                    <Car className="w-6 h-6 text-primary-600 group-hover:text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Browse Cars</h4>
                  <p className="text-gray-600 text-sm">Explore our extensive inventory</p>
                </Link>

                <Link
                  href="/sell"
                  className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary-600 transition-colors duration-300">
                    <Search className="w-6 h-6 text-secondary-600 group-hover:text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Sell Your Car</h4>
                  <p className="text-gray-600 text-sm">List your vehicle for sale</p>
                </Link>

                <Link
                  href="/contact"
                  className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors duration-300">
                    <Search className="w-6 h-6 text-green-600 group-hover:text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Get Help</h4>
                  <p className="text-gray-600 text-sm">Contact our support team</p>
                </Link>
              </div>
            </div>

            {/* Fun Message */}
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                Even the best cars sometimes take a wrong turn! 🚗💨
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
