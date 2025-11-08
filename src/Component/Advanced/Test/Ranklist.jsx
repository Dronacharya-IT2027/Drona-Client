import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, TrendingUp } from 'lucide-react';

// Rank List Component
export const RankList = ({ students, currentUserId, loading }) => {
  const [displayStudents, setDisplayStudents] = useState([]);
  console.log(students); 

  useEffect(() => {
    if (students && students.length > 0) {
      setDisplayStudents(students);
      console.log("Students updated:", students);
    }
  }, [students]);
  const getCohort = (percentile) => {
    if (percentile >= 90) return { label: 'Top 10%', color: 'bg-secondary' };
    if (percentile >= 75) return { label: 'Top 25%', color: 'bg-accent1' };
    if (percentile >= 50) return { label: 'Top 50%', color: 'bg-accent2' };
    return { label: 'Below 50%', color: 'bg-gray-400' };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 h-fit flex justify-center items-center">
        <span className="text-primary font-semibold">Loading Rankings...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-md p-4 h-fit"
    >
      <h2 className="text-lg font-bold text-primary mb-4 font-kodchasan flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-secondary" />
        Rank List
      </h2>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {displayStudents.map((student, idx) => {
          const isCurrentUser = student.id === currentUserId;
          const cohort = getCohort(student.percentile);

          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                isCurrentUser
                  ? 'bg-secondary bg-opacity-10 border-secondary'
                  : 'bg-gray-50 border-gray-200 hover:border-accent1'
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs ${cohort.color} flex-shrink-0`}
                >
                  {student.rank || idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm truncate ${
                      isCurrentUser ? 'font-bold text-primary' : 'font-semibold text-gray-800'
                    }`}
                  >
                    {student.name}
                  </p>
                  <p className="text-[10px] text-gray-500">Enrollment Number - {student.percentile}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-bold text-primary text-sm">{student.marks}</span>
                <a
                  href={student.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-white" />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Weak Topics Component
export const WeakTopics = ({ topics }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-4 mt-4"
    >
      <h2 className="text-lg font-bold text-primary mb-3 font-kodchasan">Weak Topics</h2>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 bg-accent1 bg-opacity-20 text-primary rounded-full text-xs font-semibold border border-accent1 hover:bg-accent1 hover:text-white transition-all"
          >
            {topic}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
