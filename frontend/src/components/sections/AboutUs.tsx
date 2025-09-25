'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Award, Users, Shield, Clock, CheckCircle, Star } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Quality Guaranteed',
    description: 'Every vehicle undergoes rigorous inspection and quality checks.',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Our experienced professionals ensure you get the best service.',
  },
  {
    icon: Award,
    title: 'Trusted Brand',
    description: 'Over 10 years of excellence in the automotive industry.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock customer support for all your needs.',
  },
];

const stats = [
  { number: '10+', label: 'Years Experience' },
  { number: '1000+', label: 'Happy Customers' },
  { number: '500+', label: 'Cars Sold' },
  { number: '4.9/5', label: 'Customer Rating' },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Car Buyer',
    content: 'MotoCare made my car buying experience seamless. The team was professional and helped me find exactly what I was looking for.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Car Seller',
    content: 'Selling my car through MotoCare was incredibly easy. They handled everything professionally and got me a great price.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Repeat Customer',
    content: 'I\'ve bought two cars from MotoCare and both experiences were excellent. Highly recommended!',
    rating: 5,
  },
];

export function AboutUs() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
              {' '}MotoCare?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're more than just a car marketplace. We're your trusted partner in finding the perfect vehicle 
            that matches your needs, budget, and lifestyle.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Your Trusted Automotive Partner
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                At MotoCare, we believe that buying or selling a car should be a transparent, 
                stress-free experience. Our platform connects you with premium vehicles and 
                provides the support you need every step of the way.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                With over a decade of experience in the automotive industry, we've built a 
                reputation for excellence, integrity, and customer satisfaction.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1926&q=80"
                alt="MotoCare team"
                width={600}
                height={400}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Floating Stats Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-6">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h3>
            <p className="text-lg text-gray-600">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center space-x-1 mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-700 italic leading-relaxed mb-6">
                "{testimonials[activeTestimonial].content}"
              </blockquote>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {testimonials[activeTestimonial].name}
                </div>
                <div className="text-gray-600">
                  {testimonials[activeTestimonial].role}
                </div>
              </div>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial
                      ? 'bg-primary-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
