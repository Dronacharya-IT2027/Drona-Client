import React, { useState } from "react";
import { FaGithub, FaPen } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { MdSchool } from "react-icons/md";
import { ChevronDown, X } from 'lucide-react';

const ProfileCard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showeditModal , setShoweditModal] = useState(false);
  
  // Sample data
  const rankings = [
    { rank: 1, name: 'Alice Johnson', score: 95 },
    { rank: 2, name: 'Bob Smith', score: 92 },
    { rank: 3, name: 'Charlie Brown', score: 88 },
    { rank: 4, name: 'Diana Prince', score: 85 },
    { rank: 5, name: 'Ethan Hunt', score: 82 },
  ];

  const currentStudentIndex = 2; // Bob Smith is the current student

  const questions = [
    { title: 'Complete Math Assignment Chapter 5', link: '#' },
    { title: 'Submit Science Project Report', link: '#' },
    { title: 'Practice English Grammar Exercises', link: '#' },
    { title: 'Review History Notes - World War II', link: '#' },
    { title: 'Solve Physics Problems Set 3', link: '#' }
  ];

  return (
    <div className="mt-20 w-full md:w-4/5 h-full rounded-xl overflow-hidden font-kodchasan flex flex-col max-w-[90%] shadow-lg">
      
      {/* Profile Section */}
      <div className="flex flex-col items-center justify-center p-4 space-y-2 flex-none relative">
        {/* Profile Image with Pencil Icon */}
        <div className="relative">
          <img
            src="https://t4.ftcdn.net/jpg/04/31/64/75/240_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg"
            alt="Profile"
            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-accent1"
          />

          {/* Pencil Icon (Bottom-Right Corner) */}
          <button
            onClick={() => setShoweditModal(true)}
            className="absolute bottom-1 right-1 bg-accent1 text-white p-2 rounded-full shadow-md hover:bg-secondary transition-transform duration-200 hover:scale-105"
          >
            <FaPen className="text-sm" />
          </button>
        </div>

        {/* Name + Enrollment */}
        <h2 className="text-base md:text-lg font-semibold text-primary text-center">
          Adarsh Kumar
        </h2>
        <p className="text-xs md:text-sm text-secondary text-center">
          Enrollment: 08315603123
        </p>

        {/* Icons Section */}
        <div className="flex justify-around w-full mt-3 md:mt-4">
          <div className="flex flex-col items-center">
            <FaGithub className="text-xl md:text-2xl text-primary" />
            <p className="text-xs md:text-sm font-medium mt-1 text-accent2">200</p>
          </div>
          <div className="flex flex-col items-center">
            <SiLeetcode className="text-xl md:text-2xl text-accent1" />
            <p className="text-xs md:text-sm font-medium mt-1 text-secondary">300</p>
          </div>
          <div className="flex flex-col items-center">
            <MdSchool className="text-xl md:text-2xl text-secondary" />
            <p className="text-xs md:text-sm font-medium mt-1 text-accent1">24</p>
          </div>
        </div>
      </div>

      {/* Scrollable Bottom Section */}
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
            {rankings.slice(currentStudentIndex - 1, currentStudentIndex + 2).map((student, idx) => {
              const isCurrent = idx === 1;
              return (
                <div
                  key={student.rank}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                    isCurrent
                      ? 'bg-secondary text-white shadow-md scale-105'
                      : 'bg-gray-100 opacity-60 scale-95'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                        isCurrent ? 'bg-accent2 text-primary' : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {student.rank}
                    </div>
                    <span
                      className={`font-semibold text-sm md:text-base ${
                        isCurrent ? 'text-white' : 'text-gray-600'
                      }`}
                    >
                      {student.name}
                    </span>
                  </div>
                  <span
                    className={`font-bold text-sm md:text-base ${
                      isCurrent ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {student.score}
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
                  <span className="text-primary font-medium text-xs md:text-sm">
                    {q.title}
                  </span>
                </div>
                <a
                  href={q.link}
                  className="ml-2 text-secondary hover:text-accent1 underline text-xs font-semibold transition-colors"
                >
                  Link
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showeditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 md:w-96 relative font-kodchasan">
            <h2 className="text-lg font-semibold text-primary mb-4 text-center">
              Edit Profile Details
            </h2>

            {/* Form Fields */}
            <form className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-accent1 outline-none"
              />
              <input
                type="text"
                placeholder="Enrollment No."
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-accent1 outline-none"
              />
              <input
                type="text"
                placeholder="Github Username"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-accent1 outline-none"
              />
              <input
                type="text"
                placeholder="Leetcode Username"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-accent1 outline-none"
              />
            </form>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-5">
              <button
                onClick={() => setShoweditModal(false)}
                className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-primary"
              >
                Cancel
              </button>
              <button className="px-4 py-1 bg-accent1 text-white rounded-lg hover:bg-secondary transition">
                Save
              </button>
            </div>

            {/* Close (X) Button */}
            <button
              onClick={() => setShoweditModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

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

            <h3 className="text-2xl font-bold text-primary mb-6 text-center">
              Top 5 Students
            </h3>

            <div className="space-y-3">
              {rankings.map((student) => (
                <div
                  key={student.rank}
                  className="flex items-center justify-between p-4 bg-background rounded-lg hover:bg-accent2 hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-bold shadow">
                      {student.rank}
                    </div>
                    <span className="font-bold text-primary">{student.name}</span>
                  </div>
                  <span className="font-bold text-secondary">{student.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hide Scrollbar */}
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
