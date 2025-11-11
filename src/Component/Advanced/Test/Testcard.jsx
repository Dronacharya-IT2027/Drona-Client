import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Clock, Calendar, Award } from 'lucide-react';

// Modal Component for syllabus
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
                  {Array.isArray(syllabus) && syllabus.length > 0 ? (
                    syllabus.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        className="border-l-4 border-secondary pl-3 py-2"
                      >
                        <h4 className="font-bold text-sm mb-1">{item.topic}</h4>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No syllabus available.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Modal to show time-blocked message
const TimeBlockedModal = ({ isOpen, onClose, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full text-center"
          >
            <h3 className="text-lg font-semibold text-primary mb-2">Not Available</h3>
            <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{message}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-95 transition"
              >
                OK
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helpers ---------------------------------------------------------

// Accept iso string, Date, or mongo-extended object -> return ISO string or null
function extractISODate(val) {
  if (!val && val !== 0) return null;
  if (typeof val === 'string') return val;
  if (val instanceof Date) return val.toISOString();
  if (typeof val === 'object' && val !== null) {
    if ('$date' in val) {
      const d = val.$date;
      if (typeof d === 'string') return d;
      if (typeof d === 'object' && '$numberLong' in d) {
        const num = Number(d.$numberLong);
        if (!Number.isNaN(num)) return new Date(num).toISOString();
      }
    }
  }
  return null;
}

// Parse "HH:mm" or "h:mm AM/PM"
function parseTimeToHM(timeStrRaw) {
  if (!timeStrRaw) return { h: 0, m: 0 };
  const ts = String(timeStrRaw).trim();
  const ampmMatch = ts.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampmMatch) {
    let hh = parseInt(ampmMatch[1], 10);
    const mm = parseInt(ampmMatch[2], 10);
    const ap = ampmMatch[3].toUpperCase();
    if (ap === 'PM' && hh !== 12) hh += 12;
    if (ap === 'AM' && hh === 12) hh = 0;
    return { h: hh, m: mm };
  }
  const match = ts.match(/^(\d{1,2}):(\d{2})$/);
  if (match) return { h: parseInt(match[1], 10), m: parseInt(match[2], 10) };
  return { h: 0, m: 0 };
}

// Create local Date from date-like value and time string
function combineDateAndTime(dateVal, timeStr) {
  const iso = extractISODate(dateVal);
  if (!iso) return null;
  const base = new Date(iso);
  if (isNaN(base.getTime())) return null;
  const { h, m } = parseTimeToHM(timeStr);
  return new Date(base.getFullYear(), base.getMonth(), base.getDate(), h, m, 0, 0);
}

// Format date for small label (fallback to provided test.date)
function formatCardDateFromDT(dt) {
  if (!dt) return '';
  try {
    const d = new Date(dt);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

// ----------------------------------------------------------------

export const TestCard = ({ test, isPast = false }) => {
  // test may have:
  // - test.___meta.startDT / endDT (ISO strings) OR
  // - test.startDate / test.endDate with startTime / endTime
  // - test.date may already be a formatted string
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [showTimeBlocked, setShowTimeBlocked] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState('Please Give the test in the given time frame');
  const navigate = useNavigate();

  // normalized start/end Date objects (prefer ___meta)
  const resolveStartDT = () => {
    if (test && test.___meta && test.___meta.startDT) {
      const d = new Date(test.___meta.startDT);
      if (!isNaN(d.getTime())) return d;
    }
    // fallback: combine startDate + startTime
    const startDateVal = test.startDate || test.startDateStr || (test.startDate && test.startDate.$date) || null;
    return combineDateAndTime(startDateVal, test.startTime || test.start_time || '');
  };

  const resolveEndDT = () => {
    if (test && test.___meta && test.___meta.endDT) {
      const d = new Date(test.___meta.endDT);
      if (!isNaN(d.getTime())) return d;
    }
    const endDateVal = test.endDate || test.endDateStr || (test.endDate && test.endDate.$date) || null;
    return combineDateAndTime(endDateVal, test.endTime || test.end_time || '');
  };

  const startDT = resolveStartDT();
  const endDT = resolveEndDT();

  // compute displayed date: prefer test.date, else from startDT
  const displayDate = test.date || formatCardDateFromDT(startDT);

  // total marks displayed
  const totalMarks = test.totalMarks !== undefined && test.totalMarks !== null ? test.totalMarks : (test.qPerTime ?? '—');

  // Handler for Start Test: checks timeframe before navigating
  const handleStart = () => {
    try {
      if (!startDT || !endDT) {
        setBlockedMessage('Test timing is not properly configured. Please contact administrator.');
        setShowTimeBlocked(true);
        return;
      }

      const now = new Date();

      if (now < startDT || now > endDT) {
        const startStr = startDT.toLocaleString();
        const endStr = endDT.toLocaleString();
        setBlockedMessage(`Please Give the test in the given time frame.\nAllowed window:\n${startStr} — ${endStr}`);
        setShowTimeBlocked(true);
        return;
      }

      // allowed -> navigate
      navigate('/test', { state: { testId: test.id || test._id || test.testId || test.test_id || '' } });
    } catch (err) {
      console.error('Start test check error:', err);
      setBlockedMessage('Unable to start test due to an unexpected error.');
      setShowTimeBlocked(true);
    }
  };

  // Syllabus array: accept both shapes (array of strings or array of {topic,description})
  const syllabus = Array.isArray(test.syllabus)
    ? test.syllabus.map((s) => (typeof s === 'string' ? { topic: s, description: '' } : s))
    : [];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
        className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:border-secondary transition-all 
                   w-full max-w-sm mx-auto"
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-base font-bold text-primary font-kodchasan">
            {test.title}
          </h3>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              isPast ? 'bg-gray-200 text-gray-600' : 'bg-accent1 text-white'
            }`}
          >
            {isPast ? 'Completed' : 'Upcoming'}
          </span>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-3.5 h-3.5 mr-2 text-secondary" />
            <span className="text-xs">{displayDate}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Clock className="w-3.5 h-3.5 mr-2 text-secondary" />
            <span className="text-xs">
              {test.startTime} - {test.endTime} {test.duration ? `(${test.duration})` : ''}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Award className="w-3.5 h-3.5 mr-2 text-secondary" />
            <span className="text-xs font-semibold">
              Total Marks: {totalMarks}
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
            <button
              className="flex-1 bg-secondary text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all"
              onClick={handleStart}
            >
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
        syllabus={syllabus}
      />

      <TimeBlockedModal
        isOpen={showTimeBlocked}
        onClose={() => setShowTimeBlocked(false)}
        message={blockedMessage}
      />
    </>
  );
};
