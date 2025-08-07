import React from 'react';

export default function StatsSection() {
  const stats = [
    { number: '1,000,000+', label: 'Images Processed', color: 'text-yellow-300' },
    { number: '50,000+', label: 'Happy Users', color: 'text-green-300' },
    { number: '99.9%', label: 'Uptime', color: 'text-cyan-300' },
    { number: '4.9/5', label: 'User Rating', color: 'text-pink-300' }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-20 w-32 h-32 bg-yellow-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-cyan-400 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-green-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Join millions of users who trust AutoImageResizer for their image processing needs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300">
              <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                {stat.number}
              </div>
              <div className="text-purple-100 text-lg">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
