import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { BellIcon, EyeIcon } from "@heroicons/react/24/outline";
import axios from 'axios';

const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  '';

const Features = () => {
   
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false); // <-- new state

  const navigate = useNavigate();

  useEffect(() => {
    // Admin verification logic on mount
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
         setShowAdvancedFeatures(false);
          return;
        }

        const res = await axios.get(`${API_BASE}/api/auth/admin/tests`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data && res.data.success) {
         setShowAdvancedFeatures(true);
        } else {
         setShowAdvancedFeatures(false);
        }
      } catch (err) {
       setShowAdvancedFeatures(false);
      }
    };

    checkAdmin();
  }, []);

  const features = [
    {
      id: 1,
      title: "Aptitude & Mock Tests",
      description: "Practice topic-wise and full-length tests to boost your placement readiness.",
      borderColor: "border-accent1",
      notifications: 3,
      visible: true,
      route: "/aptitude-test"
    },
    {
      id: 2,
      title: "GD & Interview Prep",
      description: "Join GD rooms and prepare with mock interview questions and real-world scenarios.",
      borderColor: "border-accent2",
      notifications: 0,
      visible: true,
      route: "/GD-and-Interview"
    },
    {
      id: 3,
      title: "Coordinator Panel",
      description: "Manage tests, track student progress, and monitor all placement activities.",
      borderColor: "border-accent1",
      notifications: 12,
      visible: showAdvancedFeatures, // <-- only show if admin & advanced features ON
      route: "/admin"
    }
  ];

  const handleViewClick = (route) => {
    navigate(route);
  };

  return (
    <div className="w-full mt-8 min-h-screen  ">
      {/* Header positioned after navbar */}
      <div className="  ">
        <h2 className="text-4xl font-bold text-primary text-center mb-2">
          Your Career Readiness Dashboard
        </h2>
        <p className="text-secondary text-center text-lg mb-8">
         Explore essential modules for test, GD, and interview preparation
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
 onClick={() => feature.id !== 2 && handleViewClick(feature.route)}
 disabled={feature.id === 2}
 className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 
    ${feature.id === 2 
      ? "bg-gray-400 cursor-not-allowed text-gray-200" 
      : "bg-primary hover:bg-secondary text-white hover:shadow-md"
    }`}
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
                style={{ width: `100%` }}
              ></div>
            </div>
          </div>
        ))}
    </div>
        
        {/* Toggle Button for Advanced Features */}
        {/* <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
            className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {showAdvancedFeatures ? 'Hide Advanced Features' : 'Show Advanced Features'}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Features;
