'use client';

import { Star, Quote } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Car Owner',
      image: '/api/placeholder/60/60',
      rating: 5,
      text: 'MotoCare made selling my car incredibly easy. The process was smooth, and I got a great price. Highly recommended!',
      location: 'New York, NY'
    },
    {
      name: 'Michael Chen',
      role: 'Auto Shop Owner',
      image: '/api/placeholder/60/60',
      rating: 5,
      text: 'As a shop owner, MotoCare has helped me reach more customers and sell more cars. The platform is intuitive and effective.',
      location: 'Los Angeles, CA'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Car Buyer',
      image: '/api/placeholder/60/60',
      rating: 5,
      text: 'Found my dream car through MotoCare. The verification process gave me confidence in my purchase. Excellent service!',
      location: 'Miami, FL'
    },
    {
      name: 'David Thompson',
      role: 'Vendor',
      image: '/api/placeholder/60/60',
      rating: 5,
      text: 'The wholesale features on MotoCare have revolutionized my business. Great platform for professional dealers.',
      location: 'Chicago, IL'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              Customers Say
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what real customers have to say about their MotoCare experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative"
            >
              <div className="absolute top-6 right-6 text-primary-200 group-hover:text-primary-300 transition-colors duration-300">
                <Quote className="w-8 h-8" />
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <blockquote className="text-gray-700 leading-relaxed italic">
                "{testimonial.text}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
