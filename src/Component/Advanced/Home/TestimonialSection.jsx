import React, { useState, useEffect } from 'react';

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
  {
    id: 1,
    name: "Adarsh Jha",
    role: "Placed at Google",
    company: "Software Engineer",
    image: "/path-to-testimonial-photo-1.jpg",
    text: "The mock tests perfectly simulated real interview conditions. I cracked 3 FAANG companies with consistent practice on this platform!",
    rating: 5,
    package: "₹42 LPA",
    preparationTime: "3 months"
  },
  {
    id: 2,
    name: "Sagar Kumar Jha",
    role: "Placed at Microsoft",
    company: "Frontend Developer",
    image: "/path-to-testimonial-photo-2.jpg",
    text: "The aptitude tests were spot-on! The DSA questions were exactly what I encountered in my actual interviews. Highly recommended!",
    rating: 5,
    package: "₹35 LPA",
    preparationTime: "4 months"
  },
  {
    id: 3,
    name: "Siddhart",
    role: "Placed at Amazon",
    company: "SDE 1",
    image: "/path-to-testimonial-photo-3.jpg",
    text: "From campus placements to Amazon - this platform's mock tests and coding challenges were crucial for my preparation journey.",
    rating: 5,
    package: "₹38 LPA",
    preparationTime: "5 months"
  },
  {
    id: 4,
    name: "Zishan Ansari",
    role: "Placed at Goldman Sachs",
    company: "Quantitative Analyst",
    image: "/path-to-testimonial-photo-4.jpg",
    text: "The quantitative aptitude tests helped me immensely. The platform's questions matched the actual difficulty level perfectly.",
    rating: 5,
    package: "₹45 LPA",
    preparationTime: "2 months"
  },
  {
    id: 5,
    name: "Aditya",
    role: "Placed at Adobe",
    company: "Product Manager",
    image: "/path-to-testimonial-photo-5.jpg",
    text: "The behavioral and HR mock interviews gave me the confidence to ace my final rounds. Excellent platform for holistic preparation!",
    rating: 5,
    package: "₹32 LPA",
    preparationTime: "3 months"
  },
  {
    id: 6,
    name: "Rohit Chaudhary",
    role: "Placed at Meta",
    company: "Data Scientist",
    image: "/path-to-testimonial-photo-6.jpg",
    text: "System design mock tests were incredibly detailed. The platform helped me transition from service-based to product-based company!",
    rating: 5,
    package: "₹40 LPA",
    preparationTime: "6 months"
  },
  {
    id: 7,
    name: "Riddhi Bansal",
    role: "Placed at Flipkart",
    company: "Backend Engineer",
    image: "/path-to-testimonial-photo-7.jpg",
    text: "The coding challenges and timed tests improved my problem-solving speed significantly. Landed my dream job in e-commerce!",
    rating: 5,
    package: "₹28 LPA",
    preparationTime: "4 months"
  },
  {
    id: 8,
    name: "Vanshav",
    role: "Placed at Uber",
    company: "Mobile Developer",
    image: "/path-to-testimonial-photo-8.jpg",
    text: "Platform's mock tests covered all important patterns. The detailed solutions helped me understand optimal approaches.",
    rating: 5,
    package: "₹36 LPA",
    preparationTime: "3 months"
  }
];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Large Screen Background */}
      <div
        className="hidden lg:block absolute inset-0 bg-cover bg-right bg-no-repeat"
        style={{
          backgroundImage: "url('/assests/2.webp')",
        }}
      ></div>

      {/* Medium Screen Background */}
      <div
        className="hidden md:block lg:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assests/7.webp')",
        }}
      ></div>

      {/* Small Screen Background */}
    <div
  className="block md:hidden absolute inset-0 bg-contain bg-top bg-no-repeat"
  style={{
    backgroundImage: "url('/assests/9.png')",
  }}
></div>


      {/* Content Layer */}
      <div className="h-full flex items-center justify-center md:justify-start relative z-10 sm:translate-y-0 -translate-y-36">
        <div className="w-full md:w-1/2 px-6 md:px-12 lg:px-16">
          
          {/* Left Side - Testimonial Carousel */}
          <div className="space-y-6 md:space-y-8 flex flex-col items-center md:items-start text-center md:text-left">
            {/* Title */}
            <div className="animate-fade-in">
              <h2 className="font-kodchasan text-3xl md:text-4xl lg:text-6xl font-bold text-primary mb-2">
                What <span className="text-secondary">They</span> Say
              </h2>
              <div className="w-20 md:w-24 h-1 bg-accent2 rounded-full mx-auto md:mx-0"></div>
            </div>

            {/* Testimonial Cards Carousel - Single Card Visible */}
            <div className="w-full max-w-sm sm:max-w-md md:max-w-xl relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-1000 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="min-w-full px-2 flex"
                    >
                      <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-7 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 w-full flex flex-col">
                        <div className="flex flex-col md:flex-row gap-4 sm:gap-5 md:gap-6">
                          {/* Left Content */}
                          <div className="flex-1 flex flex-col">
                            {/* Rating Stars */}
                            <div className="flex gap-1 mb-2 sm:mb-3 justify-center md:justify-start">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <svg
                                  key={i}
                                  className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-accent2"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="font-kodchasan text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg mb-3 sm:mb-4 leading-relaxed text-center md:text-left flex-1">
                              "{testimonial.text}"
                            </p>

                            {/* Author Info - Mobile */}
                            <div className="flex md:hidden items-center gap-3 justify-center mt-auto">
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-accent2">
                                <img 
                                  src={testimonial.image} 
                                  alt={testimonial.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-accent1 to-accent2 flex items-center justify-center text-white font-bold text-sm">${testimonial.name.charAt(0)}</div>`;
                                  }}
                                />
                              </div>
                              <div className="text-left">
                                <h4 className="font-kodchasan font-bold text-primary text-sm sm:text-base">
                                  {testimonial.name}
                                </h4>
                                <p className="font-kodchasan text-secondary text-xs">
                                  {testimonial.role}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Right Side - Photo Circle (Desktop only) */}
                          <div className="hidden md:flex flex-col items-center justify-between flex-shrink-0">
                            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden flex-shrink-0 border-3 border-accent2 shadow-md">
                              <img 
                                src={testimonial.image} 
                                alt={testimonial.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-accent1 to-accent2 flex items-center justify-center text-white font-bold text-2xl">${testimonial.name.charAt(0)}</div>`;
                                }}
                              />
                            </div>
                            <div className="text-center mt-3">
                              <h4 className="font-kodchasan font-bold text-primary text-base lg:text-lg">
                                {testimonial.name}
                              </h4>
                              {/* <p className="font-kodchasan text-secondary text-xs lg:text-sm">
                                {testimonial.role}
                              </p> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center md:justify-start gap-2 sm:gap-2.5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-7 sm:w-8 bg-secondary shadow-sm'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Empty space for desktop background */}
        <div className="hidden md:block md:w-1/2"></div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TestimonialSection;