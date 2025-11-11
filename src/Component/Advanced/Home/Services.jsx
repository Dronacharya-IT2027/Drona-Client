import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
        Explore latest <span className="text-secondary">tech trends</span>
        <br />
        a click away
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

const CardsContent = () => {
  const [filter, setFilter] = useState('trending');
  const [techTrends, setTechTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  
  const filters = [
    { id: 'trending', label: 'Trending', count: 12 },
    { id: 'emerging', label: 'Emerging', count: 8 },
    { id: 'popular', label: 'Most popular', count: 22 }
  ];

  // Fetch tech trends from API
  useEffect(() => {
    const fetchTechTrends = async () => {
      try {
        setLoading(true);
        // Using a free tech news API - NewsAPI alternative (TechCrunch RSS feed)
        const response = await fetch(
          'https://api.rss2json.com/v1/api.json?rss_url=https://techcrunch.com/feed/'
        );
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.items && data.items.length > 0) {
            // Map API data to our format
            const mappedTrends = data.items.slice(0, 6).map((item, index) => {
              const fallbackTrend = fallbackTechTrends[index] || fallbackTechTrends[0];
              return {
                id: index + 1,
                title: item.title.length > 50 ? item.title.substring(0, 50) + '...' : item.title,
                category: getCategoryFromTitle(item.title),
                bgColor: fallbackTrend.bgColor,
                illustration: fallbackTrend.illustration,
                description: item.description,
                link: item.link
              };
            });
            setTechTrends(mappedTrends);
          } else {
            setTechTrends(fallbackTechTrends);
          }
        } else {
          setTechTrends(fallbackTechTrends);
        }
      } catch (error) {
        console.error('Error fetching tech trends:', error);
        setTechTrends(fallbackTechTrends);
      } finally {
        setLoading(false);
      }
    };

    fetchTechTrends();
  }, []);

  // Helper function to extract category from title
  const getCategoryFromTitle = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('ai') || titleLower.includes('artificial intelligence') || titleLower.includes('machine learning')) {
      return 'AI';
    } else if (titleLower.includes('web') || titleLower.includes('development') || titleLower.includes('programming')) {
      return 'Development';
    } else if (titleLower.includes('cloud') || titleLower.includes('aws') || titleLower.includes('azure')) {
      return 'Cloud';
    } else if (titleLower.includes('security') || titleLower.includes('cyber') || titleLower.includes('privacy')) {
      return 'Security';
    } else if (titleLower.includes('data') || titleLower.includes('analytics') || titleLower.includes('big data')) {
      return 'Data Science';
    } else if (titleLower.includes('blockchain') || titleLower.includes('crypto') || titleLower.includes('web3')) {
      return 'Web3';
    } else {
      return 'Technology';
    }
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

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full space-y-6 px-4 lg:px-12 lg:pr-2"
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-kodchasan text-primary">Loading tech trends...</div>
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
          {techTrends.map((trend, index) => (
            <TrendCard key={trend.id} trend={trend} index={index} />
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