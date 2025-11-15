import React from "react";

const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
    <div className="relative w-32 h-32 flex items-center justify-center">
      
      <div className="absolute inset-0 rounded-full border-4 border-secondary/40 border-t-secondary animate-spin-slow"></div>

      <div className="absolute inset-2 rounded-full border-4 border-accent1/30 border-b-accent1 animate-spin-reverse"></div>

      <img 
        src="./loader.png"
        alt="Loading"
       className="w-24 h-24 object-cover rounded-full"

      />
    </div>
  </div>
);

export default Loader;