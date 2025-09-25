'use client';

import { Car, Users, Star, Award } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      icon: Car,
      number: '500+',
      label: 'Cars Sold',
      description: 'Happy customers with their dream cars'
    },
    {
      icon: Users,
      number: '1000+',
      label: 'Active Users',
      description: 'Trusted by car enthusiasts worldwide'
    },
    {
      icon: Star,
      number: '4.9',
      label: 'Rating',
      description: 'Based on customer reviews'
    },
    {
      icon: Award,
      number: '50+',
      label: 'Awards',
      description: 'Industry recognition and excellence'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              Thousands
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our community of satisfied customers who found their perfect vehicle through MotoCare
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                  {stat.number}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {stat.label}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
