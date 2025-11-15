import React from 'react';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 font-kodchasan">
      <div className="max-w-md lg:mt-20 w-full">
        {/* Avatar/Icon Container */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Decorative rings */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent2 to-accent1 rounded-full opacity-20 animate-pulse blur-xl"></div>
            
            {/* Main avatar circle */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-accent1 to-accent2 rounded-full flex items-center justify-center shadow-2xl">
              <div className="w-28 h-28 bg-primary rounded-full flex items-center justify-center">
                <Search className="w-14 h-14 text-secondary" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          {/* 404 Number */}
          <div className="text-8xl font-bold bg-gradient-to-r from-secondary via-accent1 to-accent2 bg-clip-text text-transparent mb-4">
            404
          </div>
          
          <h1 className="text-4xl font-bold text-primary mb-3">
            Page Not Found
          </h1>
          
          <p className="text-lg text-primary/70 mb-8 leading-relaxed">
            Oops! Looks like this page took a detour. Let's get you somewhere familiar.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.href = '/'}
              className="bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </button>
            
            <button
              onClick={() => window.history.back()}
              className="bg-accent1 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent1/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Additional help text */}
          <p className="text-sm text-primary/50 mt-8">
            Error code: <span className="font-mono text-secondary">404_NOT_FOUND</span>
          </p>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="fixed top-10 right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-10 left-10 w-96 h-96 bg-accent1/10 rounded-full blur-3xl -z-10"></div>
    </div>
  );
}