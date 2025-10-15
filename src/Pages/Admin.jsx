import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeftGD } from '../Component/Advanced/Admin/LeftGD';
import { LeftTest } from '../Component/Advanced/Admin/LeftTest';
import { RightGD } from '../Component/Advanced/Admin/RightGD';
import { RightTest } from '../Component/Advanced/Admin/RightTest';
import { LeftDt } from '../Component/Advanced/Admin/LeftDt';
import { RightDt } from '../Component/Advanced/Admin/RightDt';
export default function Admin() {
  const [activeTab, setActiveTab] = useState('test');

  return (
    <div  
      className="relative w-full pt-20 md:mb-56 bg-cover bg-center bg-no-repeat font-kodchasan min-h-screen md:h-[150vh]"

      style={{
        backgroundImage: "url('/assests/1.png')",
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
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
            Daily Task & Notification
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
                <LeftTest />
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
              className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6"
            >
              <div className="min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
                <LeftDt />
              </div>
              <div className="min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
                <RightDt />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}