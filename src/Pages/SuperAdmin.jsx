// src/Pages/SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Eye, BarChart3, PieChart, X, Trash2 } from 'lucide-react';
import AdminSignupRequests from './AdminRequest'; // same import pattern as Admin.jsx

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const token = localStorage.getItem('token') || '';

export default function SuperAdminDashboard() {
  const [coordinators, setCoordinators] = useState([]);
  const [scheduledTests, setScheduledTests] = useState([]);
  const [branchAverages, setBranchAverages] = useState([]);
  const [branchSummary, setBranchSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state for admin signup requests (same component used in Admin.jsx)
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  // Add-admin modal state
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [addAdminEmail, setAddAdminEmail] = useState('');
  const [addAdminLoading, setAddAdminLoading] = useState(false);
  const [addAdminMsg, setAddAdminMsg] = useState(null); // { type: 'success'|'error', text }

  // Per-action state for removal (can hold id being removed)
  const [removingEmail, setRemovingEmail] = useState(null);

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

  // Helper: call backend to make a user admin
  const handleMakeAdmin = async (e) => {
    e && e.preventDefault();
    setAddAdminMsg(null);

    const email = (addAdminEmail || '').trim().toLowerCase();
    if (!email) {
      setAddAdminMsg({ type: 'error', text: 'Please enter a valid email.' });
      return;
    }

    setAddAdminLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/api/admin-manag/admin/make-admin`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.success) {
        setAddAdminMsg({ type: 'success', text: res.data.message || 'User promoted to admin.' });
        setAddAdminEmail('');
        // refresh coordinators to reflect new admin
        await fetchCoordinators();
        // optionally close modal after short delay
        setTimeout(() => {
          setShowAddAdminModal(false);
          setAddAdminMsg(null);
        }, 900);
      } else {
        setAddAdminMsg({ type: 'error', text: (res.data && res.data.message) || 'Failed to promote user.' });
      }
    } catch (err) {
      console.error('Make admin error:', err);
      const msg =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        'Server error while making admin';
      setAddAdminMsg({ type: 'error', text: msg });
    } finally {
      setAddAdminLoading(false);
    }
  };

  // Helper: call backend to remove admin role
  const handleRemoveAdmin = async (email) => {
    if (!email) return;
    // simple confirm to avoid accidental removal
    const ok = window.confirm(`Are you sure you want to remove admin privileges from ${email}?`);
    if (!ok) return;

    setRemovingEmail(email);
    try {
      const res = await axios.post(
        `${API_BASE}/api/admin-manag/admin/remove-admin`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.success) {
        // refresh coordinators
        await fetchCoordinators();
      } else {
        // show alert if server returned non-success
        const msg = (res.data && res.data.message) || 'Failed to remove admin.';
        window.alert(msg);
      }
    } catch (err) {
      console.error('Remove admin error:', err);
      const msg =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        'Server error while removing admin';
      window.alert(msg);
    } finally {
      setRemovingEmail(null);
    }
  };

  if (loading) return <div className="text-center mt-32">Loading dashboard data...</div>;

  return (
    <div className="min-h-screen mt-24 p-2 sm:p-4 font-kodchasan">
      <div className="max-w-[1600px] mx-auto">
        {/* Header with modal trigger */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-primary">Super Admin Dashboard</h1>

          {/* Requests modal trigger button - added, won't remove any functionality */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRequestsModal(true)}
              className="inline-flex items-center gap-2 px-3 py-2 bg-secondary text-white rounded-lg font-semibold hover:shadow-md transition"
              title="View Signup Requests"
            >
              <Plus className="w-4 h-4" />
              Signup Requests
            </button>
          </div>
        </div>

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

                {/* Add admin button (new) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAddAdminEmail('');
                      setAddAdminMsg(null);
                      setShowAddAdminModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent2 text-white rounded-lg font-semibold hover:shadow transition"
                    title="Add Admin"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {coordinators
                  .slice() // copy so sort does not mutate original in unexpected ways
                  .sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0))
                  .map((coord) => (
                    <div
                      key={coord._id}
                      className={`bg-white/80 rounded p-2 sm:p-3 flex justify-between items-center border-l-4 transition ${coord.isActive ? 'border-accent1 shadow-md' : 'border-transparent'}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs sm:text-sm font-semibold text-primary truncate">{coord.name}</h3>
                          {coord.isActive && (
                            <span className="bg-accent1 text-white text-[10px] px-1.5 py-0.5 rounded flex-shrink-0">ACTIVE</span>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-xs text-primary/60">Section: {coord.branch || 'N/A'}</p>
                        <p className="text-[10px] sm:text-xs text-primary/60">Email: {coord.email || 'N/A'}</p>
                      </div>

                      <div className="flex items-center gap-2 ml-2">
                        {/* Existing Active/Deactive button (unchanged) */}
                        <button className="bg-primary text-white px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs hover:bg-primary/90 transition ml-2 flex-shrink-0">
                          {coord.isActive ? 'Deactive' : 'Active'}
                        </button>

                        {/* Remove admin icon (new) */}
                        <button
                          onClick={() => handleRemoveAdmin(coord.email)}
                          className="p-2 rounded-md hover:bg-gray-100 transition ml-2 flex-shrink-0"
                          title={`Remove admin: ${coord.email}`}
                          disabled={!!removingEmail}
                        >
                          {removingEmail === coord.email ? (
                            <span className="text-xs">Removing...</span>
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-500" />
                          )}
                        </button>
                      </div>
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
                {scheduledTests.flatMap(branch => branch.tests || []).map((test) => (
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

        {/* Modal: Admin Signup Requests (same component you used in Admin.jsx) */}
        {showRequestsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowRequestsModal(false)}
            />
            {/* Modal container */}
            <div className="relative w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] max-h-[85vh] overflow-y-auto bg-white rounded-xl shadow-2xl p-4 border border-primary/10 z-50">
              {/* Modal header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-primary">Signup Requests</h3>
                <button
                  onClick={() => setShowRequestsModal(false)}
                  className="p-2 rounded-md hover:bg-gray-100 transition"
                  aria-label="Close signup requests"
                >
                  <X className="w-5 h-5 text-primary" />
                </button>
              </div>

              {/* The actual AdminSignupRequests component (unchanged) */}
              <div>
                <AdminSignupRequests />
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add Admin */}
        {showAddAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddAdminModal(false)} />
            <div className="relative w-[95%] sm:w-[90%] md:w-[520px] max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-2xl p-5 border border-primary/10 z-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-primary">Add Admin</h3>
                <button
                  onClick={() => setShowAddAdminModal(false)}
                  className="p-2 rounded-md hover:bg-gray-100 transition"
                  aria-label="Close add admin"
                >
                  <X className="w-5 h-5 text-primary" />
                </button>
              </div>

              <form onSubmit={handleMakeAdmin}>
                <label className="block text-xs sm:text-sm font-medium text-primary/80 mb-2">User Email</label>
                <input
                  type="email"
                  value={addAdminEmail}
                  onChange={(e) => setAddAdminEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 border rounded-lg mb-3 text-sm"
                  required
                />

                {addAdminMsg && (
                  <div className={`mb-3 text-sm ${addAdminMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {addAdminMsg.text}
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAdminModal(false)}
                    className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 transition"
                    disabled={addAdminLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-semibold hover:shadow transition"
                    disabled={addAdminLoading}
                  >
                    {addAdminLoading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
