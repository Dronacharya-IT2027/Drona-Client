import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, AlertTriangle, Ban, X, Mail } from "lucide-react";
import axios from "axios";

const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "";

const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

export const RightTest = () => {
  // Absentees (unchanged logic)
  const [absentees, setAbsentees] = useState([]);

  // Defaulters (was mock; now will be populated from API)
  const [defaulters, setDefaulters] = useState([]);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailType, setEmailType] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  // tests for absentee selector (already used)
  const [tests, setTests] = useState([]); // used by absentee section (if populated)
  const [selectedTest, setSelectedTest] = useState(null);
  const [showTestDropdown, setShowTestDropdown] = useState(false);

  // defaulter-specific state (separate dropdown & list)
  const [defaulterDocs, setDefaulterDocs] = useState([]); // raw docs returned by /admin/latest (allDefaulters)
  const [defTests, setDefTests] = useState([]); // tests array derived from defaulterDocs (for defaulter dropdown)
  const [selectedDefTest, setSelectedDefTest] = useState(null);
  const [showDefDropdown, setShowDefDropdown] = useState(false);

  const [loading, setLoading] = useState(false);

  const maxMissedTests =
    absentees.length > 0
      ? Math.max(...absentees.map((s) => s.testsMissed || 1))
      : 1;

  const getBorderColor = (testsMissed) => {
    if (testsMissed === maxMissedTests) return "border-l-secondary";
    if (testsMissed >= 5) return "border-l-orange-500";
    return "border-l-accent1";
  };

  const getRankColor = (index) => {
    if (index < 3) return "bg-secondary";
    if (index < 5) return "bg-accent1";
    return "bg-gray-400";
  };

  const handleReportToAdmin = (student) => {
    alert(`Reported ${student.name} to Super Admin`);
  };

  const handleBlockStudent = (id) => {
    setDefaulters(
      defaulters.map((student) =>
        student.id === id ? { ...student, blocked: !student.blocked } : student
      )
    );
  };

  const handleSendEmail = (type) => {
    setEmailType(type);
    setSelectedStudents(type === "absentees" ? absentees : defaulters);
    setShowEmailModal(true);
  };

  const sendBulkEmail = () => {
    alert(`Sending emails to ${selectedStudents.length} students`);
    setShowEmailModal(false);
  };

  // Utility: map user objects (from defaulter docs) -> UI shape used in defaulters/absentees lists
  const mapUsersToUI = (users = []) =>
    (users || []).map((stu, idx) => ({
      id: String(stu._id || stu.id || idx),
      name: stu.name || stu.fullName || "Unknown",
      email: stu.email || "",
      testsMissed: 1, // per-test context
      rank: stu.enrollmentNumber ? `#${stu.enrollmentNumber}` : `#${idx + 1}`,
      // keep raw for any further details if needed:
      __raw: stu,
    }));

  // -------------------------
  // Absentees: existing fetchLatest-unattempted logic (unchanged)
  // -------------------------
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/admin/latest-unattempted`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res && res.data && res.data.success) {
          // server returns `test` (single latest test) and `students` (not attempted)
          const latestTest = res.data.test || null;
          const students = Array.isArray(res.data.students) ? res.data.students : [];

          // put the single latest test into tests array (so dropdown UI still works for absentee part)
          if (latestTest) {
            setTests([latestTest]); // keep as array
            setSelectedTest(latestTest);

            // format students -> absentees UI shape:
            const formattedAbsentees = students.map((stu, idx) => ({
              id: String(stu._id || stu.id || idx),
              name: stu.name || stu.fullName || "Unknown",
              email: stu.email || "",
              testsMissed: 1,
              rank: stu.enrollmentNumber ? `#${stu.enrollmentNumber}` : `#${idx + 1}`,
            }));
            setAbsentees(formattedAbsentees);
          } else {
            setTests([]);
            setSelectedTest(null);
            setAbsentees([]);
          }
        } else {
          setTests([]);
          setSelectedTest(null);
          setAbsentees([]);
        }
      } catch (err) {
        console.error("Error fetching latest-unattempted:", err);
        setTests([]);
        setSelectedTest(null);
        setAbsentees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  // Optional function to fetch absentees for a chosen test (unattempted-for-test)
  const fetchAbsenteesForTest = async (testId) => {
    if (!testId) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE}/api/admin/unattempted-for-test`,
        { testId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res && res.data && res.data.success) {
        const students = Array.isArray(res.data.students) ? res.data.students : [];
        const formattedAbsentees = students.map((stu, idx) => ({
          id: String(stu._id || stu.id || idx),
          name: stu.name || stu.fullName || "Unknown",
          email: stu.email || "",
          testsMissed: 1,
          rank: stu.enrollmentNumber ? `#${stu.enrollmentNumber}` : `#${idx + 1}`,
        }));
        setAbsentees(formattedAbsentees);
      } else {
        setAbsentees([]);
      }
    } catch (err) {
      console.error("Error fetching absentees for test:", err);
      setAbsentees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTest = (test) => {
    setSelectedTest(test);
    setShowTestDropdown(false);
    fetchAbsenteesForTest(test._id || test.id);
  };

  // -------------------------
  // New: Defaulters integration
  // - On mount call GET /api/defaulters/admin/latest
  // - populate defaulterDocs, defTests and show latest.defaulters in defaulters list
  // - selecting a test calls POST /api/defaulters/for-test to fetch defaulters for that test
  // -------------------------
  useEffect(() => {
    const fetchLatestDefaulters = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/defaulters/admin/latest`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res && res.data && res.data.success) {
          const allDocs = Array.isArray(res.data.allDefaulters) ? res.data.allDefaulters : [];
          const latestDoc = res.data.latest || null;

          // build tests list from allDocs -> doc.test
          const testsList = allDocs
            .map((doc) => doc.test)
            .filter(Boolean);

          setDefaulterDocs(allDocs);
          setDefTests(testsList);

          if (latestDoc && Array.isArray(latestDoc.defaulters) && latestDoc.defaulters.length > 0) {
            setSelectedDefTest(latestDoc.test || testsList[0] || null);
            setDefaulters(mapUsersToUI(latestDoc.defaulters));
          } else {
            // no defaulters recorded yet for latest: but still choose a test to display if present
            const defaultTest = testsList[0] || null;
            setSelectedDefTest(defaultTest);
            setDefaulters([]); // nothing to show
          }
        } else {
          // on failure keep UI empty for defaulters but don't disturb absentee state
          setDefaulterDocs([]);
          setDefTests([]);
          setSelectedDefTest(null);
          setDefaulters([]);
        }
      } catch (err) {
        console.error("Error fetching defaulters admin latest:", err);
        setDefaulterDocs([]);
        setDefTests([]);
        setSelectedDefTest(null);
        setDefaulters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestDefaulters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch defaulters for a selected test (server call)
  const fetchDefaultersForTest = async (testId) => {
    if (!testId) return;
    try {
      setLoading(true);

      // try local lookup first (we already fetched allDefaulters)
      const localDoc = defaulterDocs.find((d) => {
        const tid = d.test && (d.test._id || d.test.id || d.test);
        return String(tid) === String(testId);
      });

      if (localDoc) {
        setDefaulters(mapUsersToUI(localDoc.defaulters || []));
        setSelectedDefTest(localDoc.test || null);
        return;
      }

      // fallback to server call
      const res = await axios.post(
        `${API_BASE}/api/defaulters/for-test`,
        { testId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res && res.data && res.data.success) {
        const users = Array.isArray(res.data.defaulters) ? res.data.defaulters : [];
        setDefaulters(mapUsersToUI(users));
        if (res.data.test) setSelectedDefTest(res.data.test);
      } else {
        setDefaulters([]);
      }
    } catch (err) {
      console.error("Error fetching defaulters for test:", err);
      setDefaulters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDefTest = (test) => {
    setSelectedDefTest(test);
    setShowDefDropdown(false);
    const tid = test._id || test.id || test;
    fetchDefaultersForTest(tid);
  };

  return (
    <div className="relative min-h-400 bg-transparent p-2 sm:p-3 md:p-4 flex flex-col border-2 border-accent2 rounded-xl -mt-[5px]">
      <div className="flex-1 flex flex-col space-y-3 sm:space-y-4 overflow-y-auto pb-4">

        {/* Absentees Section (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 bg-transparent  rounded-lg sm:rounded-xl p-2 sm:p-3 border border-accent1/30 flex flex-col min-h-0"
        >
          <div className="flex justify-between items-center mb-2 flex-shrink-0 relative">
            <h2 className="text-xs sm:text-sm md:text-base font-bold text-primary flex items-center">
              <AlertTriangle size={14} className="mr-1 text-secondary sm:w-4 sm:h-4" />
              Absentee List
            </h2>

            {/* Calendar selector (replaces previous mail icon as requested) */}
            <div className="relative">
              <button
                onClick={() => setShowTestDropdown(!showTestDropdown)}
                className="bg-accent1 hover:bg-accent1/80 text-primary p-1 sm:p-1.5 rounded transition-all duration-300 flex items-center"
                title="Select test date"
              >
                <Calendar size={14} className="sm:w-3.5 sm:h-3.5" />
              </button>

              {showTestDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border border-accent1 z-50 w-48 max-h-56 overflow-y-auto"
                >
                  {loading && (
                    <p className="text-center text-xs text-gray-500 p-2">Loading...</p>
                  )}

                  {!loading && tests.length === 0 && (
                    <p className="text-center text-xs text-gray-500 p-2">No tests found</p>
                  )}

                  {!loading &&
                    tests.map((test) => (
                      <button
                        key={test._id || test.id}
                        onClick={() => handleSelectTest(test)}
                        className={`block w-full text-left text-xs px-3 py-2 hover:bg-accent2/20 ${
                          selectedTest && (selectedTest._id || selectedTest.id) === (test._id || test.id)
                            ? "bg-accent1/30 font-semibold"
                            : ""
                        }`}
                      >
                        {test.title || "Untitled Test"} —{" "}
                        {test.startDate ? new Date(test.startDate).toLocaleDateString() : "—"}
                      </button>
                    ))}
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1 min-h-0 max-h-60">
            {loading && (
              <p className="text-center text-xs text-gray-500 p-2">Loading...</p>
            )}

            {!loading && absentees.length === 0 && (
              <p className="text-center text-xs text-gray-400 italic p-2">
                {selectedTest ? "No absentees for this test 🎉" : "Select a test date to view absentees"}
              </p>
            )}

            {absentees.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`bg-background/40 backdrop-blur-sm rounded-md p-2 sm:p-2.5 border-l-4 ${getBorderColor(
                  student.testsMissed
                )} hover:bg-background/60 transition-all duration-200 flex-shrink-0`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`${getRankColor(index)} text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-primary truncate">{student.name}</h3>
                      <p className="text-[9px] sm:text-[10px] text-gray-600">{student.rank}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-base sm:text-lg md:text-xl font-bold text-primary">{student.testsMissed}</p>
                      <p className="text-[8px] sm:text-[9px] text-gray-500">missed</p>
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

        {/* Defaulters Section — now powered by APIs (replaces mock data) */}
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

            {/* Calendar selector for defaulters */}
            <div className="relative">
              <button
                onClick={() => setShowDefDropdown(!showDefDropdown)}
                className="bg-accent1 hover:bg-accent1/80 text-white p-1 sm:p-1.5 rounded transition-all duration-300 flex items-center"
                title="Select test date for defaulters"
              >
                <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
              </button>

              {showDefDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border border-accent1 z-50 w-72 max-h-56 overflow-y-auto"
                >
                  {loading && (
                    <p className="text-center text-xs text-gray-500 p-2">Loading...</p>
                  )}

                  {!loading && defTests.length === 0 && (
                    <p className="text-center text-xs text-gray-500 p-2">No tests found</p>
                  )}

                  {!loading && defTests.map((test) => (
                    <button
                      key={test._id || test.id}
                      onClick={() => handleSelectDefTest(test)}
                      className={`block w-full text-left text-xs px-3 py-2 hover:bg-accent2/20 ${
                        selectedDefTest && (selectedDefTest._id || selectedDefTest.id) === (test._id || test.id)
                          ? "bg-accent1/30 font-semibold"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{test.title || "Untitled Test"}</span>
                        <span className="text-[11px] text-gray-500">
                          {test.startDate ? new Date(test.startDate).toLocaleDateString() : "—"}
                        </span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1 min-h-0">
            {loading && (
              <p className="text-center text-xs text-gray-500 p-2">Loading...</p>
            )}

            {!loading && defaulters.length === 0 && (
              <p className="text-center text-xs text-gray-400 italic p-2">
                {selectedDefTest ? "No defaulters recorded for this test 🎉" : "Select a test date to view defaulters"}
              </p>
            )}

            {defaulters.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-background/40  rounded-md p-2 sm:p-2.5 border-l-4 ${
                  student.blocked ? "border-l-gray-400 opacity-60" : "border-l-secondary"
                } hover:bg-background/60 transition-all duration-200 flex-shrink-0`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="bg-secondary text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-primary truncate">{student.name}</h3>
                      <p className="text-[9px] sm:text-[10px] text-secondary font-medium truncate">{student.rank}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBlockStudent(student.id)}
                    className={`${student.blocked ? "bg-green-600 hover:bg-green-700" : "bg-secondary hover:bg-secondary/80"} text-white p-1 sm:p-1.5 rounded transition-all duration-200 flex-shrink-0`}
                    title={student.blocked ? "Unblock" : "Block"}
                  >
                    <Ban size={12} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Email Modal (unchanged) */}
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
                <button onClick={() => setShowEmailModal(false)} className="text-gray-500 hover:text-primary transition-colors">
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="mb-3 sm:mb-4">
                <p className="text-[10px] sm:text-xs text-gray-600 mb-2">
                  Sending to {selectedStudents.length} {emailType === "absentees" ? "absentees" : "defaulters"}
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
                  <label className="block text-[10px] sm:text-xs font-medium text-primary mb-1">Subject</label>
                  <input
                    type="text"
                    className="w-full bg-white border border-accent1 text-primary rounded px-2 py-1 text-[10px] sm:text-xs focus:ring-1 focus:ring-accent1 outline-none"
                    placeholder="Email subject..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-primary mb-1">Message</label>
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
