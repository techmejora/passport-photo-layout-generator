import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, CheckCircle, Shield } from 'lucide-react';

export default function FeatureCards() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate professional passport photos in under 30 seconds',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: CheckCircle,
      title: 'Print Ready',
      description: 'High-resolution 300 DPI output with precise dimensions',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your images are processed securely and deleted after 24 hours',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {features.map((feature, index) => (
        <Card key={index} className="text-center border-0 shadow-sm">
          <CardContent className="p-8">
            <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-4`}>
              <feature.icon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
