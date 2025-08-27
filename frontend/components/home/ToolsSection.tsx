import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Maximize, Crop, Sparkles, Camera, Video, IdCard, Eraser } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ToolsSection() {
  const tools = [
    {
      icon: Maximize,
      title: 'Image Resizer',
      description: 'Resize images to any dimension while maintaining quality. Perfect for web and print.',
      href: '/image-resizer',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      iconBg: 'from-blue-600 to-cyan-600',
      hoverShadow: 'hover:shadow-blue-500/25'
    },
    {
      icon: Crop,
      title: 'Image Cropper',
      description: 'Crop images with precision. Multiple aspect ratios and shapes available.',
      href: '/image-cropper',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      bgGradient: 'from-green-50 to-emerald-50',
      iconBg: 'from-green-600 to-emerald-600',
      hoverShadow: 'hover:shadow-green-500/25'
    },
    {
      icon: Sparkles,
      title: 'Image Enhancer',
      description: 'Enhance your photos with professional-grade adjustments and filters.',
      href: '/image-enhancer',
      gradient: 'from-purple-500 via-violet-500 to-indigo-500',
      bgGradient: 'from-purple-50 to-violet-50',
      iconBg: 'from-purple-600 to-violet-600',
      hoverShadow: 'hover:shadow-purple-500/25'
    },
    {
      icon: Eraser,
      title: 'Background Remover',
      description: 'Remove backgrounds from images instantly using AI. Perfect for product photos.',
      href: '/background-remover',
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      bgGradient: 'from-orange-50 to-red-50',
      iconBg: 'from-orange-600 to-red-600',
      hoverShadow: 'hover:shadow-orange-500/25'
    },
    {
      icon: Camera,
      title: 'Passport Photo Maker',
      description: 'Create professional passport photos with correct dimensions and backgrounds.',
      href: '/passport-photo',
      gradient: 'from-amber-500 via-yellow-500 to-orange-500',
      bgGradient: 'from-amber-50 to-yellow-50',
      iconBg: 'from-amber-600 to-yellow-600',
      hoverShadow: 'hover:shadow-amber-500/25'
    },
    {
      icon: Video,
      title: 'Video Converter',
      description: 'Convert videos to any format, compress, and extract audio with ease.',
      href: '/video-converter',
      gradient: 'from-red-500 via-pink-500 to-rose-500',
      bgGradient: 'from-red-50 to-pink-50',
      iconBg: 'from-red-600 to-pink-600',
      hoverShadow: 'hover:shadow-red-500/25'
    },
    {
      icon: IdCard,
      title: 'PVC Card Maker',
      description: 'Design and create professional ID cards, business cards, and membership cards.',
      href: '/pvc-card-maker',
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      bgGradient: 'from-indigo-50 to-purple-50',
      iconBg: 'from-indigo-600 to-purple-600',
      hoverShadow: 'hover:shadow-indigo-500/25'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Powerful Media Processing Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to process, edit, and optimize your images and videos. 
            Professional results with just a few clicks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Card key={index} className={`bg-gradient-to-br ${tool.bgGradient} border-0 hover:shadow-2xl ${tool.hoverShadow} transition-all duration-500 group transform hover:scale-105 hover:-translate-y-2`}>
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${tool.iconBg} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {tool.description}
                  </p>
                  <Link to={tool.href}>
                    <Button className={`bg-gradient-to-r ${tool.gradient} hover:shadow-lg text-white font-semibold transform hover:scale-105 transition-all duration-300`}>
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
