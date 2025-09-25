'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Car, RefreshCw, Clock } from 'lucide-react';

const preferences = [
  {
    id: 'new',
    title: 'New Cars',
    description: 'Brand new vehicles with full warranty and latest features',
    icon: Car,
    href: '/inventory?condition=NEW',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    stats: '50+ Available',
  },
  {
    id: 'reconditioned',
    title: 'Reconditioned',
    description: 'Professionally restored vehicles with quality assurance',
    icon: RefreshCw,
    href: '/inventory?condition=RECONDITIONED',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    stats: '200+ Available',
  },
  {
    id: 'pre-owned',
    title: 'Pre-owned',
    description: 'Well-maintained used cars with detailed history reports',
    icon: Clock,
    href: '/inventory?condition=PRE_OWNED',
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    stats: '300+ Available',
  },
];

export function PreferenceChooser() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
              {' '}Preference
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Whether you're looking for a brand new vehicle or a carefully selected pre-owned car, 
            we have options to match every need and budget.
          </p>
        </div>

        {/* Preference Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {preferences.map((preference) => {
            const Icon = preference.icon;
            const isHovered = hoveredCard === preference.id;
            
            return (
              <Link
                key={preference.id}
                href={preference.href}
                className="group block"
                onMouseEnter={() => setHoveredCard(preference.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`
                  relative overflow-hidden rounded-2xl p-8 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl
                  ${preference.bgColor} border-2 border-transparent group-hover:border-primary-200
                `}>
                  {/* Background Gradient */}
                  <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300
                    bg-gradient-to-br ${preference.color}
                  `} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`
                      w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300
                      ${preference.bgColor} group-hover:scale-110
                    `}>
                      <Icon className={`w-8 h-8 ${preference.iconColor}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-700 transition-colors duration-300">
                      {preference.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {preference.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        {preference.stats}
                      </span>
                      
                      {/* Arrow */}
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                        ${preference.bgColor} group-hover:bg-primary-600 group-hover:text-white
                      `}>
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isHovered ? 'translate-x-1' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${preference.color} opacity-0 
                    group-hover:opacity-5 transition-opacity duration-300
                  `} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Not sure what you're looking for? Our experts are here to help.
          </p>
          <Link
            href="/contact"
            className="btn-outline text-lg px-8 py-4 inline-flex items-center space-x-2 group"
          >
            <span>Get Expert Advice</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
