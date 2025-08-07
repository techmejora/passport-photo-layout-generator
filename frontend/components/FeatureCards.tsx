import React from 'react';
import { Zap, CheckCircle, Shield } from 'lucide-react';
import FeatureCard from './ui/FeatureCard';

export default function FeatureCards() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate professional passport photos in under 30 seconds',
      iconColor: 'bg-blue-100 text-blue-600'
    },
    {
      icon: CheckCircle,
      title: 'Print Ready',
      description: 'High-resolution 300 DPI output with precise dimensions',
      iconColor: 'bg-green-100 text-green-600'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your images are processed securely and deleted after 24 hours',
      iconColor: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          iconColor={feature.iconColor}
        />
      ))}
    </div>
  );
}
