import React, { useState } from 'react';
import { Users, Plus, Eye, BarChart3, PieChart, AlertCircle, UserCheck, UserX } from 'lucide-react';

export default function SuperAdminDashboard() {
  const [coordinators] = useState([
    { id: 1, name: 'Rajesh Kumar', section: 'CSE-A', isActive: true },
    { id: 2, name: 'Priya Sharma', section: 'CSE-B', isActive: true },
    { id: 3, name: 'Amit Singh', section: 'ECE-A', isActive: false },
    { id: 4, name: 'Neha Gupta', section: 'ECE-B', isActive: false },
    { id: 5, name: 'Vikram Rao', section: 'ME-A', isActive: false },
    { id: 6, name: 'Sneha Patel', section: 'ME-B', isActive: false },
  ]);

  const [reports] = useState([
    { id: 1, student: 'Rahul Verma', admin: 'Rajesh Kumar', reason: 'Misconduct during test', date: '2025-10-14' },
    { id: 2, student: 'Anjali Reddy', admin: 'Priya Sharma', reason: 'Absent without notice', date: '2025-10-13' },
    { id: 3, student: 'Karan Mehta', admin: 'Amit Singh', reason: 'Incomplete assignment', date: '2025-10-12' },
  ]);

  const pieData = [
    { label: 'Test', value: 65, color: '#ff5734' },
    { label: 'GD', value: 45, color: '#be94f5' },
    { label: 'Interview', value: 38, color: '#fccc42' },
  ];

  const barData = [
    { month: 'Aug', test: 45, gd: 30, interview: 25 },
    { month: 'Sep', test: 55, gd: 38, interview: 30 },
    { month: 'Oct', test: 65, gd: 45, interview: 38 },
  ];

  return (
    <div className="min-h-screen mt-24 p-2 sm:p-4 font-kodchasan">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-primary">Super Admin Dashboard</h1>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Left Section */}
          <div className="space-y-3 sm:space-y-4">
            {/* Coordinators List */}
            <div className="bg-white/60 backdrop-blur rounded-lg p-3 sm:p-4 shadow-sm border border-primary/10">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm sm:text-base font-semibold text-primary flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Class Coordinators
                </h2>
                <button className="bg-secondary text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm flex items-center gap-1 hover:bg-secondary/90 transition">
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              </div>
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {coordinators.sort((a, b) => b.isActive - a.isActive).map((coord) => (
                  <div
                    key={coord.id}
                    className={`bg-white/80 rounded p-2 sm:p-3 flex justify-between items-center border-l-4 transition ${
                      coord.isActive
                        ? 'border-accent1 shadow-md'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-semibold text-primary truncate">{coord.name}</h3>
                        {coord.isActive && (
                          <span className="bg-accent1 text-white text-[10px] px-1.5 py-0.5 rounded flex-shrink-0">ACTIVE</span>
                        )}
                      </div>
                      <p className="text-[10px] sm:text-xs text-primary/60">Section: {coord.section}</p>
                    </div>
                    <button className="bg-primary text-white px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs hover:bg-primary/90 transition ml-2 flex-shrink-0">
                      {coord.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              {/* Test Card */}
              <div className="bg-white/60 backdrop-blur rounded-lg p-3 shadow-sm border border-secondary/20 hover:shadow-md transition">
                <h3 className="text-xs sm:text-sm font-bold text-secondary mb-1">DSA Fundamentals</h3>
                <p className="text-[10px] sm:text-xs text-primary/70 mb-2 line-clamp-2">Arrays, Linked Lists, Trees, Graphs, Sorting</p>
                <button className="w-full bg-secondary/10 text-secondary px-2 py-1 rounded text-[10px] sm:text-xs flex items-center justify-center gap-1 hover:bg-secondary/20 transition">
                  <Eye className="w-3 h-3" />
                  View Details
                </button>
              </div>

              {/* GD Card */}
              <div className="bg-white/60 backdrop-blur rounded-lg p-3 shadow-sm border border-accent1/20 hover:shadow-md transition">
                <h3 className="text-xs sm:text-sm font-bold text-accent1 mb-1">AI in Education</h3>
                <p className="text-[10px] sm:text-xs text-primary/70 mb-2 line-clamp-2">Machine Learning, Ethics, Future Impact</p>
                <button className="w-full bg-accent1/10 text-accent1 px-2 py-1 rounded text-[10px] sm:text-xs flex items-center justify-center gap-1 hover:bg-accent1/20 transition">
                  <Eye className="w-3 h-3" />
                  View Details
                </button>
              </div>

              {/* Interview Card */}
              <div className="bg-white/60 backdrop-blur rounded-lg p-3 shadow-sm border border-accent2/20 hover:shadow-md transition">
                <h3 className="text-xs sm:text-sm font-bold text-accent2 mb-1">Tech Round</h3>
                <p className="text-[10px] sm:text-xs text-primary/70 mb-2 line-clamp-2">Problem Solving, System Design, Coding</p>
                <button className="w-full bg-accent2/10 text-accent2 px-2 py-1 rounded text-[10px] sm:text-xs flex items-center justify-center gap-1 hover:bg-accent2/20 transition">
                  <Eye className="w-3 h-3" />
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-3 sm:space-y-4">
            {/* Pie Chart */}
            <div className="bg-white/60 backdrop-blur rounded-lg p-3 sm:p-4 shadow-sm border border-primary/10">
              <h2 className="text-sm sm:text-base font-semibold text-primary mb-3 flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Student Participation
              </h2>
              <div className="flex justify-center items-center">
                <svg viewBox="0 0 200 200" className="w-40 h-40 sm:w-48 sm:h-48">
                  {(() => {
                    let cumulative = 0;
                    return pieData.map((data, i) => {
                      const percentage = data.value / pieData.reduce((a, b) => a + b.value, 0);
                      const angle = percentage * 360;
                      const startAngle = cumulative;
                      cumulative += angle;
                      
                      const startRad = (startAngle - 90) * Math.PI / 180;
                      const endRad = (startAngle + angle - 90) * Math.PI / 180;
                      const x1 = 100 + 80 * Math.cos(startRad);
                      const y1 = 100 + 80 * Math.sin(startRad);
                      const x2 = 100 + 80 * Math.cos(endRad);
                      const y2 = 100 + 80 * Math.sin(endRad);
                      const largeArc = angle > 180 ? 1 : 0;
                      
                      return (
                        <g key={i}>
                          <path
                            d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                            fill={data.color}
                            className="hover:opacity-80 transition"
                          />
                        </g>
                      );
                    });
                  })()}
                </svg>
              </div>
              <div className="flex justify-center gap-3 sm:gap-4 mt-2">
                {pieData.map((data, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded" style={{ backgroundColor: data.color }}></div>
                    <span className="text-[10px] sm:text-xs text-primary">{data.label} ({data.value})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white/60 backdrop-blur rounded-lg p-3 sm:p-4 shadow-sm border border-primary/10">
              <h2 className="text-sm sm:text-base font-semibold text-primary mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Monthly Trends
              </h2>
              <div className="flex items-end justify-around h-32 sm:h-40">
                {barData.map((data, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div className="flex gap-0.5 sm:gap-1 items-end h-28 sm:h-32">
                      <div
                        className="w-3 sm:w-4 bg-secondary rounded-t hover:opacity-80 transition"
                        style={{ height: `${data.test}%` }}
                      ></div>
                      <div
                        className="w-3 sm:w-4 bg-accent1 rounded-t hover:opacity-80 transition"
                        style={{ height: `${data.gd}%` }}
                      ></div>
                      <div
                        className="w-3 sm:w-4 bg-accent2 rounded-t hover:opacity-80 transition"
                        style={{ height: `${data.interview}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-primary font-medium">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reporting System */}
            <div className="bg-white/60 backdrop-blur rounded-lg p-3 sm:p-4 shadow-sm border border-primary/10">
              <h2 className="text-sm sm:text-base font-semibold text-primary mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Student Reports
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {reports.map((report) => (
                  <div key={report.id} className="bg-white/80 rounded p-2 border-l-4 border-secondary/50">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-primary">{report.student}</h4>
                      <span className="text-[10px] text-primary/50">{report.date}</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-primary/70 mb-1">{report.reason}</p>
                    <p className="text-[10px] text-primary/50">Reported by: {report.admin}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}