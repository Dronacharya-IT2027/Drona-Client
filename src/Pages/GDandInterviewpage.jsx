import React from "react";
import GDInterviewTabs from "../Component/Advanced/GDandInterview/GDInterviewTabs";

const GDandInterviewpage = () => {
  return (
    <section
     className="relative w-full pt-16 md:mb-56 bg-cover bg-center bg-no-repeat font-kodchasan min-h-screen md:h-[150vh]"

      style={{
        backgroundImage: "url('/assests/1.png')",
      }}
    >
     <GDInterviewTabs/>
    </section>
  );
};

export default GDandInterviewpage;
