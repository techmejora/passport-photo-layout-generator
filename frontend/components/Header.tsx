import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Menu, X, Crop, Maximize, Sparkles, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: null, color: 'from-pink-500 to-rose-500' },
    { name: 'Image Resizer', href: '/image-resizer', icon: Maximize, color: 'from-blue-500 to-cyan-500' },
    { name: 'Image Cropper', href: '/image-cropper', icon: Crop, color: 'from-green-500 to-emerald-500' },
    { name: 'Image Enhancer', href: '/image-enhancer', icon: Sparkles, color: 'from-purple-500 to-violet-500' },
    { name: 'Passport Photo', href: '/passport-photo', icon: Camera, color: 'from-orange-500 to-amber-500' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border-b border-purple-300 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                AutoImageResizer
              </h1>
              <p className="text-xs text-purple-100 hidden sm:block">
                Professional Image Processing Tools
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 ${
                    isActive(item.href)
                      ? 'bg-white text-purple-700 shadow-lg'
                      : 'text-white hover:bg-white/20 hover:backdrop-blur-sm'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
              <CreditCard className="h-4 w-4 mr-2" />
              Go Premium
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-purple-300">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-white text-purple-700 shadow-lg'
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-purple-300">
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Go Premium
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
