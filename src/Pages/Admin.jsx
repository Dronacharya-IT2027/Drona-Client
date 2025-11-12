// src/Pages/Admin.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import { LeftGD } from '../Component/Advanced/Admin/LeftGD';
import { LeftTest } from '../Component/Advanced/Admin/LeftTest';
import { RightGD } from '../Component/Advanced/Admin/RightGD';
import { RightTest } from '../Component/Advanced/Admin/RightTest';
import { LeftDt } from '../Component/Advanced/Admin/LeftDt';
import { RightDt } from '../Component/Advanced/Admin/RightDt';
import AdminSignupRequests from './AdminRequest';

// Read API base from common env names (Vite, CRA, Next)
const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  '';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('test');

  // admin check state
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [testsData, setTestsData] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // call admin-check API on mount
  useEffect(() => {
    const checkAdminAndLoadTests = async () => {
      setChecking(true);
      setErrorMsg('');

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAdmin(false);
          setErrorMsg('Authorization token missing. Please log in.');
          setChecking(false);
          return;
        }

        const res = await axios.get(`${API_BASE}/api/auth/admin/tests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // expecting { success: true, admin: {...}, tests: [...] }
        if (res.data && res.data.success) {
          setIsAdmin(true);
          setTestsData(Array.isArray(res.data.tests) ? res.data.tests : []);
        } else {
          setIsAdmin(false);
          setErrorMsg(res.data && res.data.message ? res.data.message : 'Access denied');
        }
      } catch (err) {
        console.error('Admin check error:', err);
        // Try to extract sensible message
        const msg =
          (err.response && err.response.data && err.response.data.message) ||
          err.message ||
          'Server error while verifying admin';
        setErrorMsg(msg);
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    };

    checkAdminAndLoadTests();
  }, []);

  // Blocker UI (professional, centered)
  const Blocker = ({ message }) => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-primary/10 max-w-lg text-center">
        <h3 className="text-xl font-bold text-red-600 mb-2">Access Denied</h3>
        <p className="text-sm text-primary/80 mb-4">
          Sorry — you are not allowed to access this screen.
        </p>
        {message && <p className="text-xs text-gray-500 mb-4">{message}</p>}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-secondary text-white rounded-lg font-semibold hover:shadow-md transition"
          >
            Retry
          </button>
          <a
            href="/"
            className="px-4 py-2 border border-gray-200 rounded-lg text-primary font-medium hover:bg-gray-50 transition"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );

  // Loading UI for admin check
  const CheckingLoading = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-4 border-accent1 border-t-transparent animate-spin" />
        <div className="text-sm text-primary/80">Verifying admin access...</div>
      </div>
    </div>
  );

  return (
    <div
      className="relative w-full pt-20 md:mb-56 bg-cover bg-center bg-no-repeat font-kodchasan min-h-screen md:h-[150vh]"
      style={{
        backgroundImage: "url('/assests/1.png')",
      }}
    >
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4 sm:mb-6 md:mb-8 text-center"
          style={{ fontFamily: 'Kodchasan, sans-serif' }}
        >
          Admin Dashboard
        </motion.h1>

        {/* If checking — show loader */}
        {checking ? (
          <CheckingLoading />
        ) : !isAdmin ? (
          // Not admin — blocker screen
          <Blocker message={errorMsg} />
        ) : (
          // Admin verified — show actual admin content (unchanged layout)
          <>
            {/* Tabs */}
            <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('test')}
                className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 ${
                  activeTab === 'test'
                    ? 'bg-gradient-to-r from-secondary to-accent2 text-white shadow-lg'
                    : 'bg-white/60 backdrop-blur-sm border-2 border-accent2 text-primary hover:bg-white/80'
                }`}
              >
                Test
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('gd')}
                className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 ${
                  activeTab === 'gd'
                    ? 'bg-gradient-to-r from-accent1 to-accent2 text-white shadow-lg'
                    : 'bg-white/60 backdrop-blur-sm border-2 border-accent1 text-primary hover:bg-white/80'
                }`}
              >
                GD & Interview
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('Dt')}
                className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 ${
                  activeTab === 'Dt'
                    ? 'bg-gradient-to-r from-accent2 to-accent1 text-white shadow-lg'
                    : 'bg-white/60 backdrop-blur-sm border-2 border-primary text-primary hover:bg-white/80'
                }`}
              >
                Signup Requests
              </motion.button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'test' && (
                <motion.div
                  key="test"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6"
                >
                  <div className="min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
                    {/* pass tests data to LeftTest as 'data' prop */}
                    <LeftTest data={testsData} />
                  </div>
                  <div className="min-h-[250px] sm:min-h-[300px] md:min-h-[400px] ">
                    <RightTest />
                  </div>
                </motion.div>
              )}

              {activeTab === 'gd' && (
                <motion.div
                  key="gd"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6"
                >
                  <div className="min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
                    <LeftGD />
                  </div>
                  <div className="min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
                    <RightGD />
                  </div>
                </motion.div>
              )}

              {activeTab === 'Dt' && (
                <motion.div
                  key="Dt"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="gap-3 sm:gap-4 md:gap-6"
                >
                  {/* <div className="min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
                    <LeftDt />
                  </div>
                  <div className="min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
                    <RightDt />
                  </div> */}

                    <div className="min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
                      <AdminSignupRequests/>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </div>
  );
}
