import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Maximize, Crop, Sparkles, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ToolsSection() {
  const tools = [
    {
      icon: Maximize,
      title: 'Image Resizer',
      description: 'Resize images to any dimension while maintaining quality. Perfect for web and print.',
      href: '/image-resizer',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Crop,
      title: 'Image Cropper',
      description: 'Crop images with precision. Multiple aspect ratios and shapes available.',
      href: '/image-cropper',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: Sparkles,
      title: 'Image Enhancer',
      description: 'Enhance your photos with professional-grade adjustments and filters.',
      href: '/image-enhancer',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: Camera,
      title: 'Passport Photo Maker',
      description: 'Create professional passport photos with correct dimensions and backgrounds.',
      href: '/passport-photo',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Image Processing Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to process, edit, and optimize your images. 
            Professional results with just a few clicks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Card key={index} className={`${tool.bgColor} border-0 hover:shadow-lg transition-all duration-300 group`}>
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${tool.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {tool.description}
                  </p>
                  <Link to={tool.href}>
                    <Button variant="outline" className="group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                      Try Now
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
