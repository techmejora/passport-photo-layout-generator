import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
}

export default function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  iconColor 
}: FeatureCardProps) {
  return (
    <Card className="text-center border-0 shadow-sm">
      <CardContent className="p-8">
        <div className={`w-16 h-16 rounded-full ${iconColor} flex items-center justify-center mx-auto mb-4`}>
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
