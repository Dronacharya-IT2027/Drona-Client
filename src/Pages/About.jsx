import React from 'react';
import { Linkedin, Mail, Users, Target, Award } from 'lucide-react';
import { Link } from "react-router-dom";

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Adarsh Kumar",
      role: "Full Stack Developer",
      image: "/about/Adarsh-jha.jpg", // Replace with actual image path
      linkedin: "https://linkedin.com/in/adarsh-kumar",
      github: "https://github.com/adarsh-kumar",
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
      role: "Full Stack Developer & Project Manager",
      image: "/about/kishan-kumar.jpg", // Replace with actual image path
      linkedin: "https://linkedin.com/in/kishan-kumar",
      github: "https://github.com/kishan-kumar",
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
      image: "/about/Manas-Singh.png", // Replace with actual image path
      linkedin: "https://linkedin.com/in/manas-singh",
      github: "https://github.com/manas-singh",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 mt-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-kodchasan font-bold text-gray-900 mb-4"
          >
            Team <span className="text-orange-500">Dronacharya</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 font-kodchasan max-w-3xl mx-auto"
          >
            Building the future of placement preparation, one mock test at a time
          </motion.p>
        </div>

        {/* Project Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {projectHighlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center"
            >
              <div className="text-blue-600 mb-4 flex justify-center">
                {highlight.icon}
              </div>
              <h3 className="text-xl font-kodchasan font-bold text-gray-900 mb-3">
                {highlight.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {highlight.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Team Members Section */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-kodchasan font-bold text-center text-gray-900 mb-12"
          >
            Meet Our <span className="text-orange-500">Team</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.2 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300"
              >
                {/* Profile Image */}
                <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-lg">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        "Photo"
                      )}
                    </div>
                  </div>
                </div>

                {/* Member Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-kodchasan font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-orange-500 font-semibold mb-4">
                    {member.role}
                  </p>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Contributions */}
                  <div className="mb-4">
                    <h4 className="font-kodchasan font-semibold text-gray-900 mb-2">
                      Key Contributions:
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {member.contributions.map((contribution, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                          {contribution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-4 pt-4 border-t border-gray-200">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300"
                      title="LinkedIn"
                    >
                      <Linkedin size={20} />
                    </a>
                    
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-300"
                      title="Email"
                    >
                      <Mail size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Story Section */}
        {/* <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 mb-16"
        >
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-kodchasan font-bold text-gray-900 mb-6">
              Our <span className="text-orange-500">Story</span>
            </h2>
            <div className="text-lg text-gray-700 leading-relaxed space-y-4">
              <p>
                Team Dronacharya was born from our own struggles during placement season. 
                We experienced firsthand the challenges students face - lack of quality practice material, 
                expensive coaching institutes, and the anxiety of facing unknown interview patterns.
              </p>
              <p>
                Inspired by the legendary teacher Dronacharya from Indian mythology, who trained 
                the Pandavas and Kauravas in warfare, we aim to mentor today's students in their 
                battle for placements. Our platform is built on the principles of accessibility, 
                quality, and comprehensive preparation.
              </p>
              <p className="font-semibold text-gray-900">
                Together, we're revolutionizing how students prepare for their dream careers, 
                making quality placement preparation accessible to everyone, everywhere.
              </p>
            </div>
          </div>
        </motion.div> */}

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <h3 className="text-2xl md:text-3xl font-kodchasan font-bold text-gray-900 mb-4">
            Ready to start your placement journey?
          </h3>
          <Link to="/dashboard">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-kodchasan font-bold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
            Explore Mock Tests
          </button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

// Add motion components if not already imported
const motion = {
  h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
  p: ({ children, ...props }) => <p {...props}>{children}</p>,
  div: ({ children, ...props }) => <div {...props}>{children}</div>,
  h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>
};

export default About;