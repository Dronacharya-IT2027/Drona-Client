import React from "react";

import AptitudeTestPage from "../Component/Advanced/Test/AptitudeTest";
const Aptitest = () => {
  return (
    <section
      className="relative w-full mb-24 bg-cover bg-center bg-no-repeat font-kodchasan min-h-screen md:h-[150vh]"
      style={{
        backgroundImage: "url('/assests/1.png')",
      }}
    >
      <div>
        <AptitudeTestPage/>
      </div>
      
    </section>
  );
};

export default Aptitest;
