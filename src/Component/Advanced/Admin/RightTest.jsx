import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, AlertTriangle, Ban, X } from 'lucide-react';

export const RightTest = () => {
  const [absentees, setAbsentees] = useState([
    { id: 1, name: 'Rahul Kumar', testsMissed: 8, email: 'rahul@example.com', rank: 'Top 10%' },
    { id: 2, name: 'Priya Singh', testsMissed: 6, email: 'priya@example.com', rank: 'Top 10%' },
    { id: 3, name: 'Amit Sharma', testsMissed: 5, email: 'amit@example.com', rank: 'Top 10%' },
    { id: 4, name: 'Sneha Patel', testsMissed: 4, email: 'sneha@example.com', rank: 'Top 25%' },
    { id: 5, name: 'Vikram Mehta', testsMissed: 4, email: 'vikram@example.com', rank: 'Top 25%' },
    { id: 6, name: 'Anjali Gupta', testsMissed: 3, email: 'anjali@example.com', rank: 'Top 25%' },
    { id: 7, name: 'Rohan Verma', testsMissed: 3, email: 'rohan@example.com', rank: 'Top 50%' },
    { id: 8, name: 'Pooja Reddy', testsMissed: 2, email: 'pooja@example.com', rank: 'Top 50%' },
    { id: 9, name: 'Karan Joshi', testsMissed: 2, email: 'karan@example.com', rank: 'Top 50%' },
    { id: 10, name: 'Neha Desai', testsMissed: 1, email: 'neha@example.com', rank: 'Top 75%' }
  ]);

  const [defaulters, setDefaulters] = useState([
    { id: 1, name: 'Arjun Kapoor', violation: 'Cheating attempt', email: 'arjun@example.com', blocked: false, rank: 'Top 50%' },
    { id: 2, name: 'Divya Malhotra', violation: 'Multiple login sessions', email: 'divya@example.com', blocked: false, rank: 'Top 50%' },
    { id: 3, name: 'Sanjay Rao', violation: 'Tab switching', email: 'sanjay@example.com', blocked: false, rank: 'Top 75%' },
    { id: 4, name: 'Kavita Nair', violation: 'Unauthorized resources', email: 'kavita@example.com', blocked: false, rank: 'Top 75%' }
  ]);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailType, setEmailType] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  const maxMissedTests = Math.max(...absentees.map(s => s.testsMissed));

  const getBorderColor = (testsMissed) => {
    if (testsMissed === maxMissedTests) return 'border-l-secondary';
    if (testsMissed >= 5) return 'border-l-orange-500';
    return 'border-l-accent1';
  };

  const getRankColor = (index) => {
    if (index < 3) return 'bg-secondary';
    if (index < 5) return 'bg-accent1';
    return 'bg-gray-400';
  };

  const handleReportToAdmin = (student) => {
    alert(`Reported ${student.name} to Super Admin`);
  };

  const handleBlockStudent = (id) => {
    setDefaulters(defaulters.map(student => 
      student.id === id ? { ...student, blocked: !student.blocked } : student
    ));
  };

  const handleSendEmail = (type) => {
    setEmailType(type);
    setSelectedStudents(type === 'absentees' ? absentees : defaulters);
    setShowEmailModal(true);
  };

  const sendBulkEmail = () => {
    alert(`Sending emails to ${selectedStudents.length} students`);
    setShowEmailModal(false);
  };

  return (
<div className="relative min-h-400 bg-transparent p-2 sm:p-3 md:p-4 flex flex-col border-2 border-accent2 rounded-xl -mt-[5px]  ">
  <div className="flex-1 flex flex-col space-y-3 sm:space-y-4 overflow-y-auto pb-4">

    {/* Absentees Section */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 bg-transparent backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 border border-accent1/30 flex flex-col min-h-0"
    >
      <div className="flex justify-between items-center mb-2 flex-shrink-0">
        <h2 className="text-xs sm:text-sm md:text-base font-bold text-primary flex items-center">
          <AlertTriangle size={14} className="mr-1 text-secondary sm:w-4 sm:h-4" />
          Absentee List
        </h2>
        <button
          onClick={() => handleSendEmail('absentees')}
          className="bg-accent1 hover:bg-accent1/80 text-primary p-1 sm:p-1.5 rounded transition-all duration-300"
        >
          <Mail size={12} className="sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

    <div className="flex-1 overflow-y-auto space-y-1 pr-1 min-h-0 max-h-60">

        {absentees.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`bg-background/40 backdrop-blur-sm rounded-md p-2 sm:p-2.5 border-l-4 ${getBorderColor(student.testsMissed)} hover:bg-background/60 transition-all duration-200 flex-shrink-0`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`${getRankColor(index)} text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-primary truncate">
                    {student.name}
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-gray-600">
                    {student.rank}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div className="text-right">
                  <p className="text-base sm:text-lg md:text-xl font-bold text-primary">
                    {student.testsMissed}
                  </p>
                  <p className="text-[8px] sm:text-[9px] text-gray-500">
                    missed
                  </p>
                </div>
                <button
                  onClick={() => handleReportToAdmin(student)}
                  className="bg-secondary hover:bg-secondary/80 text-white p-1 sm:p-1.5 rounded transition-all duration-200"
                  title="Report to Admin"
                >
                  <AlertTriangle size={12} className="sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>

    {/* Defaulters Section */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex-1 bg-transparent backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 border border-secondary/30 flex flex-col min-h-0"
    >
      <div className="flex justify-between items-center mb-2 flex-shrink-0">
        <h2 className="text-xs sm:text-sm md:text-base font-bold text-primary flex items-center">
          <Ban size={14} className="mr-1 text-secondary sm:w-4 sm:h-4" />
          Defaulters List
        </h2>
        <button
          onClick={() => handleSendEmail('defaulters')}
          className="bg-accent1 hover:bg-secondary/80 text-white p-1 sm:p-1.5 rounded transition-all duration-300"
        >
          <Mail size={12} className="sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1 min-h-0">
        {defaulters.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-background/40 backdrop-blur-sm rounded-md p-2 sm:p-2.5 border-l-4 ${
              student.blocked ? 'border-l-gray-400 opacity-60' : 'border-l-secondary'
            } hover:bg-background/60 transition-all duration-200 flex-shrink-0`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="bg-secondary text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-primary truncate">
                    {student.name}
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-secondary font-medium truncate">
                    {student.violation}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleBlockStudent(student.id)}
                className={`${
                  student.blocked
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-secondary hover:bg-secondary/80'
                } text-white p-1 sm:p-1.5 rounded transition-all duration-200 flex-shrink-0`}
                title={student.blocked ? 'Unblock' : 'Block'}
              >
                <Ban size={12} className="sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>

  {/* Email Modal */}
  <AnimatePresence>
    {showEmailModal && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 z-50"
        onClick={() => setShowEmailModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-xl p-4 sm:p-5 max-w-md w-full shadow-2xl border-2 border-accent1"
        >
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-bold text-primary">Send Email</h3>
            <button
              onClick={() => setShowEmailModal(false)}
              className="text-gray-500 hover:text-primary transition-colors"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="mb-3 sm:mb-4">
            <p className="text-[10px] sm:text-xs text-gray-600 mb-2">
              Sending to {selectedStudents.length} {emailType === 'absentees' ? 'absentees' : 'defaulters'}
            </p>
            <div className="bg-accent2/10 rounded-lg p-2 max-h-24 sm:max-h-32 overflow-y-auto">
              {selectedStudents.map((student) => (
                <div key={student.id} className="text-[9px] sm:text-[10px] text-primary py-0.5">
                  • {student.name}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-primary mb-1">
                Subject
              </label>
              <input
                type="text"
                className="w-full bg-white border border-accent1 text-primary rounded px-2 py-1 text-[10px] sm:text-xs focus:ring-1 focus:ring-accent1 outline-none"
                placeholder="Email subject..."
              />
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-primary mb-1">
                Message
              </label>
              <textarea
                className="w-full bg-white border border-accent1 text-primary rounded px-2 py-1 text-[10px] sm:text-xs focus:ring-1 focus:ring-accent1 outline-none"
                rows="3"
                placeholder="Email message..."
              />
            </div>

            <button
              onClick={sendBulkEmail}
              className="w-full bg-accent1 hover:bg-accent1/80 text-primary px-3 py-1.5 sm:py-2 rounded font-medium transition-all duration-300 text-[10px] sm:text-xs flex items-center justify-center"
            >
              <Mail size={12} className="mr-1 sm:w-3.5 sm:h-3.5" />
              Send Email to All
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

  );
};

 