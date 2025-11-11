// src/Component/Advanced/Admin/LeftTest.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Eye,
  FileEdit,
  Calendar,
  Clock,
  BookOpen,
  ExternalLink,
  Copy,
} from "lucide-react";
import axios from "axios";

/**
 * LeftTest component
 * - Receives prop: data (array of tests)
 * - Separates tests into scheduled vs past using endDate + endTime
 * - Integrates:
 *   POST ${API_BASE}/api/tests/create
 *   POST ${API_BASE}/api/tests/:testId/questions
 */

const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "";

const LeftTest = ({ data }) => {
  const [scheduledTests, setScheduledTests] = useState([]);
  const [pastTests, setPastTests] = useState([]);

  // UI state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [showAddQModal, setShowAddQModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);

  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedPastTest, setSelectedPastTest] = useState(null);

  // Create form states (match API payload)
  const [newTest, setNewTest] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    qPerTime: "",
    syllabusTags: "",
    answerDriveLink: "",
  });

  // Add questions state: JSON textarea (string)
  const [questionsJson, setQuestionsJson] = useState("");
  const [questionData, setQuestionData] = useState({}); // kept for backwards compat in modals
  const [copied, setCopied] = useState(false);

  // small local loading flags
  const [creating, setCreating] = useState(false);
  const [addingQuestions, setAddingQuestions] = useState(false);

  // --- Helpers / normalization (unchanged semantics, just consistent names) ---

  const extractDateString = (val) => {
    if (!val && val !== 0) return "";

    if (typeof val === "string") {
      return val;
    }

    if (val instanceof Date) {
      return val.toISOString();
    }

    if (typeof val === "number") {
      const d = new Date(val);
      return isNaN(d.getTime()) ? "" : d.toISOString();
    }

    if (typeof val === "object") {
      if ("$date" in val) {
        const dval = val.$date;
        if (typeof dval === "string") return dval;
        if (typeof dval === "number") return new Date(dval).toISOString();
        if (typeof dval === "object" && "$numberLong" in dval) {
          const num = Number(dval.$numberLong);
          if (!Number.isNaN(num)) return new Date(num).toISOString();
        }
      }
    }

    return "";
  };

  const normalizeTest = (t) => {
    const id = t._id || t.id || t.testId || "";
    const name = t.name || t.title || t.Title || "Untitled Test";

    const startDateStr = extractDateString(
      t.startDate || t.start_date || t.start || ""
    );
    const endDateStr = extractDateString(
      t.endDate || t.end_date || t.end || ""
    );

    const startTime = t.startTime || t.start_time || t.startAt || "";
    const endTime = t.endTime || t.end_time || t.endAt || "";

    const qPerTime =
      t.qPerTime !== undefined && t.qPerTime !== null ? t.qPerTime : "";

    let syllabus = [];
    if (Array.isArray(t.syllabusTags)) syllabus = t.syllabusTags;
    else if (Array.isArray(t.syllabus)) syllabus = t.syllabus;
    else if (typeof t.syllabusTags === "string")
      syllabus = t.syllabusTags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const qDivision = Array.isArray(t.qDivision)
      ? t.qDivision
      : t.qDivision || [];

    const answerDriveLink =
      t.answerDriveLink ||
      t.answer_drive_link ||
      t.answerLink ||
      t.answer_link ||
      "";

    const displayDate = startDateStr
      ? startDateStr.slice(0, 10)
      : endDateStr
      ? endDateStr.slice(0, 10)
      : "";
    const displayTime = startTime || endTime || "";

    // NOTE: we intentionally return "startDateStr" / "endDateStr" (consistent)
    return {
      id,
      raw: t,
      name,
      title: t.title || t.name || "",
      startDateStr,
      startTime,
      endDateStr,
      endTime,
      qPerTime,
      syllabus,
      qDivision,
      answerDriveLink,
      displayDate,
      displayTime,
    };
  };

  const combineDateTime = (dateStrMaybe, timeStrMaybe) => {
    try {
      const dateStr = (dateStrMaybe || "").trim();
      let timeStr = (timeStrMaybe || "").trim();

      const datePart = dateStr || new Date().toISOString().slice(0, 10);

      const ampmMatch = timeStr.match(/(\d{1,2}:\d{2})\s*(AM|PM)/i);
      if (ampmMatch) {
        let [, hm, ampm] = ampmMatch;
        let [h, m] = hm.split(":").map(Number);
        if (/pm/i.test(ampm) && h !== 12) h += 12;
        if (/am/i.test(ampm) && h === 12) h = 0;
        timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      }

      const timePart = timeStr || "00:00";

      if (datePart.includes("T")) {
        const base = new Date(datePart);
        if (isNaN(base.getTime())) return null;
        const [hh, mm] = timePart.split(":").map(Number);
        base.setHours(hh, mm, 0, 0);
        return base;
      }

      const dmy = datePart.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
      let isoDate = datePart;
      if (dmy) {
        const [, dd, mm, yyyy] = dmy;
        isoDate = `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(
          2,
          "0"
        )}`;
      }

      const iso = `${isoDate}T${timePart}:00`;
      const dt = new Date(iso);
      if (isNaN(dt.getTime())) {
        const fallback = new Date(`${isoDate} ${timePart}`);
        if (isNaN(fallback.getTime())) return null;
        return fallback;
      }
      return dt;
    } catch (e) {
      return null;
    }
  };

  // --- IMPORTANT FIX: use startDateStr / endDateStr (returned by normalizeTest) ---
  useEffect(() => {
    if (!Array.isArray(data)) {
      setScheduledTests([]);
      setPastTests([]);
      return;
    }

    const now = new Date();
    const sched = [];
    const past = [];

    for (const rawTest of data) {
      const t = normalizeTest(rawTest);
      const endDT = combineDateTime(
      t.endDateStr || t.startDateStr,
      t.endTime || t.startTime
      );

      const isPast = endDT ? endDT.getTime() <= now.getTime() : true; // treat missing date as past


      const display = {
        id:
          t.id ||
          (t.raw && t.raw._id) ||
          Math.random().toString(36).slice(2, 9),
        name: t.name,
        title: t.title,
        date: t.displayDate,
        time: t.displayTime,
        level: t.level || "",
        qPerTime: t.qPerTime || "",
        syllabus: t.syllabus || [],
        qDivision: t.qDivision || [],
        answerDriveLink: t.answerDriveLink || "",
        raw: t.raw,
        endDateTime: endDT,
      };

      if (isPast) past.push(display);
      else sched.push(display);
    }

    sched.sort((a, b) => {
      const aTime = a.endDateTime ? a.endDateTime.getTime() : 0;
      const bTime = b.endDateTime ? b.endDateTime.getTime() : 0;
      return aTime - bTime;
    });

    past.sort((a, b) => {
      const aTime = a.endDateTime ? a.endDateTime.getTime() : 0;
      const bTime = b.endDateTime ? b.endDateTime.getTime() : 0;
      return bTime - aTime;
    });

    setScheduledTests(sched);
    setPastTests(past);
  }, [data]);

  // Create test: call API
  const handleCreateTest = async () => {
    const {
      title,
      startDate,
      startTime,
      endDate,
      endTime,
      qPerTime,
      syllabusTags,
      answerDriveLink,
    } = newTest;

    if (
      !title ||
      !startDate ||
      !startTime ||
      !endDate ||
      !endTime ||
      !syllabusTags ||
      !answerDriveLink
    ) {
      alert(
        "Please fill required fields: title, startDate, startTime, endDate, endTime, syllabusTags, answerDriveLink"
      );
      return;
    }

    setCreating(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: title.trim(),
        startDate,
        startTime: startTime.trim(),
        endDate,
        endTime: endTime.trim(),
        qPerTime: qPerTime
          ? isNaN(Number(qPerTime))
            ? qPerTime
            : Number(qPerTime)
          : null,
        syllabusTags:
          typeof syllabusTags === "string"
            ? syllabusTags
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : syllabusTags,
        answerDriveLink: answerDriveLink.trim(),
      };

      const res = await axios.post(`${API_BASE}/api/tests/create`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201 && res.data && res.data.test) {
        const newT = normalizeTest(res.data.test);
        // FIXED: use normalized fields when deciding scheduled vs past
        const now = new Date();
        const endDT = combineDateTime(
          newT.endDateStr || newT.startDateStr,
          newT.endTime || newT.startTime
        );
        const display = {
          id:
            newT.id ||
            (newT.raw && newT.raw._id) ||
            Math.random().toString(36).slice(2, 9),
          name: newT.name,
          title: newT.title,
          date: newT.displayDate,
          time: newT.displayTime,
          level: newT.level || "",
          qPerTime: newT.qPerTime || "",
          syllabus: newT.syllabus || [],
          qDivision: newT.qDivision || [],
          answerDriveLink: newT.answerDriveLink || "",
          raw: newT.raw,
          endDateTime: endDT,
        };

        if (endDT && endDT.getTime() <= now.getTime()) {
          setPastTests((prev) => [display, ...prev]);
        } else {
          setScheduledTests((prev) => [display, ...prev]);
        }

        setNewTest({
          title: "",
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
          qPerTime: "",
          syllabusTags: "",
          answerDriveLink: "",
        });

        setShowCreateModal(false);
        alert("Test created successfully");
      } else {
        alert("Unexpected response from server while creating test.");
      }
    } catch (err) {
      console.error("Create test error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Server error creating test";
      alert(`Error: ${msg}`);
    } finally {
      setCreating(false);
    }
  };

  // Open syllabus modal
  const handleViewSyllabus = (test) => {
    setSelectedTest(test);
    setShowSyllabusModal(true);
  };

  // Open add questions modal
  const handleAddQuestions = (test) => {
    setSelectedTest(test);
    setQuestionsJson(""); // clear
    setShowAddQModal(true);
  };

  // Submit questions JSON array to server
  const handleSubmitQuestions = async () => {
    if (!selectedTest) return alert("No test selected");
    if (!questionsJson.trim())
      return alert("Please paste JSON array of questions");

    let parsed;
    try {
      parsed = JSON.parse(questionsJson);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return alert("JSON must be a non-empty array of question objects");
      }
    } catch (e) {
      return alert("Invalid JSON: " + e.message);
    }

    setAddingQuestions(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/api/tests/${selectedTest.id}/questions`,
        { questions: parsed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201) {
        alert(res.data?.message || "Questions added successfully");
        setShowAddQModal(false);
      } else {
        alert("Unexpected response while adding questions");
      }
    } catch (err) {
      console.error("Add questions error:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Server error while adding questions";
      alert(`Error: ${msg}`);
    } finally {
      setAddingQuestions(false);
    }
  };

  // View answers modal
  const handleViewAnswers = (test) => {
    setSelectedPastTest(test);
    setShowAnswerModal(true);
    setCopied(false);
  };

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("copy failed", e);
      alert("Copy failed");
    }
  };

  return (
    <div className="min-h-screen border-2 border-secondary rounded-xl p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Scheduled Tests Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              Scheduled Tests
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-primary p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            >
              <Plus size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {scheduledTests.length === 0 && (
              <div className="col-span-full text-center text-sm text-primary/70">
                No scheduled tests found.
              </div>
            )}

            {scheduledTests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="bg-background backdrop-blur-lg rounded-xl p-4 md:p-6 shadow-xl border-2 border-accent2 hover:border-purple-400 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-primary mb-1">
                      {test.name}
                    </h3>
                    <p className="text-sm text-primary mb-2">{test.title}</p>
                    <p className="text-xs text-secondary">ID: {test.id}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-primary-300">
                    <Calendar size={16} className="mr-2 text-purple-400" />
                    <span>{test.date || "—"}</span>
                  </div>
                  <div className="flex items-center text-sm text-primary-300">
                    <Clock size={16} className="mr-2 text-purple-400" />
                    <span>{test.time || "—"}</span>
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
                    Add Q (JSON)
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Past Tests Section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
            Past Tests
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {pastTests.length === 0 && (
              <div className="col-span-full text-center text-sm text-primary/70">
                No past tests yet.
              </div>
            )}

            {pastTests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 md:p-6 shadow-xl border-2 border-accent1"
              >
                <h3 className="text-lg md:text-xl font-bold text-primary mb-2">
                  {test.name}
                </h3>
                <p className="text-xs text-secondary mb-2">ID: {test.id}</p>
                <div className="mb-4">
                  <div className="text-sm text-primary mb-1">
                    <strong>Date:</strong> {test.date || "—"}
                  </div>
                  <div className="text-sm text-primary">
                    <strong>Time:</strong> {test.time || "—"}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewSyllabus(test)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-background px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                  >
                    <Eye size={16} className="inline-block mr-2" />
                    View Syllabus
                  </button>

                  <button
                    onClick={() => handleViewAnswers(test)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-background px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                  >
                    <ExternalLink size={16} className="inline-block mr-2" />
                    View Answers
                  </button>
                </div>

                {test.answerDriveLink && (
                  <p className="text-xs text-primary/70 mt-3 truncate">
                    Answer Link available
                  </p>
                )}
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
                <h3 className="text-2xl font-bold text-background">
                  Create New Test
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-secondary hover:text-background transition-colors"
                >
                  <X size={24} color="white" />
                </button>
              </div>

              <div className="space-y-4 text-background">
                <div>
                  <label className="block text-sm font-medium text-background mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newTest.title}
                    onChange={(e) =>
                      setNewTest({ ...newTest, title: e.target.value })
                    }
                    className="w-full bg-slate-700 text-background rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="e.g., Computer Science Mid Term"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-background mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={newTest.startDate}
                      onChange={(e) =>
                        setNewTest({ ...newTest, startDate: e.target.value })
                      }
                      className="w-full bg-slate-700 text-background rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-background mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={newTest.startTime}
                      onChange={(e) =>
                        setNewTest({ ...newTest, startTime: e.target.value })
                      }
                      className="w-full bg-slate-700 text-background rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-background mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={newTest.endDate}
                      onChange={(e) =>
                        setNewTest({ ...newTest, endDate: e.target.value })
                      }
                      className="w-full bg-slate-700 text-background rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-background mb-2">
                      End Time *
                    </label>
                    <input
                      type="time"
                      value={newTest.endTime}
                      onChange={(e) =>
                        setNewTest({ ...newTest, endTime: e.target.value })
                      }
                      className="w-full bg-slate-700 text-background rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-background mb-2">
                      Q Per Time (optional)
                    </label>
                    <input
                      type="text"
                      value={newTest.qPerTime}
                      onChange={(e) =>
                        setNewTest({ ...newTest, qPerTime: e.target.value })
                      }
                      className="w-full bg-slate-700 text-background rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="e.g., 60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-background mb-2">
                      Answer Drive Link *
                    </label>
                    <input
                      type="url"
                      value={newTest.answerDriveLink}
                      onChange={(e) =>
                        setNewTest({
                          ...newTest,
                          answerDriveLink: e.target.value,
                        })
                      }
                      className="w-full bg-slate-700 text-background rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-background mb-2">
                    Syllabus Tags *
                  </label>
                  <input
                    type="text"
                    value={newTest.syllabusTags}
                    onChange={(e) =>
                      setNewTest({ ...newTest, syllabusTags: e.target.value })
                    }
                    className="w-full bg-slate-700 text-background rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Comma separated tags e.g., DSA, OS, DBMS"
                  />
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleCreateTest}
                    disabled={creating}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-background px-6 py-3 rounded-lg font-medium transition-all duration-300"
                  >
                    {creating ? "Creating..." : "Create Test"}
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 border border-gray-600 text-background px-6 py-3 rounded-lg font-medium transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
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
                  <X size={24} color='white'/>
                </button>
              </div>

              <div className="space-y-4 text-background">
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
                  <p className="text-sm text-background-400">Duration</p>
                  <p className="text-lg font-semibold">{selectedTest.qPerTime}</p>
                </div>
                <div>
                  <p className="text-sm text-background-400 mb-2">Syllabus</p>
                  <div className="flex flex-wrap gap-2">
                    {(selectedTest.syllabus || []).map((tag, idx) => (
                      <span key={idx} className="bg-purple-600 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Questions Modal (JSON input) */}
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
                  <h3 className="text-2xl font-bold text-background">Add Questions (JSON)</h3>
                  <p className="text-sm text-background mt-1">{selectedTest.name} - {selectedTest.title}</p>
                </div>
                <button onClick={() => setShowAddQModal(false)} className="text-background hover:text-background transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-background-400">Paste a JSON array of questions. Example:</p>
                <pre className="text-xs bg-slate-700 p-3 rounded text-background overflow-auto">
{`[
  {
    "question": "What is 2+2?",
    "options": ["2","3","4","5"],
    "correctAnswer": "4"
  },
  {
    "question": "Which data structure is LIFO?",
    "options": ["Queue","Stack","Tree"],
    "correctAnswer": "Stack"
  }
]`}
                </pre>

                <textarea
                  value={questionsJson}
                  onChange={(e) => setQuestionsJson(e.target.value)}
                  className="w-full bg-slate-700 text-background rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none font-mono text-sm"
                  rows="10"
                  placeholder="Paste JSON array of questions here..."
                />

                <div className="flex gap-2">
                  <button
                    onClick={handleSubmitQuestions}
                    disabled={addingQuestions}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-background px-6 py-3 rounded-lg font-medium transition-all duration-300"
                  >
                    {addingQuestions ? 'Adding...' : 'Submit Questions'}
                  </button>
                  <button
                    onClick={() => setShowAddQModal(false)}
                    className="flex-1 border border-gray-600 text-background px-6 py-3 rounded-lg font-medium transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer Drive Link Modal */}
      <AnimatePresence>
        {showAnswerModal && selectedPastTest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAnswerModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-background">Answer Drive Link</h3>
                <button onClick={() => setShowAnswerModal(false)} className="text-background hover:text-secondary transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div>
                <p className="text-sm text-background-400 mb-2">Test</p>
                <p className="text-lg font-semibold mb-4">{selectedPastTest.name}</p>

                {selectedPastTest.answerDriveLink ? (
                  <>
                    <a
                      href={selectedPastTest.answerDriveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate text-sm text-accent1 underline mb-4"
                    >
                      {selectedPastTest.answerDriveLink}
                    </a>

                    <div className="flex gap-3">
                      <button
                        onClick={() => window.open(selectedPastTest.answerDriveLink, '_blank', 'noopener')}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-background px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      >
                        Open Link
                      </button>
                      <button
                        onClick={() => handleCopyLink(selectedPastTest.answerDriveLink)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-background px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <Copy size={16} />
                        {copied ? 'Copied' : 'Copy Link'}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-primary/70">No answerDriveLink provided for this test.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { LeftTest };
