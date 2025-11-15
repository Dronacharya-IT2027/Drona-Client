import { useState, useEffect } from "react";
import CertifiedTeachersBadge from "./CertifiedTeachersBadge";
import StatsCards from "./StatsCards";
import { Link } from "react-router-dom";


export default function Hero() {
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const updateBackground = () => {
      if (window.innerWidth >= 1024) {
        setBgImage("/hero/1.png");
      } else if (window.innerWidth >= 640) {
        setBgImage("/hero/2.png");
      } else {
        setBgImage("/hero/3.png");
      }
    };

    updateBackground();
    window.addEventListener("resize", updateBackground);
    return () => window.removeEventListener("resize", updateBackground);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Static Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative flex items-end md:items-center justify-center md:justify-start h-full px-6 pb-12 md:px-10 lg:px-24">
        <div className="font-kodchasan text-center md:text-left space-y-4 md:space-y-5 lg:space-y-6 max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight break-words">
            Unlock Your Future With <span className="text-secondary">Smart</span>{" "}
            <span className="text-accent1">Placement</span> Prep
          </h1>

          <p className="hidden md:block text-primary text-base md:text-lg leading-relaxed max-w-md">
            Prepare smarter for placements with aptitude, GD, and interview training all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4 sm:gap-6">
            <Link to="/dashboard">
            <button className="bg-secondary text-white px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 text-sm sm:text-base rounded-full font-semibold shadow-md hover:bg-orange-600 transition-all duration-200 border-2 border-primary backdrop-blur-sm">
              Get Started
            </button>
            </Link>
            <Link to="/blog"> 
            <button className="text-secondary mt-3 font-medium flex items-center space-x-2 text-sm sm:text-base hover:text-orange-600 transition-colors duration-200">
              <span>View our blog</span>
              <span className="text-lg sm:text-xl">↗</span>
            </button>
            </Link>
          </div>
        </div>
      </div>

      <CertifiedTeachersBadge />
      <StatsCards />
    </section>
  );
}