import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, ExternalLink, Clock } from 'lucide-react';

const BlogPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const blogs = [
    {
      id: 1,
      title: "AI Revolution: How Claude 4 is Transforming Software Development",
      author: "Sarah Chen",
      date: "November 10, 2025",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
      category: "Artificial Intelligence",
      content: [
        "The landscape of software development is undergoing a seismic shift with the introduction of Claude 4, Anthropic's latest AI model. This groundbreaking technology is not just another incremental update—it represents a fundamental transformation in how developers approach coding, debugging, and system architecture. With its enhanced reasoning capabilities and expanded context window, Claude 4 can now understand and work with entire codebases, making it an invaluable partner for developers worldwide.",
        "What sets Claude 4 apart is its ability to maintain context across complex, multi-file projects while providing nuanced suggestions that consider not just syntax, but also best practices, performance optimization, and security concerns. Developers report productivity increases of up to 40% when using Claude 4 for tasks ranging from code review to architectural planning. The model's understanding of natural language allows even non-technical stakeholders to communicate requirements effectively, bridging the gap between business needs and technical implementation. As we move forward, the integration of AI assistants like Claude 4 into development workflows is becoming less of a luxury and more of a necessity for competitive software teams."
      ],
      links: [
        { title: "Anthropic Official Blog", url: "https://www.anthropic.com/news" },
        { title: "Claude 4 Documentation", url: "https://docs.anthropic.com" },
        { title: "AI Coding Best Practices", url: "https://github.com/anthropics/anthropic-cookbook" }
      ]
    },
    {
      id: 2,
      title: "Quantum Computing Breakthrough: Google's Willow Chip Achieves Quantum Supremacy",
      author: "Dr. James Morrison",
      date: "November 12, 2025",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=500&fit=crop",
      category: "Quantum Computing",
      content: [
        "Google has announced a monumental breakthrough in quantum computing with their new Willow chip, featuring an unprecedented 105 qubits that maintain coherence for record-breaking durations. This achievement marks a crucial milestone in the journey toward practical quantum computing, solving complex calculations in minutes that would take classical supercomputers thousands of years. The Willow chip's error correction capabilities represent a paradigm shift, demonstrating that quantum systems can now operate reliably enough for real-world applications in cryptography, drug discovery, and climate modeling.",
        "The implications of this breakthrough extend far beyond the laboratory. Industries from pharmaceuticals to finance are already exploring how quantum computing can revolutionize their operations. Drug companies are particularly excited about the potential to simulate molecular interactions with unprecedented accuracy, potentially reducing the drug discovery timeline from decades to mere years. Financial institutions see opportunities in portfolio optimization and risk analysis that were previously computationally impossible. However, this advancement also raises important questions about quantum-resistant cryptography, as current encryption methods may become vulnerable. As we stand on the brink of the quantum era, the race is on to develop new security protocols that can withstand the power of quantum computing."
      ],
      links: [
        { title: "Google Quantum AI Research", url: "https://quantumai.google" },
        { title: "Nature: Quantum Supremacy Paper", url: "https://www.nature.com" },
        { title: "Quantum Computing Explained", url: "https://quantum-computing.ibm.com" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background font-kodchasan">
      {/* Hero Section */}
<div
  className="relative lg:-mt-16 bg-background overflow-hidden border-b border-[#e9e9e5]"
  style={{
    transform: `translateY(${scrollY * 0.3}px)`,
  }}
>
  {/* Subtle dotted pattern */}
  <div className="absolute inset-0 opacity-[0.05]">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, ${'#be94f5'} 1px, transparent 0)`,
        backgroundSize: '42px 42px',
      }}
    />
  </div>

  {/* Soft accent blobs */}
  <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-accent1/20 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3"></div>
  <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-accent2/30 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3"></div>

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
    <div className="text-center space-y-8">

      {/* Small Badge */}
      <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary font-medium text-sm">
        <span className="w-2 h-2 bg-secondary rounded-full mr-2 animate-ping"></span>
        Latest Insights
      </div>

      {/* Title */}
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-primary">
        Tech <span className="text-secondary">Insights</span>
        <br />
        <span className="bg-gradient-to-r from-secondary to-accent1 bg-clip-text text-transparent">
          & Innovation
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl text-primary/70 max-w-2xl mx-auto leading-relaxed">
        Exploring the cutting-edge developments shaping our digital future
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-wrap gap-4 justify-center pt-4">
        <button className="px-6 py-3 rounded-xl bg-secondary text-white font-semibold shadow-sm hover:bg-secondary/90 transition-all">
          Browse Articles
        </button>

        <button className="px-6 py-3 rounded-xl bg-white text-primary font-semibold border border-primary/10 hover:bg-primary/5 transition-all">
          Subscribe
        </button>
      </div>
    </div>
  </div>

  {/* Bottom Fade */}
  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
</div>


{/* Blog Posts */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
  <div className="space-y-14">
    {blogs.map((blog, index) => (
      <article
        key={blog.id}
        className="bg-background rounded-2xl shadow-lg overflow-hidden transition-all"
        style={{
          animation: `slideUp 0.8s ease-out ${index * 0.2}s both`
        }}
      >

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3">

          {/* LEFT IMAGE WITH SMALL HEIGHT + PADDING */}
          <div className="relative col-span-1 px-4 pt-4">
            <div className="h-48 sm:h-56 lg:h-52 rounded-xl overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>

            <div className="absolute top-6 left-8 bg-secondary text-white px-3 py-1 rounded-full text-sm shadow-lg">
              {blog.category}
            </div>
          </div>

          {/* RIGHT HALF CONTENT */}
          <div className="col-span-2 p-5 sm:p-8 flex flex-col justify-center">
            {/* META */}
            <div className="flex flex-wrap items-center gap-3 mb-3 text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4 text-accent1" />
                {blog.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-secondary" />
                {blog.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-accent2" />
                {blog.readTime}
              </div>
            </div>

            {/* TITLE */}
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3 leading-snug">
              {blog.title}
            </h2>

            {/* SMALL INTRO CONTENT */}
            <p className="text-gray-700 text-sm sm:text-base line-clamp-3">
              {blog.content[0]}
            </p>
          </div>
        </div>

        {/* BOTTOM FULL CONTENT (NO BORDER LINES) */}
        <div className="px-5 sm:px-8 pb-8 pt-4">
          <div className="space-y-3 text-gray-700 leading-relaxed text-sm sm:text-base">
            {blog.content.slice(1).map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Related Links */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2 mb-3">
              <ExternalLink className="w-5 h-5 text-accent1" />
              Related Resources
            </h3>

            <ul className="space-y-1.5">
              {blog.links.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-secondary hover:text-accent1 transition"
                  >
                    <ArrowRight className="w-4 h-4" />
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </article>
    ))}
  </div>
</div>



  

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
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
          animation: fade-in 1s ease-out;
        }

        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
};

export default BlogPage;