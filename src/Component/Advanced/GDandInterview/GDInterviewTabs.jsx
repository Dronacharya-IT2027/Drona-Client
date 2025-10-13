import React, { useState } from 'react';
import { CalendarX, Clock } from 'lucide-react';
import { GDLeftSection, GDRightSection } from "./GDSection";
import { InterviewLeftSection, InterviewRightSection } from "./InterviewSection";

// Skeleton component for not scheduled state
const SkeletonNotScheduled = ({ type, onSchedule }) => {
  const isGD = type === 'gd';
  
  return (
    <div className="flex items-center justify-center min-h-[400px] sm:min-h-[450px] md:min-h-[500px] p-4 sm:p-6">
      <div className="text-center max-w-md">
        <div className="mb-4 sm:mb-6 flex justify-center">
          <div className="relative">
            <CalendarX className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 text-accent1 opacity-50" />
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-secondary absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 animate-pulse" />
          </div>
        </div>
        
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-kodchasan font-bold text-primary mb-2 sm:mb-3 md:mb-4">
          {isGD ? 'No GD Scheduled Yet' : 'No Interview Scheduled Yet'}
        </h3>
        
        <p className="text-xs sm:text-sm md:text-base lg:text-lg font-kodchasan text-primary/60 mb-4 sm:mb-6 md:mb-8 px-4">
          {isGD 
            ? 'Your group discussion session will appear here once scheduled.'
            : 'Your interview details will appear here once scheduled.'}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs md:text-sm font-kodchasan text-primary/50">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent1 rounded-full animate-pulse"></div>
            <span>Check back later for updates</span>
          </div>
          
          {/* Demo toggle button */}
          <button
            onClick={onSchedule}
            className="mt-3 sm:mt-4 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 bg-gradient-to-r from-secondary to-accent1 text-white text-xs sm:text-sm md:text-base font-kodchasan rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            View Scheduled {isGD ? 'GD' : 'Interview'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component with Tabs
const GDInterviewTabs = () => {
  const [activeTab, setActiveTab] = useState('gd');
  const [isGDScheduled, setIsGDScheduled] = useState(false);
  const [isInterviewScheduled, setIsInterviewScheduled] = useState(false);

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 font-kodchasan">
      <div className="max-w-7xl mx-auto">
        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 justify-center sm:justify-start">
          <button
            onClick={() => setActiveTab("gd")}
            className={`px-3 sm:px-5 lg:px-6 py-2 sm:py-3 rounded-t-lg font-semibold text-sm sm:text-base lg:text-lg transition-all ${
              activeTab === "gd"
                ? "bg-secondary text-white"
                : "bg-white text-primary hover:bg-gray-100"
            }`}
          >
            Group Discussion
          </button>
          <button
            onClick={() => setActiveTab("interview")}
            className={`px-3 sm:px-5 lg:px-6 py-2 sm:py-3 rounded-t-lg font-semibold text-sm sm:text-base lg:text-lg transition-all ${
              activeTab === "interview"
                ? "bg-accent1 text-white"
                : "bg-white text-primary hover:bg-gray-100"
            }`}
          >
            Interview
          </button>
        </div>

        {/* Main Content Container */}
        <div className="bg-gradient-to-br from-accent2/20 to-accent1/20 backdrop-blur-sm rounded-lg border-2 border-primary/10 shadow-xl overflow-hidden relative">
          <div className="flex flex-col lg:flex-row min-h-[400px] sm:min-h-[450px] md:min-h-[500px]">
            {activeTab === "gd" ? (
              isGDScheduled ? (
                <>
                  {/* Left: 60% on lg+ */}
                  <div className="w-full lg:w-[60%] p-3 sm:p-4 md:p-6">
                    <GDLeftSection />
                  </div>
                  {/* Right: 40% on lg+ */}
                  <div className="w-full lg:w-[40%] p-3 sm:p-4 md:p-6 border-t lg:border-t-0 lg:border-l border-primary/10">
                    <GDRightSection />
                  </div>
                  
                  {/* Demo toggle button */}
                  <button
                    onClick={() => setIsGDScheduled(false)}
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 px-2 sm:px-3 py-1 bg-accent1/20 text-accent1 text-[10px] sm:text-xs font-kodchasan rounded hover:bg-accent1/30 transition-all z-10"
                  >
                    Show Skeleton
                  </button>
                </>
              ) : (
                <SkeletonNotScheduled 
                  type="gd" 
                  onSchedule={() => setIsGDScheduled(true)} 
                />
              )
            ) : (
              isInterviewScheduled ? (
                <>
                  <div className="w-full lg:w-[60%] p-3 sm:p-4 md:p-6">
                    <InterviewLeftSection />
                  </div>
                  <div className="w-full lg:w-[40%] p-3 sm:p-4 md:p-6 border-t lg:border-t-0 lg:border-l border-primary/10">
                    <InterviewRightSection />
                  </div>
                  
                  {/* Demo toggle button */}
                  <button
                    onClick={() => setIsInterviewScheduled(false)}
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 px-2 sm:px-3 py-1 bg-accent1/20 text-accent1 text-[10px] sm:text-xs font-kodchasan rounded hover:bg-accent1/30 transition-all z-10"
                  >
                    Show Skeleton
                  </button>
                </>
              ) : (
                <SkeletonNotScheduled 
                  type="interview" 
                  onSchedule={() => setIsInterviewScheduled(true)} 
                />
              )
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-primary/60 text-xs sm:text-sm md:text-base lg:text-lg">
            Switch between tabs to manage your preparation
          </p>
        </div>
      </div>
    </div>
  );
};

export default GDInterviewTabs;