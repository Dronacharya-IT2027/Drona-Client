import React from "react";
import ProfileCard from "../Component/Advanced/StudentDashboard/ProfileCard";
import Features from "../Component/Advanced/StudentDashboard/Features";

const StudentDashboard = () => {
  return (
    <section
      className="relative w-full mb-24 bg-cover bg-center bg-no-repeat font-kodchasan min-h-screen md:h-[150vh]"
      style={{
        backgroundImage: "url('/assests/1.png')",
      }}
    >
      {/* Flex wrapper for layout */}
      <div className="flex flex-col md:flex-row w-full h-auto md:h-full">
        {/* Left Side (Top on Mobile) */}
        <div className="w-full md:w-1/3 flex items-start justify-center ">
          <ProfileCard />
        </div>

        {/* Right Side (Bottom on Mobile) */}
        <div className="w-full md:w-2/3 flex items-center justify-center p-4">
          <Features />
        </div>
      </div>
    </section>
  );
};

export default StudentDashboard;
