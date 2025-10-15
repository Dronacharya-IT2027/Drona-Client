import React, { useState } from 'react';
import { Plus, X, ExternalLink, Bell, Calendar } from 'lucide-react';

// RightDt Component - Notifications & Notices
export const RightDt = () => {
  const [notices, setNotices] = useState([
    { id: 1, date: '2025-10-14', title: 'System Maintenance', content: 'Scheduled maintenance on Sunday' },
    { id: 2, date: '2025-10-13', title: 'New Features Released', content: 'Check out the new dashboard' },
    { id: 3, date: '2025-10-12', title: 'Weekly Challenge', content: 'Complete 5 hard problems this week' },
    { id: 4, date: '2025-10-11', title: 'Contest Reminder', content: 'Weekly contest starts at 8 PM' },
    { id: 5, date: '2025-10-10', title: 'Achievement Unlocked', content: 'You solved 100 problems!' },
    { id: 6, date: '2025-10-09', title: 'Team Update', content: 'New team members joined' },
    { id: 7, date: '2025-10-08', title: 'Tutorial Available', content: 'Advanced DP techniques tutorial' },
    { id: 8, date: '2025-10-07', title: 'Performance Boost', content: 'Server response time improved' },
    { id: 9, date: '2025-10-06', title: 'Community Event', content: 'Virtual meetup this Saturday' },
    { id: 10, date: '2025-10-05', title: 'Bug Fixed', content: 'Fixed submission timing issue' }
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });

  const createNotice = () => {
    if (newNotice.title && newNotice.content) {
      const notice = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        ...newNotice
      };
      setNotices([notice, ...notices]);
      setNewNotice({ title: '', content: '' });
      setShowCreateModal(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-accent1" />
          <h2 className="text-xl font-kodchasan font-semibold text-primary">Notices</h2>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-accent1 hover:bg-opacity-90 text-white p-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Notices List */}
      <div className="space-y-3  flex-1 overflow-y-auto space-y-1 pr-1 min-h-0 max-h-80 pr-2 custom-scrollbar">
        {notices.map((notice, index) => (
          <div
            key={notice.id}
            className="bg-white/60 backdrop-blur-sm border-2 border-primary/10 rounded-xl p-4 hover:border-accent1/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-primary font-semibold text-sm flex-1">{notice.title}</h3>
              <span className="text-xs text-primary/60 whitespace-nowrap">{formatDate(notice.date)}</span>
            </div>
            <p className="text-primary/70 text-sm">{notice.content}</p>
            <div className="mt-2 h-1 w-0 bg-gradient-to-r from-accent1 to-accent2 rounded-full group-hover:w-full transition-all duration-500"></div>
          </div>
        ))}
      </div>

      {/* Create Notice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-primary/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background border-2 border-primary/20 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-[slideIn_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-kodchasan font-semibold text-primary">Create Notice</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-primary hover:text-accent1 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Notice title"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-primary/10 rounded-lg focus:outline-none focus:border-accent1 transition-colors bg-white/80"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Content</label>
                <textarea
                  placeholder="Notice content"
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  rows="4"
                  className="w-full px-3 py-2 border-2 border-primary/10 rounded-lg focus:outline-none focus:border-accent1 transition-colors bg-white/80 resize-none"
                />
              </div>
            </div>

            <button
              onClick={createNotice}
              className="mt-6 w-full bg-accent1 hover:bg-opacity-90 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg"
            >
              Create Notice
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
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #be94f5;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a77ce0;
        }
      `}</style>
    </div>
  );
};