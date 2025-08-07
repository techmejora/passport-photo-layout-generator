import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-cyan-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-400 rounded-full opacity-25 animate-bounce delay-1000"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-pink-400 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
            <span className="text-yellow-300 font-semibold text-lg">Professional Tools</span>
            <Zap className="h-8 w-8 text-yellow-300 animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Professional Image Processing
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent block mt-2">
              Made Simple & Colorful
            </span>
          </h1>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Resize, crop, enhance, and create passport photos with our powerful online tools. 
            Fast, secure, and professional-quality results in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Link to="/image-resizer">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-yellow-300">1M+</div>
              <div className="text-purple-100">Images Processed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-green-300">50K+</div>
              <div className="text-purple-100">Happy Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-cyan-300">99.9%</div>
              <div className="text-purple-100">Uptime</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-pink-300">4.9★</div>
              <div className="text-purple-100">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
