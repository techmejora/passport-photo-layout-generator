import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const tools = [
    { name: 'Image Resizer', href: '/image-resizer' },
    { name: 'Image Cropper', href: '/image-cropper' },
    { name: 'Image Enhancer', href: '/image-enhancer' },
    { name: 'Passport Photo Maker', href: '/passport-photo' },
    { name: 'Video Converter', href: '/video-converter' },
  ];

  const company = [
    { name: 'About Us', href: '/about' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">AutoImageResizer</h3>
                <p className="text-sm text-gray-400">Professional Tools</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional image and video processing tools for resizing, cropping, enhancing, and converting. Fast, secure, and easy to use.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tools</h4>
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li key={tool.name}>
                  <Link
                    to={tool.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>support@autoimageresizer.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 AutoImageResizer.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
