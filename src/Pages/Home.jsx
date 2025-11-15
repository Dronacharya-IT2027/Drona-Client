import React from "react";
import Hero from "../Component/Advanced/Home/Hero";
import Services from "../Component/Advanced/Home/Services";
import CTASection from "../Component/Advanced/Home/CTASection";
import TestimonialSection from "../Component/Advanced/Home/TestimonialSection";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Home = () => {

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 200);
      }
    }
  }, [location]);

  return (
    <div className="w-full">
      <Hero />

   <div id="jobs"> 
      <Services />
      </div>

      <CTASection />

      <div id="testimonials">
        <TestimonialSection />
      </div>
    </div>
  );
};


export default Home;
