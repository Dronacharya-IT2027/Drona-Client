import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "";

// Tech trends data structure (fallback in case API fails)
const fallbackTechTrends = [
  {
    id: 1,
    title: 'AI and Machine Learning',
    category: 'Artificial Intelligence',
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
      </svg>
    )
  },
  {
    id: 2,
    title: 'Web Development',
    category: 'Development',
    bgColor: 'bg-accent2',
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect x="50" y="50" width="100" height="100" fill="#f7f7f5" rx="8"/>
        <rect x="60" y="60" width="80" height="15" fill="#1a1a1a" rx="2"/>
        <rect x="60" y="80" width="35" height="60" fill="#be94f5" rx="2"/>
        <rect x="100" y="80" width="40" height="25" fill="#fccc42" rx="2"/>
        <rect x="100" y="110" width="40" height="30" fill="#ff5734" rx="2"/>
      </svg>
    )
  },
  {
    id: 3,
    title: 'Cloud Computing',
    category: 'Infrastructure',
    bgColor: 'bg-gray-300',
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M 60 100 Q 50 80, 70 70 Q 60 50, 80 50 Q 90 30, 110 40 Q 130 30, 140 50 Q 160 50, 150 70 Q 170 80, 160 100 Z" fill="#f7f7f5"/>
        <circle cx="80" cy="70" r="8" fill="#1a1a1a"/>
        <circle cx="110" cy="65" r="6" fill="#1a1a1a"/>
        <circle cx="130" cy="75" r="7" fill="#1a1a1a"/>
      </svg>
    )
  },
  {
    id: 4,
    title: 'Cybersecurity',
    category: 'Security',
    bgColor: 'bg-primary',
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect x="60" y="60" width="80" height="100" fill="#f7f7f5" rx="8"/>
        <circle cx="100" cy="90" r="15" fill="#1a1a1a"/>
        <rect x="85" y="110" width="30" height="40" fill="#1a1a1a" rx="4"/>
        <path d="M 75 80 L 85 70 M 125 80 L 115 70" stroke="#1a1a1a" strokeWidth="3" fill="none"/>
      </svg>
    )
  },
  {
    id: 5,
    title: 'Data Science',
    category: 'Analytics',
    bgColor: 'bg-accent1',
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect x="60" y="60" width="80" height="80" fill="#1a1a1a" rx="4"/>
        <circle cx="80" cy="80" r="5" fill="#fccc42"/>
        <circle cx="100" cy="100" r="5" fill="#ff5734"/>
        <circle cx="120" cy="120" r="5" fill="#be94f5"/>
        <path d="M 75 85 L 95 95 L 115 115" stroke="#f7f7f5" strokeWidth="2" fill="none"/>
      </svg>
    )
  },
  {
    id: 6,
    title: 'Blockchain',
    category: 'Web3',
    bgColor: 'bg-secondary',
    illustration: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect x="70" y="70" width="20" height="60" fill="#fccc42" rx="2"/>
        <rect x="95" y="70" width="20" height="60" fill="#be94f5" rx="2"/>
        <rect x="120" y="70" width="20" height="60" fill="#ff5734" rx="2"/>
        <rect x="65" y="65" width="70" height="5" fill="#1a1a1a" rx="2"/>
        <rect x="65" y="130" width="70" height="5" fill="#1a1a1a" rx="2"/>
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
  Discover latest <span className="text-orange-500">job openings</span>
  <br />
  in tech industry
</h1>
    </motion.div>
  );
};

