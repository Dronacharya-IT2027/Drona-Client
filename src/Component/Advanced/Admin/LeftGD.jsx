
import React, { useState } from 'react';
import { X, Plus, Mail, Users, Clock, Calendar, MapPin, Edit2 } from 'lucide-react';

export const LeftGD =  () => {
  const [showAbsentees, setShowAbsentees] = useState(false);
  const [showGDDetail, setShowGDDetail] = useState(false);
  const [showCreateGD, setShowCreateGD] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [marks, setMarks] = useState({});
  const [feedback, setFeedback] = useState({});

  // Sample data
  const gdData = {
    theme: "Impact of AI on Employment",
    subtopics: ["Automation", "Job Creation", "Skill Gap", "Ethics"],
    date: "Oct 20, 2025",
    time: "9:00 AM - 12:00 PM",
    slotDuration: "30 mins",
    judges: 3,
    totalSlots: 6,
    membersPerTeam: 8,
    rooms: [
      { room: "1231", time: "9:00-10:30", judge: "Dr. Rakesh Kumar", email: "rakesh@example.com", groups: 2 },
      { room: "1232", time: "10:30-12:00", judge: "Prof. Anita Sharma", email: "anita@example.com", groups: 2 },
      { room: "1233", time: "9:00-12:00", judge: "Dr. Vijay Singh", email: "vijay@example.com", groups: 2 }
    ]
  };

  const absentees = [
    { id: 1, name: "Rahul Verma", rollNo: "2021001" },
    { id: 2, name: "Priya Singh", rollNo: "2021002" },
    { id: 3, name: "Amit Kumar", rollNo: "2021003" },
    { id: 4, name: "Neha Gupta", rollNo: "2021004" },
    { id: 5, name: "Rohan Sharma", rollNo: "2021005" }
  ];

  const groupMembers = [
    { id: 1, name: "Arjun Patel", rollNo: "2021101" },
    { id: 2, name: "Sneha Reddy", rollNo: "2021102" },
    { id: 3, name: "Karan Mehta", rollNo: "2021103" },
    { id: 4, name: "Divya Iyer", rollNo: "2021104" },
    { id: 5, name: "Vishal Jain", rollNo: "2021105" },
    { id: 6, name: "Pooja Desai", rollNo: "2021106" },
    { id: 7, name: "Aditya Rao", rollNo: "2021107" },
    { id: 8, name: "Kavya Nair", rollNo: "2021108" }
  ];

  const judges = [
    { 
      id: 1, 
      name: "Dr. Rakesh Kumar", 
      room: "1231", 
      timeSlot: "9:00-10:30",
      groupsAlloted: 2,
      groups: [
        { id: "G1", name: "Group 1", members: 8 },
        { id: "G2", name: "Group 2", members: 8 }
      ]
    },
    { 
      id: 2, 
      name: "Prof. Anita Sharma", 
      room: "1232", 
      timeSlot: "10:30-12:00",
      groupsAlloted: 2,
      groups: [
        { id: "G3", name: "Group 3", members: 8 },
        { id: "G4", name: "Group 4", members: 8 }
      ]
    },
    { 
      id: 3, 
      name: "Dr. Vijay Singh", 
      room: "1233", 
      timeSlot: "9:00-12:00",
      groupsAlloted: 2,
      groups: [
        { id: "G5", name: "Group 5", members: 8 },
        { id: "G6", name: "Group 6", members: 8 }
      ]
    }
  ];

  const handleAttendanceToggle = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleMarkChange = (studentId, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const handleFeedbackChange = (studentId, value) => {
    setFeedback(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-6">
      {/* Top Section - GD Overview */}
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">Group Discussion Management</h1>
          <button
            onClick={() => setShowCreateGD(true)}
            className="bg-secondary hover:bg-secondary/90 text-white p-1.5 sm:p-2 rounded-lg transition-all"
          >
            <Plus size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 border border-accent1/20">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-primary mb-2 sm:mb-3">{gdData.theme}</h2>
              
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {gdData.subtopics.map((topic, idx) => (
                  <span key={idx} className="bg-accent1/20 text-accent1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                    {topic}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2 text-primary/70">
                  <Calendar size={14} className="sm:w-4 sm:h-4 text-secondary" />
                  <span>{gdData.date}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-primary/70">
                  <Clock size={14} className="sm:w-4 sm:h-4 text-secondary" />
                  <span>{gdData.time}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-primary/70">
                  <Clock size={14} className="sm:w-4 sm:h-4 text-accent2" />
                  <span>{gdData.slotDuration} per slot</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-primary/70">
                  <Users size={14} className="sm:w-4 sm:h-4 text-accent1" />
                  <span>{gdData.judges} Judges</span>
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
                onClick={() => setShowGDDetail(true)}
                className="flex-1 lg:flex-none bg-accent1 hover:bg-accent1/90 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap"
              >
                View in Detail
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Judges Panel */}
      <div>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-primary mb-3 sm:mb-4">Judges Panel</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {judges.map((judge) => (
            <div key={judge.id} className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border border-accent2/20">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-primary">{judge.name}</h3>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-primary/60 mt-1">
                    <MapPin size={12} className="sm:w-3.5 sm:h-3.5 text-secondary" />
                    <span>Room {judge.room}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-primary/70 mb-2 sm:mb-3">
                <Clock size={12} className="sm:w-3.5 sm:h-3.5 text-accent1" />
                <span>{judge.timeSlot}</span>
              </div>

              <div className="mb-2 sm:mb-3">
                <p className="text-xs sm:text-sm text-primary/60 mb-1.5 sm:mb-2">
                  Groups Allotted: <span className="font-bold text-accent2">{judge.groupsAlloted}</span>
                </p>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                {judge.groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup({ ...group, judgeName: judge.name })}
                    className="w-full bg-accent1/10 hover:bg-accent1/20 border border-accent1/30 rounded-lg p-2 sm:p-2.5 text-left transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium text-primary">{group.name}</span>
                      <span className="text-xs text-primary/60">{group.members} members</span>
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

      {/* GD Detail Modal */}
      {showGDDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-3 sm:p-4 md:p-5 border-b sticky top-0 bg-white">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary">GD Complete Details</h3>
              <button onClick={() => setShowGDDetail(false)} className="text-primary/60 hover:text-primary">
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-primary/60 mb-1">Theme</h4>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-primary">{gdData.theme}</p>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-primary/60 mb-1.5 sm:mb-2">Subtopics</h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {gdData.subtopics.map((topic, idx) => (
                      <span key={idx} className="bg-accent1/20 text-accent1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-primary/60 mb-1">Date & Time</h4>
                    <p className="text-xs sm:text-sm md:text-base text-primary">{gdData.date} | {gdData.time}</p>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-primary/60 mb-1">Slot Duration</h4>
                    <p className="text-xs sm:text-sm md:text-base text-primary">{gdData.slotDuration}</p>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-primary/60 mb-1">Members per Team</h4>
                    <p className="text-xs sm:text-sm md:text-base text-primary">{gdData.membersPerTeam}</p>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-primary/60 mb-1">Total Judges</h4>
                    <p className="text-xs sm:text-sm md:text-base text-primary">{gdData.judges}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-primary/60 mb-2 sm:mb-3">Room Allocation</h4>
                  <div className="space-y-2 sm:space-y-3">
                    {gdData.rooms.map((room, idx) => (
                      <div key={idx} className="bg-background p-2 sm:p-3 md:p-4 rounded-lg border border-accent2/20">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div className="flex-1">
                            <p className="text-xs sm:text-sm md:text-base font-bold text-primary">Room {room.room}</p>
                            <p className="text-xs sm:text-sm text-primary/70">{room.time}</p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-xs sm:text-sm font-medium text-primary">{room.judge}</p>
                            <p className="text-xs text-primary/60">{room.email}</p>
                            <p className="text-xs text-accent2 mt-0.5">{room.groups} groups assigned</p>
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
              <button onClick={() => setShowGDDetail(false)} className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create GD Modal */}
      {showCreateGD && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-3 sm:p-4 md:p-5 border-b sticky top-0 bg-white">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary">Create New GD</h3>
              <button onClick={() => setShowCreateGD(false)} className="text-primary/60 hover:text-primary">
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5 sm:mb-2">Theme</label>
                  <input type="text" className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1" placeholder="Enter GD theme" />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5 sm:mb-2">Subtopics (comma separated)</label>
                  <input type="text" className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1" placeholder="Topic 1, Topic 2, Topic 3" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5 sm:mb-2">Date</label>
                    <input type="date" className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5 sm:mb-2">Time</label>
                    <input type="time" className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5 sm:mb-2">Slot Duration (mins)</label>
                    <input type="number" className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1" placeholder="30" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5 sm:mb-2">Members per Team</label>
                    <input type="number" className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1" placeholder="8" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-primary mb-1.5 sm:mb-2">Judges (Name, Email, Room, Time Slot)</label>
                  <textarea className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1 min-h-[80px] sm:min-h-[100px]" placeholder="Dr. Name, email@example.com, Room 101, 9:00-10:30"></textarea>
                </div>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 md:p-5 border-t sticky bottom-0 bg-white">
              <button className="flex-1 bg-secondary hover:bg-secondary/90 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all">
                Create GD
              </button>
              <button onClick={() => setShowCreateGD(false)} className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Detail Modal (Judge View) */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-3 sm:p-4 md:p-5 border-b sticky top-0 bg-white">
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary">{selectedGroup.name}</h3>
                <p className="text-xs sm:text-sm text-primary/60">Judge: {selectedGroup.judgeName}</p>
              </div>
              <button onClick={() => setSelectedGroup(null)} className="text-primary/60 hover:text-primary">
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="mb-3 sm:mb-4">
                <button className="w-full bg-accent2 hover:bg-accent2/90 text-primary px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all">
                  Mark Attendance
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {groupMembers.map((student) => (
                  <div key={student.id} className="bg-background p-3 sm:p-4 rounded-lg border border-primary/10">
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <input
                          type="checkbox"
                          checked={attendance[student.id] || false}
                          onChange={() => handleAttendanceToggle(student.id)}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-accent1 rounded"
                        />
                        <div>
                          <p className="text-xs sm:text-sm md:text-base font-medium text-primary">{student.name}</p>
                          <p className="text-xs text-primary/60">{student.rollNo}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-primary/60 mb-1">Marks (out of 10)</label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={marks[student.id] || ''}
                          onChange={(e) => handleMarkChange(student.id, e.target.value)}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1"
                          placeholder="0-10"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-primary/60 mb-1">Feedback</label>
                        <input
                          type="text"
                          value={feedback[student.id] || ''}
                          onChange={(e) => handleFeedbackChange(student.id, e.target.value)}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-primary/20 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-accent1"
                          placeholder="Enter feedback"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 sm:p-4 md:p-5 border-t sticky bottom-0 bg-white">
              <button onClick={() => setSelectedGroup(null)} className="w-full bg-primary hover:bg-primary/90 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

 