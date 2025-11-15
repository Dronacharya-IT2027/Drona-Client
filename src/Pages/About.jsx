import React, { useState, useEffect } from 'react';
import { Linkedin, Mail, Users, Target, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation } from "react-router-dom";
const About = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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

  const teamMembers = [
    {
      id: 1,
      name: "Adarsh Kumar",
      role: "Full Stack Developer",
      image: "/about/Adarsh-jha.jpg",
      linkedin: "https://linkedin.com/in/adarsh-kumar",
      email: "adarsh@dronacharya.com",
      contributions: [
        "Backend Architecture",
        "User Interface Design",
        "API Development"
      ],
      bio: "Passionate about building scalable web applications and solving complex problems with clean code."
    },
    {
      id: 2,
      name: "Kishan Kumar",
      role: "Full Stack Developer",
      image: "/about/kishan-kumar.jpg",
      linkedin: "https://linkedin.com/in/kishan-kumar",
      email: "kishan@dronacharya.com",
      contributions: [
        "Project Management",
        "React Development",
        "Deployment",
      ],
      bio: "Creative developer focused on creating intuitive user experiences and pixel-perfect designs."
    },
    {
      id: 3,
      name: "Manas Singh",
      role: "Full Stack Developer",
      image: "/about/Manas-Singh.png",
      linkedin: "https://linkedin.com/in/manas-singh",
      email: "manas@dronacharya.com",
      contributions: [
        "Project Management",
        "Full Stack Development",
        "System Architecture"
      ],
      bio: "Experienced in end-to-end project development with a focus on delivering robust solutions."
    }
  ];

  const projectHighlights = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Our Mission",
      description: "To democratize placement preparation by providing free, high-quality mock tests and learning resources to students across India."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "For Students, By Students",
      description: "Built by students who understand the challenges of placement season, ensuring our platform addresses real pain points."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "What We Offer",
      description: "Comprehensive mock tests, coding challenges, aptitude practice, and interview preparation for top tech companies."
    }
  ];

  // Auto-rotate every 10 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % teamMembers.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const getCirclePosition = (index) => {
    const totalMembers = teamMembers.length;
    const angle = (index - activeIndex) * (360 / totalMembers);
    const radius = 350; // Increased radius for better visibility
    const angleRad = (angle * Math.PI) / 180;
    
    return {
      x: Math.sin(angleRad) * radius,
      y: -Math.cos(angleRad) * radius,
      isActive: index === activeIndex
    };
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const activeMember = teamMembers[activeIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
     <div className="text-center mb-16 mt-16">
  <h1 className="text-4xl md:text-6xl font-kodchasan font-bold text-primary mb-4 animate-fade-in">
    Team <span className="text-secondary">Dronacharya</span>
  </h1>
  <p className="text-xl md:text-2xl text-gray-700 font-kodchasan max-w-3xl mx-auto">
    Empowering students with smarter tools, guidance, and mock tests for placement success.
  </p>
</div>


   

        {/* Team Members Circular Carousel Section */}
        <div className="mb-20">
         
          <div className="relative">
            {/* Circular Carousel Container */}
            <div className="relative h-[800px] lg:-mt-36 flex items-center justify-center">
              
              {/* Center - Active Member (Large) */}
              <div className="absolute z-50 flex flex-col items-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div 
                  key={activeMember.id}
                  className="animate-scale-in flex flex-col items-center"
                >
                  {/* Large Center Circle with Image */}
                  <div className="rounded-full overflow-hidden border-8 border-secondary w-64 h-64 shadow-2xl shadow-secondary/40 mb-6">
                    <div className="w-full h-full bg-gradient-to-br from-accent1/30 to-accent2/30 flex items-center justify-center">
                      {activeMember.image ? (
                        <img 
                          src={activeMember.image} 
                          alt={activeMember.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-8xl font-bold text-white">
                          {activeMember.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name and Role */}
                  <div className="text-center mb-4">
                    <h3 className="text-3xl font-kodchasan font-bold text-primary mb-2">
                      {activeMember.name}
                    </h3>
                    <p className="text-secondary font-semibold text-xl font-kodchasan">
                      {activeMember.role}
                    </p>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center items-center space-x-4">
                    <a
                      href={activeMember.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 shadow-lg"
                      title="LinkedIn"
                    >
                      <Linkedin size={24} />
                    </a>
                    
                    <a
                      href={`mailto:${activeMember.email}`}
                      className="p-4 bg-secondary text-white rounded-full hover:bg-orange-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                      title="Email"
                    >
                      <Mail size={24} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Rotating Team Member Circles (Smaller) */}
              <div className="absolute w-full h-full">
                {teamMembers.map((member, index) => {
                  const pos = getCirclePosition(index);
                  const isActive = pos.isActive;
                  
                  return (
                    <div
                      key={member.id}
                      className={`absolute transition-all duration-700 ease-in-out cursor-pointer ${
                        isActive ? 'opacity-0 pointer-events-none' : 'opacity-100 z-10'
                      }`}
                      style={{
                        transform: `translate(${pos.x}px, ${pos.y}px)`,
                        left: '50%',
                        top: '50%',
                        marginLeft: '-90px',
                        marginTop: '-90px'
                      }}
                      onClick={() => {
                        setActiveIndex(index);
                        setIsAutoPlaying(false);
                      }}
                    >
                      <div 
                        className="rounded-full overflow-hidden border-4 border-accent1 w-44 h-44 shadow-2xl shadow-accent1/30 hover:scale-110 hover:border-secondary transition-all duration-300"
                      >
                        <div className="w-full h-full bg-gradient-to-br from-accent1/30 to-accent2/30 flex items-center justify-center">
                          {member.image ? (
                            <img 
                              src={member.image} 
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-5xl font-bold text-white">
                              {member.name.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Name label */}
                      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <p className="text-sm font-bold text-gray-700 font-kodchasan">{member.name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-4 bg-white rounded-full shadow-xl hover:bg-secondary hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Previous team member"
              >
                <ChevronLeft size={28} className="text-gray-700" />
              </button>
              
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-4 bg-white rounded-full shadow-xl hover:bg-secondary hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Next team member"
              >
                <ChevronRight size={28} className="text-gray-700" />
              </button>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center space-x-3 mt-8">
              {teamMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'bg-secondary w-10 h-3' 
                      : 'bg-gray-300 hover:bg-gray-400 w-3 h-3'
                  }`}
                  aria-label={`Go to team member ${index + 1}`}
                />
              ))}
            </div>

            {/* Auto-play indicator */}
            <div className="text-center mt-4">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-kodchasan"
              >
                {isAutoPlaying ? '⏸ Pause auto-rotate' : '▶ Resume auto-rotate'}
              </button>
            </div>
          </div>
        </div>
        
              {/* Project Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {projectHighlights.map((highlight, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-accent1/20 text-center transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-secondary mb-4 flex justify-center transform hover:scale-110 transition-transform duration-300">
                {highlight.icon}
              </div>
              <h3 className="text-xl font-kodchasan font-bold text-primary mb-3">
                {highlight.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>
     {/* Contact Section */}
<section id="contact" className="text-center lg:mt-24 mb-24 animate-fade-in">
  <h3 className="text-2xl md:text-3xl font-kodchasan font-bold text-primary mb-4">
    Have a suggestion or facing an issue?
  </h3>

  <button
    onClick={() => setIsContactModalOpen(true)}
    className="bg-secondary hover:bg-orange-600 text-white font-kodchasan font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
  >
    Contact Us
  </button>
</section>


      </div>
       {/* Contact Modal */}
{isContactModalOpen && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-lg p-8 relative animate-fade-in">

      {/* Close Button */}
      <button
        onClick={() => setIsContactModalOpen(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
      >
        ✕
      </button>

      <h2 className="text-2xl font-kodchasan font-bold text-primary mb-6 text-center">
        Contact Us
      </h2>

      <form className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-primary font-semibold mb-1 font-kodchasan">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Your email"
            className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary focus:outline-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-primary font-semibold mb-1 font-kodchasan">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="Your phone number"
            className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary focus:outline-none"
          />
        </div>

        {/* Issue / Suggestion */}
        <div>
          <label className="block text-primary font-semibold mb-1 font-kodchasan">
            Your Issue / Suggestion
          </label>
          <textarea
            rows="4"
            placeholder="Describe your issue or suggestion"
            className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary focus:outline-none"
          ></textarea>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="w-full bg-secondary hover:bg-orange-600 text-white font-kodchasan font-bold py-3 rounded-xl transition-all"
        >
          Send Message
        </button>
      </form>
    </div>

  </div>
)}


      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.7s ease-out;
        }
      `}</style>
    </div>
  );
};

export default About;