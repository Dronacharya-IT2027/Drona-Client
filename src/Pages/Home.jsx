import React from "react";
import Hero from "../Component/Advanced/Home/Hero";
import Services from "../Component/Advanced/Home/Services";
import CTASection from "../Component/Advanced/Home/CTASection";
import TestimonialSection from "../Component/Advanced/Home/TestimonialSection";
const Home = () => {
  return (
    <div className="w-full">
       
     
      <Hero />
      <Services/>
      <CTASection/>
      <TestimonialSection/>
    
    </div>
  );
};

export default Home;
