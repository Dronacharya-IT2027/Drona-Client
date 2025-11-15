// src/pages/AptitudeTestPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RankList, WeakTopics } from "../Test/Ranklist";
import { TestCard } from "../Test/Testcard";
import axios from 'axios';


import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

async function generateReceiptPDF({ title, testId, date, marks, username }) {
  // Load template PDF
  const existingPdfBytes = await fetch("/receipt_templates.pdf").then(res =>
    res.arrayBuffer()
  );

  // Load PDF
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPages()[0];

  // Choose a font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText(`Name: ${username}`, {
    x: 20,
    y: 150,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Test Title: ${title}`, { x: 20, y: 120, size: 12, font });
  page.drawText(`Receipt ID: ${testId}`, { x: 20, y: 90, size: 12, font });
  page.drawText(`Date: ${date}`, { x: 20, y: 60, size: 12, font });
  page.drawText(`Marks: ${marks}`, { x: 20, y: 30, size: 12, font });

  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `receipt_${username}.pdf`;
  link.click();
}



const API_BASE =
  (typeof import.meta !== "undefined" && metaImportCheck()) ||
  process.env.REACT_APP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "";

// helper to access import.meta safely in SSR builds
function metaImportCheck() {
  try {
    // eslint-disable-next-line no-undef
    return import.meta.env && import.meta.env.VITE_API_BASE_URL;
  } catch (e) {
    return undefined;
  }
}

function extractISODate(val) {
  if (!val && val !== 0) return null;
  if (typeof val === "string") return val;
  if (val instanceof Date) return val.toISOString();
  if (typeof val === "object" && val !== null) {
    // mongo extended form { $date: "..." } or { $date: { $numberLong: "..." } }
    if ("$date" in val) {
      const d = val.$date;
      if (typeof d === "string") return d;
      if (typeof d === "object" && "$numberLong" in d) {
        return new Date(Number(d.$numberLong)).toISOString();
      }
    }
  }
  return null;
}

function parseTimeToHM(timeStrRaw) {
  if (!timeStrRaw) return { h: 0, m: 0 };
  const ts = String(timeStrRaw).trim();
  const ampmMatch = ts.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampmMatch) {
    let hh = parseInt(ampmMatch[1], 10);
    const mm = parseInt(ampmMatch[2], 10);
    const ap = ampmMatch[3].toUpperCase();
    if (ap === "PM" && hh !== 12) hh += 12;
    if (ap === "AM" && hh === 12) hh = 0;
    return { h: hh, m: mm };
  }
  const match = ts.match(/^(\d{1,2}):(\d{2})$/);
  if (match) return { h: parseInt(match[1], 10), m: parseInt(match[2], 10) };
  return { h: 0, m: 0 };
}

function combineDateAndTime(dateVal, timeStr) {
  const iso = extractISODate(dateVal);
  if (!iso) return null;
  const base = new Date(iso);
  if (isNaN(base.getTime())) return null;
  const { h, m } = parseTimeToHM(timeStr);
  // create local Date using base's year/month/day
  return new Date(base.getFullYear(), base.getMonth(), base.getDate(), h, m, 0, 0);
}

function formatDateForCard(dateVal) {
  // returns like "08 Nov 2025"
  const iso = extractISODate(dateVal);
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function humanDuration(startDateObj, endDateObj) {
  if (!startDateObj || !endDateObj) return "";
  const diffMs = endDateObj.getTime() - startDateObj.getTime();
  if (diffMs <= 0) return "";
  const mins = Math.round(diffMs / (60 * 1000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

// combine syllabus tags into expected syllabus array for TestCard
function buildSyllabus(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(tag => ({ topic: tag, description: "" }));
  if (typeof tags === 'string') {
    return tags.split(',').map(t => ({ topic: t.trim(), description: "" })).filter(t => t.topic);
  }
  return [];
}

// Main Component
const AptitudeTestPage = () => {
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const [upcomingTests, setUpcomingTests] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);

  // NEW: user tests (tests the user has attempted / taken)
  const [userTests, setUserTests] = useState([]);
  const [loadingUserTests, setLoadingUserTests] = useState(true);

  const weakTopics = [
    "Dynamic Programming",
    "Graph Theory",
    "Time Complexity",
    "Recursion",
    "Binary Trees",
    "Sorting Algorithms"
  ];

  // Fetch branch-wise ranked students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (!storedUser?.branch) {
          setLoadingStudents(false);
          return;
        }

        const res = await axios.get(`${API_BASE}/api/users/rankings/branch/${storedUser.branch}`);
        if (res && res.data && res.data.results) {
          const apiStudents = res.data.results.map((stu) => ({
            id: String(stu._id), // keep as string to match current user id format
            name: stu.name,
            marks: stu.totalMarks,
            percentile: stu.enrollmentNumber, // enrollment number as requested earlier
            linkedin: stu.linkedin || "#",
            rank: stu.rank
          }));
          setStudents(apiStudents);
        } else {
          setStudents([]);
        }
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  // Fetch upcoming (active) tests for the student (calls the endpoint you asked for)
  useEffect(() => {
    const fetchUpcoming = async () => {
      setLoadingUpcoming(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUpcomingTests([]);
          setLoadingUpcoming(false);
          return;
        }

        const res = await axios.get(`${API_BASE}/api/tests/active`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // API returns { success: true, tests: [...] }
        const testsArr = (res && res.data && (res.data.tests || res.data)) || [];

        const mapped = testsArr.map((t) => {
          // normalize date fields (support ISO string, JS Date, or mongo extended $date)
          const startDateRaw =
            t.startDate ??
            t.startDateStr ??
            (t.startDate && t.startDate.$date) ??
            t.start_date ??
            t.start ??
            null;

          const endDateRaw =
            t.endDate ??
            t.endDateStr ??
            (t.endDate && t.endDate.$date) ??
            t.end_date ??
            t.end ??
            null;

          // combine with time to create Date objects
          const startDT = combineDateAndTime(startDateRaw, t.startTime || t.start_time || "");
          const endDT = combineDateAndTime(endDateRaw, t.endTime || t.end_time || "");

          // formatted date shown on card
          const date = formatDateForCard(startDateRaw);

          // duration computed from start and end datetimes if possible
          const duration = humanDuration(startDT, endDT);

          // syllabus
          const syllabus = buildSyllabus(t.syllabusTags ?? t.syllabus ?? t.syllabus_tags ?? []);

          const totalMarks = 100;

          return {
            id: t._id || t.id || String(t._id || t.id || ""),
            title: t.title || t.name || "Untitled Test",
            aptitudeQ: 0,
            daaQ: 0,
            date,
            startTime: t.startTime || t.start_time || "",
            endTime: t.endTime || t.end_time || "",
            duration, // computed human readable duration
            totalMarks,
            syllabus,
            // provide raw datetimes too in case TestCard (or deeper logic) needs them
            ___meta: {
              startDT: startDT ? startDT.toISOString() : null,
              endDT: endDT ? endDT.toISOString() : null,
            },
          };
        });

        const submittedTestIds = userTests.map(ut => 
          ut.rawTest?._id || ut.rawTest?.id || ut.id
        ).filter(Boolean);

        const filteredUpcomingTests = mapped.filter(test => 
          !submittedTestIds.includes(test.id)
        );

        setUpcomingTests(filteredUpcomingTests);
      } catch (err) {
        console.error("Failed to fetch upcoming tests:", err);
        setUpcomingTests([]);
      } finally {
        setLoadingUpcoming(false);
      }
    };

    if (!loadingUserTests) {
      fetchUpcoming();
    }
  }, [userTests, loadingUserTests]); // Add dependencies


  // NEW: Fetch tests the current user has taken (me/tests)
  useEffect(() => {
    const fetchUserTests = async () => {
      setLoadingUserTests(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUserTests([]);
          setLoadingUserTests(false);
          return;
        }

        const res = await axios.get(`${API_BASE}/api/users/me/tests`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Expected response: { success: true, results: [{ test: {...}, marks }, ...] }
        const results = (res && res.data && (res.data.results || [])) || [];

        // Map into a convenient shape for the UI
        const mapped = results.map((entry) => {
          const testObj = entry.test || {};
          const marks = typeof entry.marks === "number" ? entry.marks : null;

          // normalize date for display
          const date = formatDateForCard(testObj.startDate || testObj.startDateStr || testObj.endDate);

          return {
            id: testObj._id || testObj.id || "",
            title: testObj.title || testObj.name || "Untitled Test",
            date,
            marks,
            rawTest: testObj,
            isOver: testObj.isOver || false
          };
        });

        setUserTests(mapped);
      } catch (err) {
        console.error("Failed to fetch user tests (/api/users/me/tests):", err);
        setUserTests([]);
      } finally {
        setLoadingUserTests(false);
      }
    };

    fetchUserTests();
  }, []);

  const currentUserId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : null;
    

  return (
    <div className="min-h-screen font-kodchasan pb-8">
      <div className="container mx-auto px-3 sm:px-4 py-4 pt-20 sm:pt-24  ">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6 text-center"
        >
          Aptitude Test Dashboard
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Right Section - Shows first on mobile */}
          <div className="w-full lg:w-2/5 lg:order-2">
            <RankList
              students={students}
              currentUserId={currentUserId}
              loading={loadingStudents}
            />
            <WeakTopics topics={weakTopics} />
          </div>

          {/* Left Section - Shows second on mobile */}
          <div className="w-full lg:w-3/5 lg:order-1">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">Upcoming Tests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loadingUpcoming ? (
                  <div className="col-span-full text-center text-primary/70">Loading upcoming tests...</div>
                ) : upcomingTests.length === 0 ? (
                  <div className="col-span-full text-center text-primary/70">No upcoming tests.</div>
                ) : (
                  upcomingTests.map((test) => <TestCard key={test.id} test={test} />)
                )}
              </div>

              {/* NEW: My Test Attempts (data from /api/users/me/tests) */}
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 mt-8">My Test Attempts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loadingUserTests ? (
                  <div className="col-span-full text-center text-primary/70">Loading your test attempts...</div>
                ) : userTests.length === 0 ? (
                  <div className="col-span-full text-center text-primary/70">You have not submitted any tests yet.</div>
                ) : (
                  userTests.map((ut) => (
  <div
    key={(ut.test && ut.test._id) || ut.id || ut.title}
    className="bg-white rounded-xl shadow-md p-4 border border-gray-100"
  >
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="text-base font-bold text-primary">
          {(ut.test && ut.test.title) || ut.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {/* show test id / receipt id */}
          <span className="mr-2">Receipt ID:</span>
          <span className="font-mono text-xs text-gray-700">
            {(ut.test && ut.test._id) || ut.id || '—'}
          </span>
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-primary">
          {typeof (ut.marks ?? ut.marks) === 'number' ? `${ut.marks ?? ut.marks} marks` : '—'}
        </p>
        <p className="text-xs text-gray-500">Submitted</p>
      </div>
    </div>


    {/* Receipt body */}
    <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
      <div>
        <p className="text-xs text-gray-500">Test Date</p>
        <p className="font-medium">
          {((ut.test && ut.test.startDate) || ut.date) ? (
            new Date((ut.test && ut.test.startDate) || ut.date).toLocaleDateString('en-GB', {
              day: '2-digit', month: 'short', year: 'numeric'
            })
          ) : '—'}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-500">Syllabus</p>
        <p className="font-medium">
          <div className="flex flex-wrap gap-2 mt-1">
          {((ut.test && ut.test.syllabusTags) || (ut.rawTest && ut.rawTest.syllabusTags) || ut.syllabus || [])
            .slice(0, 6)
            .map((tag, i) => (
              <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                {typeof tag === 'string' ? tag : (tag.topic || String(tag))}
              </span>
            ))
          }
          {(!((ut.test && ut.test.syllabusTags) || ut.syllabus || (ut.rawTest && ut.rawTest.syllabusTags)) ) && (
            <span className="text-xs text-gray-400">No syllabus available</span>
          )}
        </div>
        </p>
      </div>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-3">
      {/* View Answers button (opens answerDriveLink) */}
      <button
        onClick={() => {
          console.log("Tickk", ut);
          if(!ut.isOver){
            alert("Test is still ongoing. Answers will be available after the test is over.");
            return;
          }
          const link =
            (ut.test && ut.test.answerDriveLink) ||
            (ut.rawTest && ut.rawTest.answerDriveLink) ||
            ut.answerDriveLink;
          if (link) window.open(link, '_blank', 'noopener');
        }}
        disabled={!((ut.test && ut.test.answerDriveLink) || (ut.rawTest && ut.rawTest.answerDriveLink) || ut.answerDriveLink)}
        className={`flex-1 text-sm font-semibold px-4 py-2 rounded-lg transition ${
          ((ut.test && ut.test.answerDriveLink) || (ut.rawTest && ut.rawTest.answerDriveLink) || ut.answerDriveLink)
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        View Answers
      </button>

      {/* Small receipt download — builds a simple text receipt & triggers download */}
      {/* <button
        onClick={() => {
          // create simple receipt content
          const testObj = ut.test || ut.rawTest || {};
          const receipt = [
            'Test Submission Receipt',
            '-----------------------',
            `Title: ${testObj.title || ut.title || '—'}`,
            `Test ID: ${testObj._id || ut.id || '—'}`,
            `Date: ${testObj.startDate ? new Date(testObj.startDate).toLocaleString() : (ut.date || '—')}`,
            `Time: ${testObj.startTime || ''} - ${testObj.endTime || ''}`,
            `Marks: ${ut.marks ?? '—'}`,
            '',
            'Thank you.'
          ].join('\n');

          const blob = new Blob([receipt], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `receipt_${(testObj._id || ut.id || 'test')}.txt`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
      >
        Download Receipt
      </button> */}

      <button
  onClick={() => {
    const testObj = ut.test || ut.rawTest || {};
    const username = JSON.parse(localStorage.getItem("user") || "{}")?.name;

    generateReceiptPDF({
      title: testObj.title || ut.title,
      testId: testObj._id || ut.id,
      date: testObj.startDate
        ? new Date(testObj.startDate).toLocaleDateString("en-GB")
        : ut.date,
      marks: ut.marks ?? "—",
      username,
    });
  }}
  className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
>
  Download Receipt
</button>

    </div>
  </div>
))

                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AptitudeTestPage;
