
import React, { useState } from 'react';
import { Plus, X, ExternalLink, Bell, Calendar } from 'lucide-react';

// LeftDt Component - Daily Tasks
export const LeftDt = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Two Sum', link: 'https://leetcode.com/problems/two-sum' },
    { id: 2, title: 'Add Two Numbers', link: 'https://leetcode.com/problems/add-two-numbers' },
    { id: 3, title: 'Longest Substring', link: 'https://leetcode.com/problems/longest-substring' },
    { id: 4, title: 'Median of Two Sorted Arrays', link: 'https://leetcode.com/problems/median' },
    { id: 5, title: 'Longest Palindromic Substring', link: 'https://leetcode.com/problems/palindrome' }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTasks, setNewTasks] = useState(Array(5).fill({ title: '', link: '' }));

  const handleAddTask = (index, field, value) => {
    const updated = [...newTasks];
    updated[index] = { ...updated[index], [field]: value };
    setNewTasks(updated);
  };

  const saveTasks = () => {
    const validTasks = newTasks.filter(task => task.title && task.link);
    if (validTasks.length > 0) {
      // In a real app, you'd save these for tomorrow
      console.log('Tasks for tomorrow:', validTasks);
      setShowAddModal(false);
      setNewTasks(Array(5).fill({ title: '', link: '' }));
    }
  };

  return (
    <div className="h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-kodchasan font-semibold text-primary">Today's Tasks</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-secondary hover:bg-opacity-90 text-white p-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Today's Tasks */}
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="bg-white/60 backdrop-blur-sm border-2 border-primary/10 rounded-xl p-4 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-secondary">Q{index + 1}</span>
                  <h3 className="text-primary font-medium">{task.title}</h3>
                </div>
              </div>
              <a
                href={task.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent1 hover:text-secondary transition-colors duration-200 opacity-0 group-hover:opacity-100"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Tasks Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-primary/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background border-2 border-primary/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-[slideIn_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-kodchasan font-semibold text-primary">Add Tasks for Tomorrow</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-primary hover:text-secondary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm border-2 border-primary/10 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-secondary mb-2">Q{index + 1}</label>
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={newTasks[index].title}
                    onChange={(e) => handleAddTask(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-primary/10 rounded-lg mb-2 focus:outline-none focus:border-secondary transition-colors bg-white/80"
                  />
                  <input
                    type="url"
                    placeholder="LeetCode Link"
                    value={newTasks[index].link}
                    onChange={(e) => handleAddTask(index, 'link', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-primary/10 rounded-lg focus:outline-none focus:border-secondary transition-colors bg-white/80"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={saveTasks}
              className="mt-6 w-full bg-secondary hover:bg-opacity-90 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg"
            >
              Save Tasks
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};