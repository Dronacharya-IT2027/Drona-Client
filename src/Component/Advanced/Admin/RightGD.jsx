import React, { useState } from 'react';
import { X, Plus, Mail, Users, Clock, Calendar, MapPin, Edit2, User } from 'lucide-react';

export const RightGD = () => {
  const [showAbsentees, setShowAbsentees] = useState(false);
  const [showInterviewDetail, setShowInterviewDetail] = useState(false);
  const [showCreateInterview, setShowCreateInterview] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [marks, setMarks] = useState({});
  const [feedback, setFeedback] = useState({});

  // Sample data
  const interviewData = {
    title: "Technical Interview Round 1",
    topics: ["Data Structures", "Algorithms", "System Design", "Problem Solving"],
    date: "Oct 22, 2025",
    time: "9:00 AM - 5:00 PM",
    slotDuration: "20 mins",
    panels: 4,
    totalStudents: 32,
    rooms: [
      { room: "201", time: "9:00-12:00", panelHead: "Dr. Rajesh Kumar", email: "rajesh@example.com", students: 8 },
      { room: "202", time: "9:00-12:00", panelHead: "Prof. Meena Sharma", email: "meena@example.com", students: 8 },
      { room: "203", time: "1:00-5:00", panelHead: "Dr. Arun Patel", email: "arun@example.com", students: 8 },
      { room: "204", time: "1:00-5:00", panelHead: "Prof. Kavita Singh", email: "kavita@example.com", students: 8 }
    ]
  };

  const absentees = [
    { id: 1, name: "Rohan Verma", rollNo: "2021001", slot: "9:00-9:20 AM" },
    { id: 2, name: "Anjali Singh", rollNo: "2021002", slot: "9:20-9:40 AM" },
    { id: 3, name: "Karthik Kumar", rollNo: "2021003", slot: "10:00-10:20 AM" },
    { id: 4, name: "Riya Gupta", rollNo: "2021004", slot: "10:20-10:40 AM" },
    { id: 5, name: "Vikram Sharma", rollNo: "2021005", slot: "11:00-11:20 AM" }
  ];

  const panels = [
    { 
      id: 1, 
      panelHead: "Dr. Rajesh Kumar", 
      room: "201", 
      timeSlot: "9:00-12:00",
      studentsAlloted: 8,
      students: [
        { id: "S1", name: "Arjun Patel", rollNo: "2021101", slot: "9:00-9:20" },
        { id: "S2", name: "Sneha Reddy", rollNo: "2021102", slot: "9:20-9:40" },
        { id: "S3", name: "Karan Mehta", rollNo: "2021103", slot: "9:40-10:00" },
        { id: "S4", name: "Divya Iyer", rollNo: "2021104", slot: "10:00-10:20" },
        { id: "S5", name: "Vishal Jain", rollNo: "2021105", slot: "10:20-10:40" },
        { id: "S6", name: "Pooja Desai", rollNo: "2021106", slot: "10:40-11:00" },
        { id: "S7", name: "Aditya Rao", rollNo: "2021107", slot: "11:00-11:20" },
        { id: "S8", name: "Kavya Nair", rollNo: "2021108", slot: "11:20-11:40" }
      ]
    },
    { 
      id: 2, 
      panelHead: "Prof. Meena Sharma", 
      room: "202", 
      timeSlot: "9:00-12:00",
      studentsAlloted: 8,
      students: [
        { id: "S9", name: "Rahul Gupta", rollNo: "2021109", slot: "9:00-9:20" },
        { id: "S10", name: "Priya Saxena", rollNo: "2021110", slot: "9:20-9:40" },
        { id: "S11", name: "Amit Verma", rollNo: "2021111", slot: "9:40-10:00" },
        { id: "S12", name: "Neha Kapoor", rollNo: "2021112", slot: "10:00-10:20" },
        { id: "S13", name: "Sanjay Dubey", rollNo: "2021113", slot: "10:20-10:40" },
        { id: "S14", name: "Ritu Sharma", rollNo: "2021114", slot: "10:40-11:00" },
        { id: "S15", name: "Deepak Yadav", rollNo: "2021115", slot: "11:00-11:20" },
        { id: "S16", name: "Anita Roy", rollNo: "2021116", slot: "11:20-11:40" }
      ]
    }
    // { 
    //   id: 3, 
    //   panelHead: "Dr. Arun Patel", 
    //   room: "203", 
    //   timeSlot: "1:00-5:00",
    //   studentsAlloted: 8,
    //   students: [
    //     { id: "S17", name: "Manoj Singh", rollNo: "2021117", slot: "1:00-1:20" },
    //     { id: "S18", name: "Swati Mishra", rollNo: "2021118", slot: "1:20-1:40" },
    //     { id: "S19", name: "Rajat Kumar", rollNo: "2021119", slot: "1:40-2:00" },
    //     { id: "S20", name: "Simran Kaur", rollNo: "2021120", slot: "2:00-2:20" },
    //     { id: "S21", name: "Vikas Pandey", rollNo: "2021121", slot: "2:20-2:40" },
    //     { id: "S22", name: "Nisha Joshi", rollNo: "2021122", slot: "2:40-3:00" },
    //     { id: "S23", name: "Gaurav Tripathi", rollNo: "2021123", slot: "3:00-3:20" },
    //     { id: "S24", name: "Pallavi Das", rollNo: "2021124", slot: "3:20-3:40" }
    //   ]
    // },
    // { 
    //   id: 4, 
    //   panelHead: "Prof. Kavita Singh", 
    //   room: "204", 
    //   timeSlot: "1:00-5:00",
    //   studentsAlloted: 8,
    //   students: [
    //     { id: "S25", name: "Suresh Rawat", rollNo: "2021125", slot: "1:00-1:20" },
    //     { id: "S26", name: "Megha Tiwari", rollNo: "2021126", slot: "1:20-1:40" },
    //     { id: "S27", name: "Ashok Chauhan", rollNo: "2021127", slot: "1:40-2:00" },
    //     { id: "S28", name: "Rekha Sinha", rollNo: "2021128", slot: "2:00-2:20" },
    //     { id: "S29", name: "Pankaj Agarwal", rollNo: "2021129", slot: "2:20-2:40" },
    //     { id: "S30", name: "Sunita Rai", rollNo: "2021130", slot: "2:40-3:00" },
    //     { id: "S31", name: "Ramesh Yadav", rollNo: "2021131", slot: "3:00-3:20" },
    //     { id: "S32", name: "Geeta Pandey", rollNo: "2021132", slot: "3:20-3:40" }
    //   ]
    // }
  ];

  const handleAttendanceToggle = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleMarkChange = (category, value) => {
    setMarks(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleFeedbackChange = (value) => {
    setFeedback(value);
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-6">
      {/* Top Section - Interview Overview */}
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">Interview Management</h1>
          <button
            onClick={() => setShowCreateInterview(true)}
            className="bg-secondary hover:bg-secondary/90 text-white p-1.5 sm:p-2 rounded-lg transition-all"
          >
            <Plus size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 border border-accent1/20">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-primary mb-2 sm:mb-3">{interviewData.title}</h2>
              
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {interviewData.topics.map((topic, idx) => (
                  <span key={idx} className="bg-accent1/20 text-accent1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                    {topic}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2 text-primary/70">
                  <Calendar size={14} className="sm:w-4 sm:h-4 text-secondary" />
                  <span>{interviewData.date}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-primary/70">
                  <Clock size={14} className="sm:w-4 sm:h-4 text-secondary" />
                  <span>{interviewData.time}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-primary/70">
                  <Clock size={14} className="sm:w-4 sm:h-4 text-accent2" />
                  <span>{interviewData.slotDuration} per student</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-primary/70">
                  <Users size={14} className="sm:w-4 sm:h-4 text-accent1" />
                  <span>{interviewData.panels} Panels</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-primary/70">
                  <User size={14} className="sm:w-4 sm:h-4 text-accent2" />
                  <span>{interviewData.totalStudents} Students</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row lg:flex-col gap-2 sm:gap-3">
              <button
                onClick={() => setShowAbsentees(true)}
                className="flex-1 lg:flex-none bg-secondary hover:bg-secondary/90 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap"
              >
                View Absentees
              </button>
              <button
                onClick={() => setShowInterviewDetail(true)}
                className="flex-1 lg:flex-none bg-accent1 hover:bg-accent1/90 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap"
              >
                View in Detail
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Interview Panels */}
      <div>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-primary mb-3 sm:mb-4">Interview Panels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4">
          {panels.map((panel) => (
            <div key={panel.id} className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border border-accent2/20">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-primary">{panel.panelHead}</h3>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-primary/60 mt-1">
                    <MapPin size={12} className="sm:w-3.5 sm:h-3.5 text-secondary" />
                    <span>Room {panel.room}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-primary/70 mb-2 sm:mb-3">
                <Clock size={12} className="sm:w-3.5 sm:h-3.5 text-accent1" />
                <span>{panel.timeSlot}</span>
              </div>

              <div className="mb-2 sm:mb-3">
                <p className="text-xs sm:text-sm text-primary/60 mb-1.5 sm:mb-2">
                  Students Allotted: <span className="font-bold text-accent2">{panel.studentsAlloted}</span>
                </p>
              </div>

              <div className="space-y-1.5 sm:space-y-2 max-h-64 overflow-y-auto">
                {panel.students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent({ ...student, panelHead: panel.panelHead, room: panel.room })}
                    className="w-full bg-accent1/10 hover:bg-accent1/20 border border-accent1/30 rounded-lg p-2 sm:p-2.5 text-left transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-primary">{student.name}</p>
                        <p className="text-xs text-primary/60">{student.rollNo}</p>
                      </div>
                      <span className="text-xs text-accent2 font-medium">{student.slot}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Absentees Modal */}
      {showAbsentees && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-3 sm:p-4 md:p-5 border-b sticky top-0 bg-white">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary flex items-center gap-2">
                <Mail size={18} className="sm:w-5 sm:h-5 text-secondary" />
                Absentees List
              </h3>
              <button onClick={() => setShowAbsentees(false)} className="text-primary/60 hover:text-primary">
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-3 sm:p-4 md:p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-2 sm:space-y-3">
                {absentees.map((student) => (
                  <div key={student.id} className="flex justify-between items-center p-2 sm:p-3 bg-background rounded-lg border border-primary/10">
                    <div>
                      <p className="text-xs sm:text-sm md:text-base font-medium text-primary">{student.name}</p>
                      <p className="text-xs text-primary/60">{student.rollNo}</p>
                      <p className="text-xs text-accent2 mt-0.5">Slot: {student.slot}</p>
                    </div>
                    <button className="text-secondary hover:text-secondary/80 text-xs sm:text-sm font-medium">
                      Report to SuperAdmin
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interview Detail Modal */}
      {showInterviewDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-3 sm:p-4 md:p-5 border-b sticky top-0 bg-white">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary">Interview Complete Details</h3>
              <button onClick={() => setShowInterviewDetail(false)} className="text-primary/60 hover:text-primary">
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-primary/60 mb-1">Title</h4>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-primary">{interviewData.title}</p>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-primary/60 mb-1.5 sm:mb-2">Topics Covered</h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {interviewData.topics.map((topic, idx) => (
                      <span key={idx} className="bg-accent1/20 text-accent1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-primary/60 mb-1">Date & Time</h4>
                    <p className="text-xs sm:text-sm md:text-base text-primary">{interviewData.date} | {interviewData.time}</p>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-primary/60 mb-1">Slot Duration</h4>
                    <p className="text-xs sm:text-sm md:text-base text-primary">{interviewData.slotDuration}</p>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-primary/60 mb-1">Total Panels</h4>
                    <p className="text-xs sm:text-sm md:text-base text-primary">{interviewData.panels}</p>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-primary/60 mb-1">Total Students</h4>
                    <p className="text-xs sm:text-sm md:text-base text-primary">{interviewData.totalStudents}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-primary/60 mb-2 sm:mb-3">Panel Allocation</h4>
                  <div className="space-y-2 sm:space-y-3">
                    {interviewData.rooms.map((room, idx) => (
                      <div key={idx} className="bg-background p-2 sm:p-3 md:p-4 rounded-lg border border-accent2/20">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div className="flex-1">
                            <p className="text-xs sm:text-sm md:text-base font-bold text-primary">Room {room.room}</p>
                            <p className="text-xs sm:text-sm text-primary/70">{room.time}</p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-xs sm:text-sm font-medium text-primary">{room.panelHead}</p>
                            <p className="text-xs text-primary/60">{room.email}</p>
                            <p className="text-xs text-accent2 mt-0.5">{room.students} students assigned</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 md:p-5 border-t sticky bottom-0 bg-white">
              <button className="flex-1 bg-accent1 hover:bg-accent1/90 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2">
                <Edit2 size={14} className="sm:w-4 sm:h-4" />
                Edit
              </button>
              <button onClick={() => setShowInterviewDetail(false)} className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Interview Modal */}
      {showCreateInterview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-3 sm:p-4 md:p-5 border-b sticky top-0 bg-white">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary">Create New Interview</h3>
              <button onClick={() => setShowCreateInterview(false)} className="text-primary/60 hover:text-primary">
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5 sm:mb-2">Interview Title</label>
                  <input type="text" className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1" placeholder="Enter interview title" />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5 sm:mb-2">Topics (comma separated)</label>
                  <input type="text" className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1" placeholder="Topic 1, Topic 2, Topic 3" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5 sm:mb-2">Date</label>
                    <input type="date" className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5 sm:mb-2">Start Time</label>
                    <input type="time" className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5 sm:mb-2">Slot Duration (mins)</label>
                    <input type="number" className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1" placeholder="20" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5 sm:mb-2">Number of Panels</label>
                    <input type="number" className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1" placeholder="4" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5 sm:mb-2">Panel Details (Name, Email, Room, Time Slot)</label>
                  <textarea className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1 min-h-[80px] sm:min-h-[100px]" placeholder="Dr. Name, email@example.com, Room 201, 9:00-12:00"></textarea>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5 sm:mb-2">Upload Student List (CSV)</label>
                  <input type="file" accept=".csv" className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 md:p-5 border-t sticky bottom-0 bg-white">
              <button className="flex-1 bg-secondary hover:bg-secondary/90 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all">
                Create Interview
              </button>
              <button onClick={() => setShowCreateInterview(false)} className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal (Panel View) */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-3 sm:p-4 md:p-5 border-b sticky top-0 bg-white">
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary">{selectedStudent.name}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <p className="text-xs sm:text-sm text-primary/60">{selectedStudent.rollNo}</p>
                  <span className="text-xs sm:text-sm text-accent2 font-medium">Slot: {selectedStudent.slot}</span>
                </div>
                <p className="text-xs sm:text-sm text-primary/60 mt-1">Panel: {selectedStudent.panelHead} | Room: {selectedStudent.room}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-primary/60 hover:text-primary">
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-3 sm:space-y-4">
                {/* Attendance Section */}
                <div className="bg-background p-3 sm:p-4 rounded-lg border border-accent2/20">
                  <h4 className="text-xs sm:text-sm font-semibold text-primary mb-2 sm:mb-3">Attendance</h4>
                  <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attendance[selectedStudent.id] || false}
                      onChange={() => handleAttendanceToggle(selectedStudent.id)}
                      className="w-5 h-5 sm:w-6 sm:h-6 text-accent1 rounded"
                    />
                    <span className="text-xs sm:text-sm md:text-base text-primary">
                      {attendance[selectedStudent.id] ? 'Present' : 'Mark as Present'}
                    </span>
                  </label>
                </div>

                {/* Marks Section */}
                <div className="bg-background p-3 sm:p-4 rounded-lg border border-accent1/20">
                  <h4 className="text-xs sm:text-sm font-semibold text-primary mb-2 sm:mb-3">Evaluation Marks</h4>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <label className="block text-xs sm:text-sm text-primary/70 mb-1">Technical Knowledge (out of 25)</label>
                      <input
                        type="number"
                        min="0"
                        max="25"
                        value={marks.technical || ''}
                        onChange={(e) => handleMarkChange('technical', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1"
                        placeholder="0-25"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-primary/70 mb-1">Communication Skills (out of 25)</label>
                      <input
                        type="number"
                        min="0"
                        max="25"
                        value={marks.communication || ''}
                        onChange={(e) => handleMarkChange('communication', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1"
                        placeholder="0-25"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-primary/70 mb-1">Problem Solving (out of 25)</label>
                      <input
                        type="number"
                        min="0"
                        max="25"
                        value={marks.problemSolving || ''}
                        onChange={(e) => handleMarkChange('problemSolving', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1"
                        placeholder="0-25"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-primary/70 mb-1">Overall Presentation (out of 25)</label>
                      <input
                        type="number"
                        min="0"
                        max="25"
                        value={marks.presentation || ''}
                        onChange={(e) => handleMarkChange('presentation', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1"
                        placeholder="0-25"
                      />
                    </div>
                    <div className="pt-2 sm:pt-3 border-t border-primary/10">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-semibold text-primary">Total Score:</span>
                        <span className="text-base sm:text-lg md:text-xl font-bold text-accent2">
                          {(Number(marks.technical || 0) + Number(marks.communication || 0) + Number(marks.problemSolving || 0) + Number(marks.presentation || 0))}/100
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="bg-background p-3 sm:p-4 rounded-lg border border-accent2/20">
                  <h4 className="text-xs sm:text-sm font-semibold text-primary mb-2 sm:mb-3">Feedback & Comments</h4>
                  <textarea
                    value={feedback}
                    onChange={(e) => handleFeedbackChange(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1 min-h-[80px] sm:min-h-[100px] resize-none"
                    placeholder="Enter detailed feedback about the candidate's performance, strengths, areas of improvement..."
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 md:p-5 border-t sticky bottom-0 bg-white">
              <button className="flex-1 bg-secondary hover:bg-secondary/90 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all">
                Save Evaluation
              </button>
              <button onClick={() => setSelectedStudent(null)} className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

 