import React from 'react';
import { Zap, Shield, Cloud, Smartphone, Download, Users } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process images in seconds with our optimized algorithms',
      gradient: 'from-yellow-400 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your images are processed securely and deleted after 24 hours',
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      icon: Cloud,
      title: 'Cloud Processing',
      description: 'No software installation required. Works entirely in your browser',
      gradient: 'from-blue-400 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Works perfectly on all devices - desktop, tablet, and mobile',
      gradient: 'from-purple-400 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      icon: Download,
      title: 'High Quality Output',
      description: 'Maintain image quality with professional-grade processing',
      gradient: 'from-indigo-400 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50'
    },
    {
      icon: Users,
      title: 'Batch Processing',
      description: 'Process multiple images at once to save time',
      gradient: 'from-pink-400 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Why Choose AutoImageResizer?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built for professionals and everyday users alike. 
            Fast, reliable, and easy to use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className={`bg-gradient-to-br ${feature.bgGradient} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-hover:-translate-y-2`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
