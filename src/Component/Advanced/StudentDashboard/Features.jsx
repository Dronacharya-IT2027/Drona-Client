import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BellIcon, EyeIcon } from "@heroicons/react/24/outline";

const Features = () => {
  // State to control visib
  // ility of last 2 cards
  const navigate = useNavigate();
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);

  const features = [
    {
      id: 1,
      title: "Smart Analytics",
      description: "Gain deep insights with AI-powered real-time analytics.",
      borderColor: "border-accent1",
      notifications: 3,
      visible: true,
      route: "/analytics" // Add route for each feature
    },
    {
      id: 2,
      title: "GD and Interview",
      description: "Effortlessly connect to your favorite platforms and tools.",
      borderColor: "border-accent2",
      notifications: 7,
      visible: true,
      route: "/GD-and-Interview"
    },
    {
      id: 3,
      title: "Enhanced Security",
      description: "Your data is protected with advanced encryption and access control.",
      borderColor: "border-secondary",
      notifications: 2,
      visible: true,
      route: "/security"
    },
    {
      id: 4,
      title: "Advanced Reporting",
      description: "Generate comprehensive reports with customizable metrics and filters.",
      borderColor: "border-accent1",
      notifications: 12,
      visible: showAdvancedFeatures,
      route: "/reporting"
    }
  ];

  const handleViewClick = (route) => {
    navigate(route);
  };

  return (
    <div className="w-full mt-8 min-h-screen bg-background">
      {/* Header positioned after navbar */}
      <div className="pt-8 pb-12 px-4 md:px-10">
        <h2 className="text-4xl font-bold text-primary text-center mb-2">
          Our Exciting Features
        </h2>
        <p className="text-secondary text-center text-lg mb-8">
          Discover powerful tools designed to enhance your experience
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="px-4 md:px-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
      {features
        .filter(feature => feature.visible)
        .map((feature) => (
          <div
            key={feature.id}
            className={`
              group
              p-6 
              bg-white 
              rounded-2xl 
              shadow-lg 
              hover:shadow-2xl 
              transition-all 
              duration-300 
              border-l-4 
              ${feature.borderColor}
              hover:scale-105
              hover:bg-gradient-to-r
              hover:from-white
              hover:to-gray-50
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-secondary mb-2 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-primary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              {/* Right side controls */}
              <div className="flex items-center space-x-3 ml-4">
                {/* Bell Icon with Badge */}
                <div className="relative">
                  <BellIcon className="h-6 w-6 text-secondary hover:text-primary cursor-pointer transition-colors duration-200" />
                  {feature.notifications > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {feature.notifications > 9 ? '9+' : feature.notifications}
                    </span>
                  )}
                </div>
                
                {/* View Button with Navigation */}
                <button 
                  onClick={() => handleViewClick(feature.route)}
                  className="flex items-center space-x-1 bg-primary hover:bg-secondary text-white px-3 py-1.5 rounded-lg transition-all duration-200 hover:shadow-md text-sm font-medium"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>View</span>
                </button>
              </div>
            </div>
            
            {/* Progress bar for visual appeal */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-4">
              <div 
                className={`h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ${feature.borderColor.replace('border-', 'from-')}`}
                style={{ width: `${Math.min(feature.notifications * 10, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
    </div>
        
        {/* Toggle Button for Advanced Features */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
            className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {showAdvancedFeatures ? 'Hide Advanced Features' : 'Show Advanced Features'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Features;
