import React from 'react';
import { Zap, Shield, Cloud, Smartphone, Download, Users } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process images in seconds with our optimized algorithms'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your images are processed securely and deleted after 24 hours'
    },
    {
      icon: Cloud,
      title: 'Cloud Processing',
      description: 'No software installation required. Works entirely in your browser'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Works perfectly on all devices - desktop, tablet, and mobile'
    },
    {
      icon: Download,
      title: 'High Quality Output',
      description: 'Maintain image quality with professional-grade processing'
    },
    {
      icon: Users,
      title: 'Batch Processing',
      description: 'Process multiple images at once to save time'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
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
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Icon className="h-8 w-8 text-blue-600" />
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
