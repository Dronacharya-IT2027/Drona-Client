import React, { useState , useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Course data
const courses = [
  {
    id: 1,
    title: 'Creative Writing for Beginners',
    category: 'Marketing',
    bgColor: 'bg-purple-300',
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect x="40" y="80" width="60" height="80" fill="#1a1a1a" rx="4"/>
        <rect x="50" y="90" width="40" height="30" fill="#f7f7f5" rx="2"/>
        <rect x="50" y="125" width="40" height="3" fill="#f7f7f5" rx="1"/>
        <rect x="50" y="132" width="30" height="3" fill="#f7f7f5" rx="1"/>
        <circle cx="150" cy="100" r="25" fill="#f7f7f5"/>
        <path d="M 150 110 Q 140 130, 130 150" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="155" cy="95" r="3" fill="#1a1a1a"/>
        <path d="M 145 95 Q 150 90, 155 95" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
        <line x1="120" y1="60" x2="130" y2="50" stroke="#1a1a1a" strokeWidth="2"/>
        <line x1="140" y1="55" x2="145" y2="45" stroke="#1a1a1a" strokeWidth="2"/>
        <line x1="160" y1="60" x2="170" y2="50" stroke="#1a1a1a" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 2,
    title: 'Public Speaking and Leadership',
    category: 'Psychology',
    bgColor: 'bg-accent2',
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <g transform="translate(50, 80)">
          <rect x="0" y="20" width="30" height="50" fill="#1a1a1a" rx="15"/>
          <rect x="5" y="25" width="20" height="40" fill="#f7f7f5" rx="10"/>
          <line x1="10" y1="30" x2="10" y2="50" stroke="#1a1a1a" strokeWidth="2"/>
          <line x1="20" y1="30" x2="20" y2="50" stroke="#1a1a1a" strokeWidth="2"/>
        </g>
        <g transform="translate(110, 60)">
          <rect x="0" y="20" width="30" height="60" fill="#f7f7f5" rx="15"/>
          <rect x="5" y="25" width="20" height="50" fill="#1a1a1a" rx="10"/>
          <line x1="10" y1="30" x2="10" y2="60" stroke="#f7f7f5" strokeWidth="2"/>
          <line x1="20" y1="30" x2="20" y2="60" stroke="#f7f7f5" strokeWidth="2"/>
        </g>
        <path d="M 50 50 Q 80 30, 110 50" stroke="#1a1a1a" strokeWidth="3" fill="none"/>
        <path d="M 60 90 L 70 110 L 80 90" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M 120 90 L 110 110 L 100 90" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 3,
    title: 'Data Visualization Techniques',
    category: 'Computer Science',
    bgColor: 'bg-gray-300',
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect x="40" y="40" width="50" height="40" fill="#f7f7f5" rx="4"/>
        <circle cx="50" cy="50" r="3" fill="#ff5734"/>
        <circle cx="60" cy="50" r="3" fill="#ff5734"/>
        <circle cx="70" cy="50" r="3" fill="#ff5734"/>
        <path d="M 100 80 L 120 50 L 140 70 L 160 40" stroke="#1a1a1a" strokeWidth="3" fill="none"/>
        <polygon points="150,35 160,40 155,50" fill="#1a1a1a"/>
        <rect x="110" y="100" width="70" height="50" fill="#fccc42" rx="4"/>
        <path d="M 120 130 Q 130 110, 140 130 T 160 130" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
        <circle cx="60" cy="120" r="20" fill="#be94f5"/>
        <path d="M 60 105 L 60 120 L 70 115" stroke="#f7f7f5" strokeWidth="2" fill="none"/>
      </svg>
    )
  },
  {
    id: 4,
    title: 'Digital Illustration with Adobe Illustrator',
    category: 'Computer Science',
    bgColor: 'bg-primary',
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect x="50" y="60" width="40" height="60" fill="#fccc42" rx="20"/>
        <circle cx="70" cy="50" r="15" fill="#fccc42"/>
        <rect x="110" y="80" width="50" height="50" fill="#be94f5" rx="8"/>
        <path d="M 120 95 L 125 110 L 130 95" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
        <circle cx="145" cy="105" r="8" fill="#1a1a1a"/>
        <text x="65" y="45" fill="#1a1a1a" fontSize="16" fontWeight="bold">Aa</text>
        <rect x="130" y="50" width="20" height="20" fill="none" stroke="#fccc42" strokeWidth="2"/>
        <circle cx="160" cy="130" r="8" fill="#ff5734"/>
        <path d="M 40 100 L 50 110 L 45 120" stroke="#fccc42" strokeWidth="2" fill="none"/>
      </svg>
    )
  },
  {
    id: 5,
    title: 'Advanced JavaScript Patterns',
    category: 'Computer Science',
    bgColor: 'bg-accent1',
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect x="60" y="60" width="80" height="80" fill="#1a1a1a" rx="4"/>
        <text x="100" y="105" fill="#fccc42" fontSize="40" fontWeight="bold" textAnchor="middle">JS</text>
        <circle cx="70" cy="70" r="3" fill="#ff5734"/>
        <circle cx="80" cy="70" r="3" fill="#fccc42"/>
        <circle cx="90" cy="70" r="3" fill="#be94f5"/>
      </svg>
    )
  },
  {
    id: 6,
    title: 'UX/UI Design Fundamentals',
    category: 'Marketing',
    bgColor: 'bg-secondary',
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect x="50" y="50" width="100" height="100" fill="#f7f7f5" rx="8"/>
        <rect x="60" y="60" width="80" height="15" fill="#1a1a1a" rx="2"/>
        <rect x="60" y="80" width="35" height="60" fill="#be94f5" rx="2"/>
        <rect x="100" y="80" width="40" height="25" fill="#fccc42" rx="2"/>
        <rect x="100" y="110" width="40" height="30" fill="#ff5734" rx="2"/>
      </svg>
    )
  }
];

