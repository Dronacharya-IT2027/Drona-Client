// src/Component/Somewhere/ProfileCard.jsx
import React, { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { MdSchool } from "react-icons/md";
import { ChevronDown, X, ExternalLink } from "lucide-react";
import axios from "axios";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "";

// Helper functions
function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to parse stored user:", e);
    return null;
  }
}

function buildGithubUrl(github) {
  if (!github) return null;
  const trimmed = github.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^github\.com\/.+/i.test(trimmed)) return `https://${trimmed}`;
  return `https://github.com/${trimmed}`;
}

function buildLeetcodeUrl(leetcode) {
  if (!leetcode) return null;
  const trimmed = leetcode.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^leetcode\.com\/.+/i.test(trimmed)) return `https://${trimmed}`;
  return `https://leetcode.com/${trimmed}`;
}

function buildLinkedinUrl(linkedin) {
  if (!linkedin) return null;
  const trimmed = linkedin.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^linkedin\.com\/.+/i.test(trimmed)) return `https://${trimmed}`;
  return `https://www.linkedin.com/in/${trimmed}`;
}

const ProfileCard = () => {
  const [showModal, setShowModal] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

  // Read user from localStorage
  const storedUser = getStoredUser();
  const user = {
    name: storedUser?.name || "Student Name",
    enrollmentNumber: storedUser?.enrollmentNumber || "0000000000",
    github: storedUser?.github || "",
    leetcode: storedUser?.leetcode || "",
    linkedin: storedUser?.linkedin || "",
    branch: storedUser?.branch || ""
  };

  const githubUrl = buildGithubUrl(user.github);
  const leetcodeUrl = buildLeetcodeUrl(user.leetcode);
  const linkedinUrl = buildLinkedinUrl(user.linkedin);
  const openIf = (url) => { if (url) window.open(url, "_blank", "noopener,noreferrer"); };

  // Fetch rankings from backend API
  useEffect(() => {
    const fetchRankings = async () => {
      if (!user.branch) return;
      try {
        const res = await axios.get(`${API_BASE}/api/users/rankings/all`);
        const allRankings = res.data.results || [];

        // find current user index
        const idx = allRankings.findIndex(u => u.enrollmentNumber === user.enrollmentNumber);
        const start = Math.max(0, idx - 1);
        const end = Math.min(allRankings.length, idx + 2); // one above and one below
        setCurrentStudentIndex(idx);
        setRankings(allRankings.slice(start, end));
      } catch (err) {
        console.error("Failed to fetch rankings:", err);
      }
    };

    fetchRankings();
  }, [user.branch, user.enrollmentNumber]);

  // Daily tasks remain static (mock)
  const questions = [
    { title: "Complete Math Assignment Chapter 5", link: "#" },
    { title: "Submit Science Project Report", link: "#" },
    { title: "Practice English Grammar Exercises", link: "#" },
    { title: "Review History Notes - World War II", link: "#" },
    { title: "Solve Physics Problems Set 3", link: "#" }
  ];

  return (
    <div className="mt-20 w-full md:w-4/5 h-full rounded-xl overflow-hidden font-kodchasan flex flex-col max-w-[90%] shadow-lg">
      {/* Profile Section */}
      <div className="flex flex-col items-center justify-center p-4 space-y-2 flex-none relative">
        <div className="relative">
          <img
            src="https://t4.ftcdn.net/jpg/04/31/64/75/240_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg"
            alt="Profile"
            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-accent1"
          />
        </div>

        <h2
          className="text-base md:text-lg font-semibold text-primary text-center cursor-pointer hover:underline"
          onClick={() => openIf(linkedinUrl)}
          title={linkedinUrl ? "Open LinkedIn profile" : "LinkedIn not provided"}
        >
          {user.name}
        </h2>
        <p className="text-xs md:text-sm text-secondary text-center">
          Enrollment: {user.enrollmentNumber}
        </p>

        <div className="flex justify-around w-full mt-3 md:mt-4">
          <div className="flex flex-col items-center">
            <FaGithub className="text-xl md:text-2xl text-primary" />
            {githubUrl ? (
              <button
                onClick={() => openIf(githubUrl)}
                className="mt-1 text-xs md:text-sm font-medium flex items-center gap-1 text-accent2 hover:text-accent1"
                title="Open GitHub profile"
              >
                <ExternalLink className="w-3 h-3" /> <span className="hidden sm:inline">View</span>
              </button>
            ) : <span className="text-xs md:text-sm font-medium mt-1 text-accent2">—</span>}
          </div>

          <div className="flex flex-col items-center">
            <SiLeetcode className="text-xl md:text-2xl text-accent1" />
            {leetcodeUrl ? (
              <button
                onClick={() => openIf(leetcodeUrl)}
                className="mt-1 text-xs md:text-sm font-medium flex items-center gap-1 text-secondary hover:text-accent1"
                title="Open LeetCode profile"
              >
                <ExternalLink className="w-3 h-3" /> <span className="hidden sm:inline">View</span>
              </button>
            ) : <span className="text-xs md:text-sm font-medium mt-1 text-secondary">—</span>}
          </div>

          <div className="flex flex-col items-center">
            <MdSchool className="text-xl md:text-2xl text-secondary" />
            <p className="text-xs md:text-sm font-medium mt-1 text-accent1">{student?.tests.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex-1 bg-background p-4 space-y-4">
        {/* Class Rankings */}
        <div className="bg-white rounded-lg shadow p-3 md:p-4">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h2 className="text-base md:text-lg font-bold text-primary flex-1 text-center">
              Class Rankings
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="text-secondary hover:text-accent1 text-xs md:text-sm font-semibold underline transition-colors"
            >
              View Full List
            </button>
          </div>

          <div className="space-y-2">
            {rankings.map((student, idx) => {
              const isCurrent = student.enrollmentNumber === user.enrollmentNumber;
              return (
                <div
                  key={student._id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                    isCurrent ? "bg-secondary text-white shadow-md scale-105" : "bg-gray-100 opacity-60 scale-95"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                        isCurrent ? "bg-accent2 text-primary" : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {student?.rank}
                    </div>
                    <span className={`font-semibold text-sm md:text-base ${isCurrent ? "text-white" : "text-gray-600"}`}>
                      {student.name}
                    </span>
                  </div>
                  <span className={`font-bold text-sm md:text-base ${isCurrent ? "text-white" : "text-gray-600"}`}>
                    {student.totalMarks}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Tasks */}
        <div className="bg-white rounded-lg shadow p-3 md:p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-bold text-primary">Daily Tasks</h2>
            <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-secondary animate-bounce" />
          </div>

          <div className="h-36 md:h-48 overflow-y-auto space-y-2 scrollbar-hide">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-background p-2 rounded-lg shadow-sm hover:bg-accent2 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-white font-bold text-xs shadow">
                    {idx + 1}
                  </div>
                  <span className="text-primary font-medium text-xs md:text-sm">{q.title}</span>
                </div>
                <a href={q.link} className="ml-2 text-secondary hover:text-accent1 underline text-xs font-semibold transition-colors">
                  Link
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rankings Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-primary hover:text-secondary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-primary mb-6 text-center">Top 5 Students</h3>

            <div className="space-y-3">
              {rankings.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-4 bg-background rounded-lg hover:bg-accent2 hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-bold shadow">
                      {student?.rank}
                    </div>
                    <span className="font-bold text-primary">{student.name}</span>
                    <span className="font-bold text-primary">{student.enrollmentNumber}</span>

                  </div>
                  <span className="font-bold text-secondary">{student.totalMarks}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProfileCard;
