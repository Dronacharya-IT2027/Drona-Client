import React, { useState } from "react";
import { X } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const modalContent = {
    faq: {
      title: 'Frequently Asked Questions',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">What is Dronaa?</h3>
            <p className="text-gray-600">Dronaa is a platform offering free, high-quality courses designed to help you achieve your dream career through comprehensive learning paths.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">How do I get started?</h3>
            <p className="text-gray-600">Simply browse our course catalog, select a course that interests you, and start learning immediately. No payment required!</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">Are the courses really free?</h3>
            <p className="text-gray-600">Yes! All our courses are completely free. We believe in accessible education for everyone.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">Do I get a certificate?</h3>
            <p className="text-gray-600">Upon completing a course, you'll receive a certificate of completion to showcase your new skills.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">Can I access courses on mobile?</h3>
            <p className="text-gray-600">Absolutely! Our platform is fully responsive and works seamlessly on all devices.</p>
          </div>
        </div>
      )
    },
    privacy: {
      title: 'Privacy Policy',
      content: (
        <div className="space-y-4 text-gray-600">
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">Information We Collect</h3>
            <p>We collect information you provide directly to us, including your name, email address, and learning preferences to enhance your educational experience on Dronaa.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">How We Use Your Information</h3>
            <p>Your information helps us personalize your learning journey, track your progress, recommend relevant courses, and communicate important updates about our platform.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">Data Security</h3>
            <p>We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">Cookies and Tracking</h3>
            <p>We use cookies to improve your browsing experience, analyze site traffic, and remember your preferences. You can manage cookie settings in your browser.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">Your Rights</h3>
            <p>You have the right to access, update, or delete your personal information at any time. Contact our support team for assistance with your data rights.</p>
          </div>
        </div>
      )
    },
    terms: {
      title: 'Terms of Service',
      content: (
        <div className="space-y-4 text-gray-600">
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">Acceptance of Terms</h3>
            <p>By accessing and using Dronaa's platform, you accept and agree to be bound by these terms and conditions. If you do not agree, please do not use our services.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">Use of Service</h3>
            <p>You agree to use our educational platform only for lawful purposes. You must not misuse our content, attempt unauthorized access, or interfere with other users' learning experience.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">Course Content</h3>
            <p>All course materials, videos, and resources are provided for personal educational use only. Redistribution or commercial use without permission is strictly prohibited.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">Intellectual Property</h3>
            <p>All content, features, and functionality on Dronaa are owned by us and protected by international copyright, trademark, and other intellectual property laws.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">User Accounts</h3>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-primary mb-2">Limitation of Liability</h3>
            <p>Dronaa shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our educational platform.</p>
          </div>
        </div>
      )
    }
  };

  return (
    <>
      <footer className="relative bg-primary text-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent1 rounded-full opacity-10 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full opacity-10 blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
            {/* Brand Section */}
            <div className="text-center md:text-left space-y-4">
              <h3 className="font-kodchasan text-2xl md:text-3xl font-bold">
                Dronaa<span className="text-secondary">.</span>
              </h3>
              <p className="font-kodchasan text-gray-400 text-sm md:text-base leading-relaxed">
                Unlock your potential with free, high-quality courses crafted to
                guide you toward your dream career.
              </p>
              {/* Social Links */}
              <div className="flex gap-4 justify-center md:justify-start">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h4 className="font-kodchasan text-lg font-bold mb-4 text-accent2">
                Quick Links
              </h4>
              <ul className="space-y-2 font-kodchasan text-sm md:text-base">
                <li>
                  <a
                    href="/about"
                    className="text-gray-400 hover:text-secondary transition-colors duration-300"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/#jobs"
                    className="text-gray-400 hover:text-secondary transition-colors duration-300"
                  >
                    jobs & openings
                  </a>
                </li>
                <li>
                  <a
                    href="/#testimonials"
                    className="text-gray-400 hover:text-secondary transition-colors duration-300"
                  >
                    Testimonials
                  </a>
                </li>

                <li>
                  <a
                    href="/about#contact"
                    className="text-gray-400 hover:text-secondary transition-colors duration-300"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="text-center md:text-left">
              <h4 className="font-kodchasan text-lg font-bold mb-4 text-accent2">
                Resources
              </h4>
              <ul className="space-y-2 font-kodchasan text-sm md:text-base">
                <li>
                  <a
                    href="/blog"
                    className="text-gray-400 hover:text-secondary transition-colors duration-300"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => openModal('faq')}
                    className="text-gray-400 hover:text-secondary transition-colors duration-300"
                  >
                    FAQs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal('privacy')}
                    className="text-gray-400 hover:text-secondary transition-colors duration-300"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal('terms')}
                    className="text-gray-400 hover:text-secondary transition-colors duration-300"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="font-kodchasan text-gray-400 text-sm text-center md:text-left">
                © {currentYear} Dronaa. All rights reserved.
              </p>
              <div className="flex gap-6 font-kodchasan text-sm">
                <button
                  onClick={() => openModal('privacy')}
                  className="text-gray-400 hover:text-accent2 transition-colors duration-300"
                >
                  Privacy
                </button>
                <button
                  onClick={() => openModal('terms')}
                  className="text-gray-400 hover:text-accent2 transition-colors duration-300"
                >
                  Terms
                </button>
                <a
                  href="#"
                  className="text-gray-400 hover:text-accent2 transition-colors duration-300"
                >
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {activeModal && (
       <div 
  className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  onClick={closeModal}
>
  <div
    className="relative bg-background/90 backdrop-blur-xl rounded-3xl shadow-xl max-w-xl w-full max-h-[85vh] overflow-y-auto border border-white/20 animate-fade-in"
    onClick={(e) => e.stopPropagation()}
    style={{
      background: "linear-gradient(135deg, rgba(247,247,245,0.95), rgba(255,255,255,0.95))",
      boxShadow:
        "0 10px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.4)",
    }}
  >
    {/* HEADER */}
    <div className="sticky top-0 bg-white/70 backdrop-blur-lg border-b border-gray-200 px-6 py-4 rounded-t-3xl flex items-center justify-between shadow-sm">
      <h2 className="text-2xl font-bold text-primary font-kodchasan tracking-wide">
        {modalContent[activeModal].title}
      </h2>

      <button
        onClick={closeModal}
        className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 text-primary hover:text-secondary"
      >
        <X size={24} />
      </button>
    </div>

    {/* BODY */}
    <div className="px-6 py-6 font-kodchasan text-primary leading-relaxed">
      {modalContent[activeModal].content}
    </div>

    {/* FOOTER */}
    <div className="sticky bottom-0 bg-white/70 backdrop-blur-lg border-t border-gray-200 px-6 py-4 rounded-b-3xl shadow-sm flex justify-end">
      <button
        onClick={closeModal}
        className="px-6 py-2.5 rounded-xl font-semibold font-kodchasan bg-secondary text-white hover:bg-secondary/90 shadow-lg hover:shadow-secondary/30 transition-all duration-300"
      >
        Close
      </button>
    </div>
  </div>
</div>

      )}
    </>
  );
};

export default Footer;