const LeftContent = () => {
return (
  <motion.div 
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="space-y-4 px-4 md:px-0"
  >
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-kodchasan font-bold leading-tight text-center md:text-left md:ml-6 lg:ml-12">
      Take your <span className="text-secondary">knowledge</span>
      <br />
      a degree further
    </h1>
  </motion.div>
);

};

 

const paragraphs = [
  "Make education work for you with flexible online courses from leading schools.",
  "Discover interactive learning experiences designed by world-class educators.",
  "Access cutting-edge curriculum that adapts to your schedule and learning style.",
  "Join millions of learners advancing their careers through our platform."
];


const RightContent = () => {
const [currentParagraph, setCurrentParagraph] = useState(0);
return (
  <motion.div 
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="space-y-4 flex flex-col items-center lg:items-end px-4 lg:px-0"
  >
    <div className="bg-accent2 text-primary px-6 py-2 rounded-full font-kodchasan font-semibold text-sm">
      Our courses
    </div>
    
    {/* Paragraph Container */}
    <div className="text-center lg:text-right max-w-xs">
      <p className="text-primary/80 font-kodchasan">
        {paragraphs[currentParagraph]}
      </p>
    </div>
    
    {/* Navigation Buttons */}
    <div className="flex items-center space-x-3">
      <button
        onClick={() => setCurrentParagraph(prev => prev === 0 ? 3 : prev - 1)}
        className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
      >
        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div className="flex space-x-1">
        {paragraphs.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentParagraph ? 'bg-primary' : 'bg-primary/30'
            }`}
          />
        ))}
      </div>
      
      <button
        onClick={() => setCurrentParagraph(prev => prev === 3 ? 0 : prev + 1)}
        className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
      >
        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </motion.div>
);

};

const CourseCard = ({ course, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex-shrink-0 w-[240px] sm:w-[250px] md:w-[260px] lg:w-[280px]"
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-200 flex flex-col border-2 border-black m-3">
        {/* Illustration Section with Purple Background */}
        <div className="p-4">
          <div className={`${course.bgColor || 'bg-purple-300'} p-6 relative h-44 flex items-center justify-center rounded-2xl border-2 border-black`}>
          {/* Category Badge - Top Left */}
          <div className="absolute top-4 left-4">
            <span className="bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full text-xs font-kodchasan font-semibold">
              {course.category}
            </span>
          </div>
          
           
          
          {/* Main Illustration */}
          <div className="w-32 h-32 flex items-center justify-center relative z-10">
            {course.illustration}
          </div>
        </div>
        </div>
        
        {/* Content Section */}
        <div className="p-5 flex-grow flex flex-col justify-between bg-white">
          <h3 className="text-lg font-kodchasan font-bold text-gray-900 mb-4 leading-tight">
            {course.title}
          </h3>
          
          {/* Button */}
          <button className="w-full bg-secondary hover:bg-orange-600 text-white font-kodchasan font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border-2 border-primary">
            More details
          </button>
        </div>
      </div>
    </motion.div>
  );
};


const CardsContent = () => {
  const [filter, setFilter] = useState('new');
  const scrollContainerRef = useRef(null);
  
  const filters = [
    { id: 'new', label: 'New courses', count: 12 },
    { id: 'recommended', label: 'Recommended', count: 8 },
    { id: 'popular', label: 'Most popular', count: 22 }
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -280,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 280,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full space-y-6 px-4 lg:px-12 lg:pr-2"
    >
      {/* Filters - Mobile Dropdown, Desktop Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Mobile Dropdown */}
    <div className="sm:hidden w-full">
  <div className="relative group">
    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className="
        w-full px-4 py-3 rounded-xl
        border-2 border-transparent
        bg-gradient-to-r from-accent1 to-accent2
        text-white font-kodchasan font-semibold text-sm
        shadow-md shadow-accent1/30
        focus:outline-none
        focus:ring-4 focus:ring-accent2/40
        transition-all duration-300 ease-in-out
        appearance-none
        cursor-pointer
      "
    >
      {filters.map((f) => (
        <option
          key={f.id}
          value={f.id}
          className="text-gray-900 bg-white hover:bg-accent1 hover:text-white"
        >
          {f.label} ({f.count})
        </option>
      ))}
    </select>

    {/* Custom Dropdown Arrow */}
    <div
      className="
        pointer-events-none absolute top-1/2 right-4 
        -translate-y-1/2 text-white
        group-hover:rotate-180 transition-transform duration-300
      "
    >
      ▼
    </div>
  </div>
</div>


        {/* Desktop Tabs */}
        <div className="hidden sm:flex flex-wrap gap-2">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full font-kodchasan font-medium text-sm transition-all duration-300 ${
                filter === f.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all duration-300"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all duration-300"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Cards Horizontal Scroll */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide"
      >
        <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
          {courses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden justify-center gap-4">
        <button
          onClick={scrollLeft}
          className="p-2.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all duration-300"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={scrollRight}
          className="p-2.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all duration-300"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};


const Services = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Section */}
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <LeftContent />
          <div className="flex justify-start lg:justify-end">
            <RightContent />
          </div>
        </div>

        {/* Cards Section */}
        <CardsContent />
      </div>
    </div>
  );
};

export default Services;