import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Menu, X, Crop, Maximize, Sparkles, CreditCard, Video, IdCard, Crown, ChevronDown, Image, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useAuth } from '../hooks/useAuth';
import UserButton from './auth/UserButton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isSignedIn } = useAuth();

  const imageTools = [
    { name: 'Image Resizer', href: '/image-resizer', icon: Maximize, description: 'Resize images to any dimension' },
    { name: 'Image Cropper', href: '/image-cropper', icon: Crop, description: 'Crop images with precision' },
    { name: 'Image Enhancer', href: '/image-enhancer', icon: Sparkles, description: 'Enhance photos with filters' },
    { name: 'Passport Photo', href: '/passport-photo', icon: Camera, description: 'Create passport photos' },
  ];

  const videoTools = [
    { name: 'Video Converter', href: '/video-converter', icon: Video, description: 'Convert video formats' },
  ];

  const cardTools = [
    { name: 'PVC Card Maker', href: '/pvc-card-maker', icon: IdCard, description: 'Design professional cards' },
  ];

  const isActive = (href: string) => location.pathname === href;

  const isToolActive = (tools: typeof imageTools) => {
    return tools.some(tool => location.pathname === tool.href);
  };

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
                Professional Image & Video Processing Tools
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Home */}
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 ${
                isActive('/')
                  ? 'bg-white text-purple-700 shadow-lg'
                  : 'text-white hover:bg-white/20 hover:backdrop-blur-sm'
              }`}
            >
              <span>Home</span>
            </Link>

            {/* Image Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 ${
                    isToolActive(imageTools)
                      ? 'bg-white text-purple-700 shadow-lg'
                      : 'text-white hover:bg-white/20 hover:backdrop-blur-sm'
                  }`}
                >
                  <Image className="h-4 w-4" />
                  <span>Image Tools</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white shadow-xl border-0 rounded-lg">
                {imageTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <DropdownMenuItem key={tool.name} asChild>
                      <Link
                        to={tool.href}
                        className="flex items-start space-x-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                      >
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{tool.name}</div>
                          <div className="text-sm text-gray-500">{tool.description}</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Video Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 ${
                    isToolActive(videoTools)
                      ? 'bg-white text-purple-700 shadow-lg'
                      : 'text-white hover:bg-white/20 hover:backdrop-blur-sm'
                  }`}
                >
                  <Play className="h-4 w-4" />
                  <span>Video Tools</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white shadow-xl border-0 rounded-lg">
                {videoTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <DropdownMenuItem key={tool.name} asChild>
                      <Link
                        to={tool.href}
                        className="flex items-start space-x-3 p-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200"
                      >
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg">
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{tool.name}</div>
                          <div className="text-sm text-gray-500">{tool.description}</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Card Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 ${
                    isToolActive(cardTools)
                      ? 'bg-white text-purple-700 shadow-lg'
                      : 'text-white hover:bg-white/20 hover:backdrop-blur-sm'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Card Tools</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white shadow-xl border-0 rounded-lg">
                {cardTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <DropdownMenuItem key={tool.name} asChild>
                      <Link
                        to={tool.href}
                        className="flex items-start space-x-3 p-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200"
                      >
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{tool.name}</div>
                          <div className="text-sm text-gray-500">{tool.description}</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* CTA Button and User */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/pricing">
              <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
                <Crown className="h-4 w-4 mr-2" />
                Go Premium
              </Button>
            </Link>
            <UserButton />
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
              {/* Home */}
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive('/')
                    ? 'bg-white text-purple-700 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <span>Home</span>
              </Link>

              {/* Image Tools Section */}
              <div className="px-4 py-2">
                <div className="flex items-center space-x-2 text-purple-100 text-xs font-semibold uppercase tracking-wide mb-2">
                  <Image className="h-3 w-3" />
                  <span>Image Tools</span>
                </div>
                <div className="space-y-1 ml-4">
                  {imageTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.name}
                        to={tool.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          isActive(tool.href)
                            ? 'bg-white text-purple-700 shadow-lg'
                            : 'text-white hover:bg-white/20'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tool.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Video Tools Section */}
              <div className="px-4 py-2">
                <div className="flex items-center space-x-2 text-purple-100 text-xs font-semibold uppercase tracking-wide mb-2">
                  <Play className="h-3 w-3" />
                  <span>Video Tools</span>
                </div>
                <div className="space-y-1 ml-4">
                  {videoTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.name}
                        to={tool.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          isActive(tool.href)
                            ? 'bg-white text-purple-700 shadow-lg'
                            : 'text-white hover:bg-white/20'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tool.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Card Tools Section */}
              <div className="px-4 py-2">
                <div className="flex items-center space-x-2 text-purple-100 text-xs font-semibold uppercase tracking-wide mb-2">
                  <CreditCard className="h-3 w-3" />
                  <span>Card Tools</span>
                </div>
                <div className="space-y-1 ml-4">
                  {cardTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.name}
                        to={tool.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          isActive(tool.href)
                            ? 'bg-white text-purple-700 shadow-lg'
                            : 'text-white hover:bg-white/20'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tool.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Mobile CTA and Auth */}
              <div className="pt-4 border-t border-purple-300 space-y-2">
                <Link to="/pricing" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold">
                    <Crown className="h-4 w-4 mr-2" />
                    Go Premium
                  </Button>
                </Link>
                <div className="flex justify-center pt-2">
                  <UserButton />
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
