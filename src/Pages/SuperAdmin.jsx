import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Eye, BarChart3, PieChart } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const token = localStorage.getItem('token') || '';

export default function SuperAdminDashboard() {
  const [coordinators, setCoordinators] = useState([]);
  const [scheduledTests, setScheduledTests] = useState([]);
  const [branchAverages, setBranchAverages] = useState([]);
  const [branchSummary, setBranchSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoordinators = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/super-admin/admins`, {
        params: { limit: 50 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoordinators(res.data.results || []);
    } catch (err) {
      console.error('Error fetching coordinators:', err);
    }
  };

  const fetchScheduledTests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/super-admin/tests/scheduled`, {
        params: { limitTests: 5 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setScheduledTests(res.data.results || []);
    } catch (err) {
      console.error('Error fetching scheduled tests:', err);
    }
  };

  const fetchBranchAverages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/super-admin/reports/branch-averages`, {
        params: { limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setBranchAverages(res.data.results || []);
    } catch (err) {
      console.error('Error fetching branch averages:', err);
    }
  };

  const fetchBranchSummary = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/super-admin/branches/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBranchSummary(res.data.results || []);
    } catch (err) {
      console.error('Error fetching branch summary:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCoordinators(), fetchScheduledTests(), fetchBranchAverages(), fetchBranchSummary()])
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-32">Loading dashboard data...</div>;

  return (
    <div className="min-h-screen mt-24 p-2 sm:p-4 font-kodchasan">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-primary mb-4">Super Admin Dashboard</h1>

        <div className="grid lg:grid-cols-2 gap-3 sm:gap-4">

          {/* Left Section */}
          <div className="space-y-3 sm:space-y-4">

            {/* Coordinators */}
            <div className="bg-white/60 backdrop-blur rounded-lg p-3 sm:p-4 shadow-sm border border-primary/10">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm sm:text-base font-semibold text-primary flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Class Coordinators
                </h2>
              </div>
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {coordinators.sort((a, b) => b.isActive - a.isActive).map((coord) => (
                  <div key={coord._id} className={`bg-white/80 rounded p-2 sm:p-3 flex justify-between items-center border-l-4 transition ${coord.isActive ? 'border-accent1 shadow-md' : 'border-transparent'}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-semibold text-primary truncate">{coord.name}</h3>
                        {coord.isActive && (
                          <span className="bg-accent1 text-white text-[10px] px-1.5 py-0.5 rounded flex-shrink-0">ACTIVE</span>
                        )}
                      </div>
                      <p className="text-[10px] sm:text-xs text-primary/60">Section: {coord.branch || 'N/A'}</p>
                    </div>
                    <button className="bg-primary text-white px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs hover:bg-primary/90 transition ml-2 flex-shrink-0">
                      {coord.isActive ? 'Deactive' : 'Active'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Scheduled Tests */}
            <div className="bg-white/60 backdrop-blur rounded-lg p-3 sm:p-4 shadow-sm border border-primary/10">
              <h2 className="text-sm sm:text-base font-semibold text-primary mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" /> Scheduled Tests
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {scheduledTests.flatMap(branch => branch.tests).map((test) => (
                  <div key={test._id} className="bg-white/80 rounded p-2 border-l-4 border-secondary/50 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-primary">{test.title}</h4>
                      <p className="text-[10px] sm:text-xs text-primary/70">Start: {new Date(test.startDate).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Section */}
          <div className="space-y-3 sm:space-y-4">

            {/* Branch Summary */}
            <div className="bg-white/60 backdrop-blur rounded-lg p-3 sm:p-4 shadow-sm border border-primary/10">
              <h2 className="text-sm sm:text-base font-semibold text-primary mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Branch Summary
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {branchSummary.map((branch) => (
                  <div key={branch.branch} className="bg-white/80 rounded p-2 border-l-4 border-accent1/50 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-primary">{branch.branch || 'N/A'}</h4>
                      <p className="text-[10px] sm:text-xs text-primary/70">
                        Students: {branch.studentCount}, Tests: {branch.testsCount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Branch Average Scores */}
            <div className="bg-white/60 backdrop-blur rounded-lg p-3 sm:p-4 shadow-sm border border-primary/10">
              <h2 className="text-sm sm:text-base font-semibold text-primary mb-3 flex items-center gap-2">
                <PieChart className="w-4 h-4" /> Branch Average Scores
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {branchAverages.map((b) => (
                  <div key={b.branch} className="bg-white/80 rounded p-2 border-l-4 border-accent2/50 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-primary">{b.branch}</h4>
                      <p className="text-[10px] sm:text-xs text-primary/70">
                        Avg Score: {b.avgMark} ({b.submissionsCount} submissions, {b.distinctStudentsCount} students)
                      </p>
                    </div>
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
