import React from 'react';

const CTASection = () => {
  return (
    <div className="w-full bg-background py-8 md:py-12 lg:py-8 px-4">
      <div className="max-w-7xl mx-auto relative overflow-hidden min-h-screen md:min-h-[400px] lg:min-h-[280px]">
        
        {/* Responsive background images */}
        <div className="absolute inset-0 w-full h-full">
          {/* Desktop background - use bg-contain to fit image completely */}
          <div 
            className="hidden lg:block absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/assests/3.webp')" }}
          />
          
          {/* Tablet background */}
          <div 
            className="hidden md:block lg:hidden absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/assests/4.webp')" }}
          />
          
          {/* Mobile background */}
          <div 
            className="block md:hidden absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/assests/5.png')" }}
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex items-start md:items-center justify-start h-full min-h-screen md:min-h-[400px] lg:min-h-[280px] p-8 md:p-12 lg:p-16 pt-16 md:pt-8 lg:pt-16 lg:ml-24">
          
          {/* Left Content */}
          <div className="font-kodchasan max-w-lg text-center md:text-left space-y-4 md:space-y-6 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Ace your <span className="text-orange-500">placements</span>
              <br />
              with <span className="text-white">MOCK</span> tests
            </h2>

            {/* Hide paragraph on mobile, show on md and up */}
            <p className="hidden md:block text-gray-800 text-sm md:text-base lg:text-lg max-w-md mx-auto md:mx-0">
              Ready to crack your dream company? Our platform offers FREE mock tests, aptitude practice, coding challenges, and interview preparation to help you land your dream job.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl inline-block">
                Start Test
              </button>
              <button className="border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                View All Tests
              </button>
            </div>

            {/* Stats */}
            <div className="hidden md:flex gap-6 pt-4">
              {/* <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-700">Students Placed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-700">Mock Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-700">Success Rate</div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;