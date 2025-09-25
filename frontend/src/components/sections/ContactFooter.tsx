'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function ContactFooter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      toast.success('Successfully subscribed to our newsletter!');
    }, 1000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Auto Street', 'Car City, CC 12345', 'United States'],
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543', 'Mon-Fri: 9AM-6PM'],
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@motocare.com', 'support@motocare.com', 'sales@motocare.com'],
    },
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', color: 'hover:text-blue-600' },
    { name: 'Twitter', href: '#', color: 'hover:text-blue-400' },
    { name: 'Instagram', href: '#', color: 'hover:text-pink-600' },
    { name: 'LinkedIn', href: '#', color: 'hover:text-blue-700' },
    { name: 'YouTube', href: '#', color: 'hover:text-red-600' },
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Side - Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Get In
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                  {' '}Touch
                </span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Ready to find your perfect car or sell your current one? 
                Our team of experts is here to help you every step of the way.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {info.title}
                      </h3>
                      <div className="space-y-1">
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-300">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Follow Us
              </h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`text-gray-400 transition-colors duration-200 ${social.color}`}
                    aria-label={social.name}
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Newsletter & CTA */}
          <div className="space-y-8">
            {/* Newsletter Subscription */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex items-center space-x-2 mb-4">
                <Mail className="w-6 h-6 text-primary-400" />
                <h3 className="text-2xl font-bold text-white">
                  Stay Updated
                </h3>
              </div>
              <p className="text-gray-300 mb-6">
                Subscribe to our newsletter for the latest car listings, 
                automotive news, and exclusive offers.
              </p>
              
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="spinner w-5 h-5" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Subscribe Now</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 flex items-center space-x-2 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No spam, unsubscribe at any time</span>
              </div>
            </div>

            {/* CTA Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-center">
                <h4 className="text-xl font-bold text-white mb-3">
                  Ready to Buy?
                </h4>
                <p className="text-primary-100 mb-4">
                  Browse our extensive inventory of premium vehicles
                </p>
                <a
                  href="/inventory"
                  className="inline-block bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  View Inventory
                </a>
              </div>

              <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl p-6 text-center">
                <h4 className="text-xl font-bold text-white mb-3">
                  Want to Sell?
                </h4>
                <p className="text-secondary-100 mb-4">
                  Get the best price for your car with our expert service
                </p>
                <a
                  href="/sell"
                  className="inline-block bg-white text-secondary-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  Sell Your Car
                </a>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                Why Choose MotoCare?
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Quality Guaranteed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Expert Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Secure Transactions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">24/7 Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