const paragraphs = [
  "Stay ahead of the curve with the latest technology trends and innovations.",
  "Discover cutting-edge technologies that are shaping the future of digital transformation.",
  "Access insights about emerging tech trends from industry experts and thought leaders.",
  "Join thousands of tech enthusiasts staying updated with the rapidly evolving tech landscape."
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
        Tech Trends
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

const TrendCard = ({ trend, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex-shrink-0 w-[240px] sm:w-[250px] md:w-[260px] lg:w-[280px]"
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-200 flex flex-col border-2 border-black m-3">
        {/* Illustration Section */}
        <div className="p-4">
          <div className={`${trend.bgColor || 'bg-purple-300'} p-6 relative h-44 flex items-center justify-center rounded-2xl border-2 border-black`}>
            {/* Category Badge - Top Left */}
            <div className="absolute top-4 left-4">
              <span className="bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full text-xs font-kodchasan font-semibold">
                {trend.category}
              </span>
            </div>
            
            {/* Main Illustration */}
            <div className="w-32 h-32 flex items-center justify-center relative z-10">
              {trend.illustration}
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-5 flex-grow flex flex-col justify-between bg-white">
          <h3 className="text-lg font-kodchasan font-bold text-gray-900 mb-4 leading-tight">
            {trend.title}
          </h3>
          
          {/* Button */}
          <button className="w-full bg-secondary hover:bg-orange-600 text-white font-kodchasan font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border-2 border-primary">
            Learn more
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const SkeletonJobCard = ({ index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex-shrink-0 w-[240px] sm:w-[250px] md:w-[260px] lg:w-[280px]"
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-md h-200 flex flex-col border-2 border-gray-200 m-3">
        {/* Illustration Section Skeleton */}
        <div className="p-4">
          <div className="bg-gray-300 p-6 relative h-44 flex items-center justify-center rounded-2xl border-2 border-gray-200 animate-pulse">
            {/* Category Badge Skeleton */}
            {/* <div className="absolute top-4 left-4">
              <div className="bg-gray-400 w-20 h-6 rounded-full animate-pulse"></div>
            </div> */}
            
            {/* Main Illustration Skeleton */}
            <div className="w-32 h-32 flex items-center justify-center">
              <div className="bg-gray-400 rounded-lg w-24 h-24 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Content Section Skeleton */}
        <div className="p-5 flex-grow flex flex-col justify-between bg-white">
          <div className="space-y-3">
            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="bg-gray-300 h-4 rounded animate-pulse"></div>
              <div className="bg-gray-300 h-4 rounded animate-pulse w-3/4"></div>
            </div>
            
            {/* Company Info Skeleton */}
            <div className="space-y-2">
              <div className="bg-gray-200 h-3 rounded animate-pulse w-4/5"></div>
              <div className="bg-gray-200 h-3 rounded animate-pulse w-3/4"></div>
            </div>
            
            {/* Tags Skeleton */}
            <div className="flex flex-wrap gap-2">
              <div className="bg-gray-200 h-6 rounded-full animate-pulse w-16"></div>
              <div className="bg-gray-200 h-6 rounded-full animate-pulse w-20"></div>
            </div>
          </div>
          
          {/* Button Skeleton */}
          <div className="bg-gray-300 w-full h-12 rounded-xl animate-pulse mt-4"></div>
        </div>
      </div>
    </motion.div>
  );
};

// Skeleton for the main loading state
const SkeletonLoader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full space-y-6 px-4 lg:px-12 lg:pr-2"
    >
      {/* Header Skeleton */}
      {/* <div className="flex flex-col gap-4">
        <div className="bg-gray-300 h-8 rounded-lg animate-pulse w-64"></div>
        <div className="bg-gray-200 h-4 rounded animate-pulse w-48"></div>
      </div> */}

      {/* Filters Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <div className="bg-gray-300 h-10 rounded-full animate-pulse w-32"></div>
          <div className="bg-gray-300 h-10 rounded-full animate-pulse w-28"></div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <div className="bg-gray-300 h-10 w-10 rounded-full animate-pulse"></div>
          <div className="bg-gray-300 h-10 w-10 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
          {[...Array(6)].map((_, index) => (
            <SkeletonJobCard key={index} index={index} />
          ))}
        </div>
      </div>

      {/* Mobile Navigation Skeleton */}
      <div className="flex md:hidden justify-center gap-4">
        <div className="bg-gray-300 h-10 w-10 rounded-full animate-pulse"></div>
        <div className="bg-gray-300 h-10 w-10 rounded-full animate-pulse"></div>
      </div>
    </motion.div>
  );
};

// Update your CardsContent component to use the skeleton loader
const CardsContent = () => {
  const [filter, setFilter] = useState('trending');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  
  const filters = [
    { id: 'trending', label: 'Trending Jobs', count: 50 },
  ];

  // Fetch LinkedIn jobs from our backend API
  useEffect(() => {
    const fetchLinkedInJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Replace with your actual backend API URL
        const response = await fetch(`${API_BASE}/api/Linkedin-jobs/jobs`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        
        const jobsData = await response.json();
        
        // Map ALL LinkedIn jobs to our card format (no limit)
        const mappedJobs = jobsData.map((job, index) => {
          const fallbackTrend = fallbackTechTrends[index % fallbackTechTrends.length] || fallbackTechTrends[0];
          return {
            id: job.jobUrl || index + 1,
            title: job.position || 'Software Engineer',
            company: job.company || 'Tech Company',
            location: job.location || 'Remote',
            category: getCategoryFromTitle(job.position),
            bgColor: fallbackTrend.bgColor,
            illustration: fallbackTrend.illustration,
            description: `Join ${job.company} as a ${job.position} in ${job.location}`,
            applyLink: job.jobUrl || '#',
            datePosted: job.agoTime || job.date,
            employmentType: getEmploymentType(job.position),
            companyLogo: job.companyLogo,
            salary: job.salary
          };
        });
        
        setJobs(mappedJobs);
        
      } catch (error) {
        console.error('Error fetching LinkedIn jobs:', error);
        setError('Failed to load job listings');
        // Fallback to static data with job-like structure
        setJobs(fallbackTechTrends.map((trend, index) => ({
          id: index + 1,
          title: trend.title,
          company: 'Tech Company',
          location: 'Remote, India',
          category: trend.category,
          bgColor: trend.bgColor,
          illustration: trend.illustration,
          description: `Exciting opportunity in ${trend.category}`,
          applyLink: '#',
          datePosted: 'Recently',
          employmentType: 'Full-time',
          companyLogo: null
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchLinkedInJobs();
  }, []);

  // Helper function to extract category from job position
  const getCategoryFromTitle = (position) => {
    if (!position) return 'Technology';
    
    const positionLower = position.toLowerCase();
    if (positionLower.includes('machine learning') || positionLower.includes('ai') || positionLower.includes('ml')) {
      return 'AI & ML';
    } else if (positionLower.includes('frontend') || positionLower.includes('front-end') || positionLower.includes('react')) {
      return 'Frontend';
    } else if (positionLower.includes('full stack') || positionLower.includes('fullstack')) {
      return 'Full Stack';
    } else if (positionLower.includes('backend') || positionLower.includes('back-end') || positionLower.includes('node') || positionLower.includes('python') || positionLower.includes('java')) {
      return 'Backend';
    } else if (positionLower.includes('software engineer') || positionLower.includes('software developer')) {
      return 'Software Engineering';
    } else if (positionLower.includes('junior') || positionLower.includes('fresher')) {
      return 'Entry Level';
    } else {
      return 'Technology';
    }
  };

  // Helper function to determine employment type
  const getEmploymentType = (position) => {
    if (!position) return 'Full-time';
    
    const positionLower = position.toLowerCase();
    if (positionLower.includes('remote')) return 'Remote';
    if (positionLower.includes('junior') || positionLower.includes('fresher')) return 'Entry Level';
    return 'Full-time';
  };

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

  // Updated JobCard component with company logo as background
  const JobCard = ({ job, index }) => {
    const handleApplyNow = () => {
      if (job.applyLink && job.applyLink !== '#') {
        window.open(job.applyLink, '_blank', 'noopener,noreferrer');
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex-shrink-0 w-[240px] sm:w-[250px] md:w-[260px] lg:w-[280px]"
      >
        <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-200 flex flex-col border-2 border-black m-3">
          {/* Illustration Section with Company Logo Background */}
          <div className="p-4">
            <div 
              className={`p-6 relative h-44 flex items-center justify-center rounded-2xl border-2 border-black overflow-hidden`}
              style={{
                background: job.companyLogo 
                  ? ` url("${job.companyLogo}") center/cover no-repeat`
                  : job.bgColor || 'bg-purple-300',
                backgroundColor: job.companyLogo ? 'rgba(255, 255, 255, 0.95)' : undefined
              }}
            >
              {/* Category Badge - Top Left */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-kodchasan font-semibold border border-black">
                  {job.category}
                </span>
              </div>
              
              
              
              {/* Main Illustration - Show only if no company logo */}
              {!job.companyLogo && (
                <div className="w-32 h-32 flex items-center justify-center relative z-10">
                  {job.illustration}
                </div>
              )}

            </div>
          </div>
          
          {/* Content Section */}
          <div className="p-5 flex-grow flex flex-col justify-between bg-white">
            <div>
              <h3 className="text-lg font-kodchasan font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
                {job.title}
              </h3>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">🏢 {job.company}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <span>📍 {job.location}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  
                  {job.datePosted && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      Posted {job.datePosted}
                    </span>
                  )}
                  
                </div>
              </div>
            </div>
            
            {/* Apply Button */}
            <button 
              onClick={handleApplyNow}
              disabled={!job.applyLink || job.applyLink === '#'}
              className={`w-full font-kodchasan font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border-2 border-primary ${
                job.applyLink && job.applyLink !== '#'
                  ? 'bg-secondary hover:bg-orange-600 text-white cursor-pointer'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {job.applyLink && job.applyLink !== '#' ? 'Apply Now ↗' : 'Apply Link Not Available'}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <SkeletonLoader/>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full space-y-6 px-4 lg:px-12 lg:pr-2"
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-kodchasan text-red-500">{error}</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full space-y-6 px-4 lg:px-12 lg:pr-2"
    >
      {/* Header */}
     

      {/* Filters and Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Mobile Dropdown */}
        <div className="sm:hidden w-full">
          <div className="relative group">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-gradient-to-r from-accent1 to-accent2 text-white font-kodchasan font-semibold text-sm shadow-md shadow-accent1/30 focus:outline-none focus:ring-4 focus:ring-accent2/40 transition-all duration-300 ease-in-out appearance-none cursor-pointer"
            >
              {filters.map((f) => (
                <option key={f.id} value={f.id} className="text-gray-900 bg-white">
                  {f.label} ({f.count})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-white group-hover:rotate-180 transition-transform duration-300">
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

     

      {/* Jobs Cards Horizontal Scroll - ALL JOBS */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide"
      >
        <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
          {jobs.map((job, index) => (
            <JobCard key={job.id} job={job} index={index} />
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
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