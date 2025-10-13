import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Linkedin, Download, Clock, Calendar, Award, TrendingUp } from 'lucide-react';
import {RankList ,WeakTopics } from "../Test/Ranklist";
import {TestCard} from "../Test/Testcard";


// Main Component
const AptitudeTestPage = () => {
  const upcomingTests = [
    {
      id: 1,
      title: "Mid-Term Assessment",
      aptitudeQ: 30,
      daaQ: 20,
      date: "25th Oct 2025",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      duration: "2 hours",
      totalMarks: 100,
      syllabus: [
        { topic: "Number Systems", description: "Binary, Octal, Hexadecimal conversions and operations" },
        { topic: "Data Structures", description: "Arrays, Linked Lists, Stacks, Queues, Trees" },
        { topic: "Algorithms", description: "Sorting, Searching, Dynamic Programming basics" },
        { topic: "Time Complexity", description: "Big O notation, Best/Worst case analysis" }
      ]
    },
    {
      id: 2,
      title: "Weekly Practice Test",
      aptitudeQ: 25,
      daaQ: 15,
      date: "30th Oct 2025",
      startTime: "2:00 PM",
      endTime: "3:30 PM",
      duration: "1.5 hours",
      totalMarks: 80,
      syllabus: [
        { topic: "Logical Reasoning", description: "Patterns, Sequences, Analogies" },
        { topic: "Graph Algorithms", description: "BFS, DFS, Shortest Path algorithms" },
        { topic: "Greedy Algorithms", description: "Activity Selection, Huffman Coding" }
      ]
    },
    {
      id: 3,
      title: "Final Assessment",
      aptitudeQ: 40,
      daaQ: 30,
      date: "15th Nov 2025",
      startTime: "9:00 AM",
      endTime: "12:00 PM",
      duration: "3 hours",
      totalMarks: 150,
      syllabus: [
        { topic: "Advanced Data Structures", description: "Heaps, Hash Tables, Tries" },
        { topic: "Complex Algorithms", description: "Divide and Conquer, Backtracking" },
        { topic: "Probability", description: "Basic probability, Permutations, Combinations" },
        { topic: "Problem Solving", description: "Real-world application problems" }
      ]
    }
  ];

  const pastTests = [
    {
      id: 4,
      title: "Previous Assessment",
      aptitudeQ: 30,
      daaQ: 20,
      date: "5th Oct 2025",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      duration: "2 hours",
      totalMarks: 100,
      syllabus: [
        { topic: "Basic Aptitude", description: "Quantitative aptitude basics" }
      ]
    }
  ];

  const students = [
    { id: 5, name: "Rahul Kumar", marks: 95, percentile: 98, linkedin: "#" },
    { id: 2, name: "Priya Sharma", marks: 92, percentile: 95, linkedin: "#" },
    { id: 3, name: "Amit Patel", marks: 88, percentile: 90, linkedin: "#" },
    { id: 1, name: "You", marks: 85, percentile: 85, linkedin: "#" },
    { id: 4, name: "Sneha Reddy", marks: 82, percentile: 80, linkedin: "#" },
    { id: 6, name: "Vikram Singh", marks: 78, percentile: 75, linkedin: "#" },
    { id: 7, name: "Anjali Verma", marks: 75, percentile: 70, linkedin: "#" },
    { id: 8, name: "Rohan Gupta", marks: 70, percentile: 60, linkedin: "#" }
  ];

  const weakTopics = [
    "Dynamic Programming",
    "Graph Theory",
    "Time Complexity",
    "Recursion",
    "Binary Trees",
    "Sorting Algorithms"
  ];

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
            <RankList students={students} currentUserId={1} />
            <WeakTopics topics={weakTopics} />
          </div>

          {/* Left Section - Shows second on mobile */}
          <div className="w-full lg:w-3/5 lg:order-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">Upcoming Tests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingTests.map((test) => (
                  <TestCard key={test.id} test={test} />
                ))}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">Past Tests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastTests.map((test) => (
                  <TestCard key={test.id} test={test} isPast />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AptitudeTestPage;