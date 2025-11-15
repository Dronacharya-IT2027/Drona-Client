import React from "react";
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 font-kodchasan">
          <div className="max-w-md w-full">
            {/* Avatar/Icon Container */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Decorative rings */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent1 to-secondary rounded-full opacity-20 animate-pulse blur-xl"></div>
                
                {/* Main avatar circle */}
                <div className="relative w-32 h-32 bg-gradient-to-br from-secondary to-accent1 rounded-full flex items-center justify-center shadow-2xl">
                  <div className="w-28 h-28 bg-primary rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-14 h-14 text-accent2" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary mb-3">
                Oops! Something Broke
              </h1>
              
              <p className="text-lg text-primary/70 mb-8 leading-relaxed">
                Don't worry, these things happen. Let's get you back on track.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Reload Page
                </button>
                
                <button
                  onClick={() => window.history.back()}
                  className="bg-accent1 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent1/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Go Back
                </button>
              </div>

              {/* Additional help text */}
              <p className="text-sm text-primary/50 mt-8">
                Error code: <span className="font-mono text-secondary">BOUNDARY_ERROR</span>
              </p>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="fixed top-10 right-10 w-64 h-64 bg-accent2/10 rounded-full blur-3xl -z-10"></div>
          <div className="fixed bottom-10 left-10 w-96 h-96 bg-accent1/10 rounded-full blur-3xl -z-10"></div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;