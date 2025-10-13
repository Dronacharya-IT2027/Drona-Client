import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Linkedin, Download, Clock, Calendar, Award, TrendingUp } from 'lucide-react';

// Modal Component
const SyllabusModal = ({ isOpen, onClose, syllabus, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h3 className="text-lg font-bold text-primary font-kodchasan">{title} - Syllabus</h3>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-primary" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                <div className="space-y-3 text-primary">
                  {syllabus.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="border-l-4 border-secondary pl-3 py-2"
                    >
                      <h4 className="font-bold text-sm mb-1">{item.topic}</h4>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const TestCard = ({ test, isPast = false }) => {
  const [showSyllabus, setShowSyllabus] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
        className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:border-secondary transition-all 
                   w-full max-w-sm mx-auto"
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-base font-bold text-primary font-kodchasan">
            {test.title}
          </h3>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              isPast ? "bg-gray-200 text-gray-600" : "bg-accent1 text-white"
            }`}
          >
            {isPast ? "Completed" : "Upcoming"}
          </span>
        </div>

        <div className="space-y-2 mb-3">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Aptitude:</span> {test.aptitudeQ}Q •
            <span className="font-semibold ml-2">DAA:</span> {test.daaQ}Q
          </p>

          <div className="flex items-center text-gray-600">
            <Calendar className="w-3.5 h-3.5 mr-2 text-secondary" />
            <span className="text-xs">{test.date}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Clock className="w-3.5 h-3.5 mr-2 text-secondary" />
            <span className="text-xs">
              {test.startTime} - {test.endTime} ({test.duration})
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Award className="w-3.5 h-3.5 mr-2 text-secondary" />
            <span className="text-xs font-semibold">
              Total Marks: {test.totalMarks}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {isPast ? (
            <button className="flex-1 bg-primary text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          ) : (
            <button className="flex-1 bg-secondary text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all">
              Start Test
            </button>
          )}
          <button
            onClick={() => setShowSyllabus(true)}
            className="flex-1 bg-accent2 text-primary py-2 px-3 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all"
          >
            Syllabus
          </button>
        </div>
      </motion.div>

      <SyllabusModal
        isOpen={showSyllabus}
        onClose={() => setShowSyllabus(false)}
        title={test.title}
        syllabus={test.syllabus}
      />
    </>
  );
};
