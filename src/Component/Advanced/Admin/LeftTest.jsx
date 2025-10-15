import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Eye, FileEdit, Calendar, Clock, BookOpen } from 'lucide-react';

export const LeftTest = () => {
  const [scheduledTests, setScheduledTests] = useState([
    {
      id: 'TEST001',
      name: 'Mid Term Exam',
      title: 'Computer Science Mid Term',
      date: '2025-10-20',
      time: '10:00 AM',
      level: 'Intermediate',
      qPerTime: '60 mins',
      syllabus: ['DSA', 'OS', 'DBMS'],
      qDivision: [
        { subject: 'DSA', questions: 30 },
        { subject: 'OS', questions: 20 },
        { subject: 'DBMS', questions: 10 }
      ]
    }
  ]);

  const [pastTests, setPastTests] = useState([
    {
      id: 'TEST000',
      name: 'Previous Exam',
      driveLink: ''
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [showAddQModal, setShowAddQModal] = useState(false);
  const [showDriveLinkModal, setShowDriveLinkModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedPastTest, setSelectedPastTest] = useState(null);

  const [newTest, setNewTest] = useState({
    name: '',
    title: '',
    date: '',
    time: '',
    level: '',
    qPerTime: '',
    syllabus: [],
    qDivision: []
  });

  const [syllabusInput, setSyllabusInput] = useState('');
  const [qDivisionInput, setQDivisionInput] = useState('');
  const [questionData, setQuestionData] = useState({});
  const [driveLink, setDriveLink] = useState('');

  const handleCreateTest = () => {
    if (!newTest.name || !newTest.title || !newTest.date || !newTest.time) {
      alert('Please fill all required fields');
      return;
    }

    const test = {
      ...newTest,
      id: `TEST${String(scheduledTests.length + 1).padStart(3, '0')}`,
      syllabus: syllabusInput.split(',').map(s => s.trim()).filter(s => s),
      qDivision: qDivisionInput.split(',').map(item => {
        const [subject, qs] = item.trim().split(' ');
        return { subject, questions: parseInt(qs) || 0 };
      }).filter(item => item.subject)
    };

    setScheduledTests([...scheduledTests, test]);
    setShowCreateModal(false);
    setNewTest({
      name: '',
      title: '',
      date: '',
      time: '',
      level: '',
      qPerTime: '',
      syllabus: [],
      qDivision: []
    });
    setSyllabusInput('');
    setQDivisionInput('');
  };

  const handleViewSyllabus = (test) => {
    setSelectedTest(test);
    setShowSyllabusModal(true);
  };

  const handleAddQuestions = (test) => {
    setSelectedTest(test);
    const initialData = {};
    test.syllabus.forEach(tag => {
      initialData[tag] = '';
    });
    setQuestionData(initialData);
    setShowAddQModal(true);
  };

  const handleSaveQuestions = () => {
    console.log('Saved questions:', questionData);
    setShowAddQModal(false);
    setQuestionData({});
  };

  const handleAddDriveLink = (test) => {
    setSelectedPastTest(test);
    setDriveLink(test.driveLink || '');
    setShowDriveLinkModal(true);
  };

  const handleSaveDriveLink = () => {
    setPastTests(pastTests.map(test => 
      test.id === selectedPastTest.id 
        ? { ...test, driveLink } 
        : test
    ));
    setShowDriveLinkModal(false);
    setDriveLink('');
  };

  return (
    <div className="min-h-screen border-2 border-secondary rounded-xl p-4 md:p-8">
     {/* "min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
   */}
      <div className="max-w-7xl mx-auto">
        {/* Scheduled Tests Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Scheduled Tests</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-primary p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            >
              <Plus size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {scheduledTests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background backdrop-blur-lg rounded-xl p-4 md:p-6 shadow-xl border-2 border-accent2 hover:border-purple-400 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-primary mb-1">{test.name}</h3>
                    <p className="text-sm text-primary mb-2">{test.title}</p>
                    <p className="text-xs text-secondary">ID: {test.id}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-primary-300">
                    <Calendar size={16} className="mr-2 text-purple-400" />
                    <span>{test.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-primary-300">
                    <Clock size={16} className="mr-2 text-purple-400" />
                    <span>{test.time}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleViewSyllabus(test)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-background px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center"
                  >
                    <Eye size={16} className="mr-2" />
                    View Syllabus
                  </button>
                  <button
                    onClick={() => handleAddQuestions(test)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-background px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center"
                  >
                    <FileEdit size={16} className="mr-2" />
                    Add Q
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Past Tests Section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Past Tests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {pastTests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 md:p-6 shadow-xl border-2 border-accent1"
              >
                <h3 className="text-lg md:text-xl font-bold text-primary mb-2">{test.name}</h3>
                <p className="text-xs text-secondary mb-4">ID: {test.id}</p>
                {test.driveLink && (
                  <p className="text-sm text-primary mb-4 truncate">Link: {test.driveLink}</p>
                )}
                <button
                  onClick={() => handleAddDriveLink(test)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-background px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                >
                  {test.driveLink ? 'Update Drive Link' : 'Add Drive Link'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Test Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-background">Create New Test</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-secondary hover:text-background transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-background mb-2">Test Name *</label>
                  <input
                    type="text"
                    value={newTest.name}
                    onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                    className="w-full bg-slate-700 text-background rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="e.g., Final Exam"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-background mb-2">Title *</label>
                  <input
                    type="text"
                    value={newTest.title}
                    onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                    className="w-full bg-slate-700 text-background rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="e.g., Computer Science Final"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-background mb-2">Date *</label>
                    <input
                      type="date"
                      value={newTest.date}
                      onChange={(e) => setNewTest({ ...newTest, date: e.target.value })}
                      className="w-full bg-slate-700 text-background rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-background mb-2">Time *</label>
                    <input
                      type="time"
                      value={newTest.time}
                      onChange={(e) => setNewTest({ ...newTest, time: e.target.value })}
                      className="w-full bg-slate-700 text-background rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-background mb-2">Level</label>
                    <input
                      type="text"
                      value={newTest.level}
                      onChange={(e) => setNewTest({ ...newTest, level: e.target.value })}
                      className="w-full bg-slate-700 text-background rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="e.g., Intermediate"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-background mb-2">Q Per Time</label>
                    <input
                      type="text"
                      value={newTest.qPerTime}
                      onChange={(e) => setNewTest({ ...newTest, qPerTime: e.target.value })}
                      className="w-full bg-slate-700 text-background rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="e.g., 60 mins"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-background mb-2">
                    Syllabus Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={syllabusInput}
                    onChange={(e) => setSyllabusInput(e.target.value)}
                    className="w-full bg-slate-700 text-background rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="e.g., DSA, OS, DBMS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-background mb-2">
                    Question Division (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={qDivisionInput}
                    onChange={(e) => setQDivisionInput(e.target.value)}
                    className="w-full bg-slate-700 text-background rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="e.g., Aptitude 30, DAA 20"
                  />
                </div>

                <button
                  onClick={handleCreateTest}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-background px-6 py-3 rounded-lg font-medium transition-all duration-300 mt-4"
                >
                  Create Test
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Syllabus Modal */}
  <AnimatePresence>
  {showSyllabusModal && selectedTest && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={() => setShowSyllabusModal(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-800 rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-background">Test Details</h3>
          <button
            onClick={() => setShowSyllabusModal(false)}
            className="text-background-400 hover:text-background transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 text-background">
          <div>
            <p className="text-sm text-background-400">Test Name</p>
            <p className="text-lg font-semibold">{selectedTest.name}</p>
          </div>
          <div>
            <p className="text-sm text-background-400">Title</p>
            <p className="text-lg font-semibold">{selectedTest.title}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-background-400">Date</p>
              <p className="text-lg font-semibold">{selectedTest.date}</p>
            </div>
            <div>
              <p className="text-sm text-background-400">Time</p>
              <p className="text-lg font-semibold">{selectedTest.time}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-background-400">Level</p>
            <p className="text-lg font-semibold">{selectedTest.level}</p>
          </div>
          <div>
            <p className="text-sm text-background-400">Duration</p>
            <p className="text-lg font-semibold">{selectedTest.qPerTime}</p>
          </div>
          <div>
            <p className="text-sm text-background-400 mb-2">Syllabus</p>
            <div className="flex flex-wrap gap-2">
              {selectedTest.syllabus.map((tag, idx) => (
                <span key={idx} className="bg-purple-600 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-background-400 mb-2">Question Division</p>
            <div className="space-y-2">
              {selectedTest.qDivision.map((item, idx) => (
                <div key={idx} className="bg-slate-700 p-3 rounded-lg">
                  <span className="font-semibold">{item.subject}:</span> {item.questions} Questions
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => alert('Edit functionality')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-background px-6 py-3 rounded-lg font-medium transition-all duration-300"
          >
            Edit
          </button>
          <button
            onClick={() => setShowSyllabusModal(false)}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-background px-6 py-3 rounded-lg font-medium transition-all duration-300"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


      {/* Add Questions Modal */}
     <AnimatePresence>
  {showAddQModal && selectedTest && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={() => setShowAddQModal(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-800 rounded-2xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-background">Add Questions</h3>
            <p className="text-sm text-background mt-1">
              {selectedTest.name} - {selectedTest.title}
            </p>
          </div>
          <button
            onClick={() => setShowAddQModal(false)}
            className="text-background hover:text-background transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {selectedTest.syllabus.map((tag, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium text-background mb-2 flex items-center">
                <BookOpen size={16} className="mr-2 text-purple-400" />
                {tag} - Questions (JSON Format)
              </label>
              <textarea
                value={questionData[tag] || ''}
                onChange={(e) =>
                  setQuestionData({ ...questionData, [tag]: e.target.value })
                }
                className="w-full bg-slate-700 text-background rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none font-mono text-sm"
                rows="6"
                placeholder={`Enter 10 questions for ${tag} in JSON format...`}
              />
            </div>
          ))}

          <button
            onClick={handleSaveQuestions}
            className="w-full bg-green-600 hover:bg-green-700 text-background px-6 py-3 rounded-lg font-medium transition-all duration-300"
          >
            Save Questions
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


      {/* Drive Link Modal */}
      <AnimatePresence>
        {showDriveLinkModal && selectedPastTest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDriveLinkModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-background">Add Drive Link</h3>
                <button
                  onClick={() => setShowDriveLinkModal(false)}
                  className="text-background hover:text-secondary transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-background mb-2">Google Drive Link</label>
                <input
                  type="url"
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                  className="w-full bg-slate-700 text-background rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none mb-4"
                  placeholder="https://drive.google.com/..."
                />

                <button
                  onClick={handleSaveDriveLink}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-background px-6 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  Save Link
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

 ;