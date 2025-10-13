import React  from 'react';
import { Users, Calendar, Clock, MapPin, MessageSquare } from 'lucide-react';

export const GDLeftSection = () => {
  // Avatar data - 11 unknown + 1 current user
  const avatars = [
    // Top 4
    { id: 1, name: 'Unknown', position: 'top', isCurrentUser: false },
    { id: 2, name: 'Unknown', position: 'top', isCurrentUser: false },
    { id: 3, name: 'Unknown', position: 'top', isCurrentUser: false },
    { id: 4, name: 'Unknown', position: 'top', isCurrentUser: false },
    // Right 2
    { id: 5, name: 'Unknown', position: 'right', isCurrentUser: false },
    { id: 6, name: 'Unknown', position: 'right', isCurrentUser: false },
    // Bottom 4
    { id: 7, name: 'Unknown', position: 'bottom', isCurrentUser: false },
    { id: 8, name: 'Unknown', position: 'bottom', isCurrentUser: false },
    { id: 9, name: 'You', position: 'bottom', isCurrentUser: true },
    { id: 10, name: 'Unknown', position: 'bottom', isCurrentUser: false },
    // Left 2
    { id: 11, name: 'Unknown', position: 'left', isCurrentUser: false },
    { id: 12, name: 'Unknown', position: 'left', isCurrentUser: false },
  ];

  const topAvatars = avatars.filter(a => a.position === 'top');
  const bottomAvatars = avatars.filter(a => a.position === 'bottom');
  const leftAvatars = avatars.filter(a => a.position === 'left');
  const rightAvatars = avatars.filter(a => a.position === 'right');

  const Avatar = ({ avatar }) => {
    const size = avatar.isCurrentUser 
      ? 'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20' 
      : 'w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16';
    
    const textSize = avatar.isCurrentUser 
      ? 'text-xs sm:text-sm md:text-base font-bold' 
      : 'text-[10px] sm:text-xs md:text-sm';

    return (
      <div className="flex flex-col items-center gap-1 sm:gap-2">
        <div 
          className={`${size} rounded-full flex items-center justify-center transition-all ${
            avatar.isCurrentUser 
              ? 'bg-secondary text-white border-2 sm:border-4 border-accent2 shadow-lg' 
              : 'bg-gray-300 text-gray-600 border-2 border-gray-400'
          }`}
        >
          {avatar.isCurrentUser ? (
            <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
          ) : (
            <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          )}
        </div>
        <span className={`${textSize} font-kodchasan text-primary text-center`}>
          {avatar.name}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full sm:p-4 md:p-6     overflow-auto">
      
      
      <div className="relative flex flex-col items-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
        {/* Top Avatars */}
        <div className="flex justify-center gap-2 sm:gap-3 md:gap-6 lg:gap-8 mb-4 sm:mb-6 md:mb-8">
          {topAvatars.map(avatar => (
            <Avatar key={avatar.id} avatar={avatar} />
          ))}
        </div>

        {/* Middle Section with Left, Center Card, Right */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full mb-4 sm:mb-6 md:mb-8">
          {/* Left Avatars */}
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {leftAvatars.map(avatar => (
              <Avatar key={avatar.id} avatar={avatar} />
            ))}
          </div>

          {/* Center Information Card */}
          <div className="bg-gradient-to-br from-accent1/20 to-accent2/20 border-2 border-primary/20 rounded-xl shadow-xl p-3 sm:p-4 md:p-6 max-w-[250px] sm:max-w-xs md:max-w-md">
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {/* Theme */}
              <div className="flex items-start gap-2 sm:gap-3">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] sm:text-xs md:text-sm font-kodchasan text-primary/60 uppercase tracking-wide">
                    Theme
                  </p>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg font-kodchasan font-bold text-primary">
                    Impact of AI on Future Jobs
                  </p>
                </div>
              </div>

              {/* Key Topics */}
              <div className="flex items-start gap-2 sm:gap-3">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-accent1 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] sm:text-xs md:text-sm font-kodchasan text-primary/60 uppercase tracking-wide">
                    Key Topics
                  </p>
                  <p className="text-xs sm:text-sm md:text-base font-kodchasan text-primary">
                    Automation, Employment, Ethics
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-start gap-2 sm:gap-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-accent2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] sm:text-xs md:text-sm font-kodchasan text-primary/60 uppercase tracking-wide">
                    Duration
                  </p>
                  <p className="text-xs sm:text-sm md:text-base font-kodchasan font-semibold text-primary">
                    45 Minutes
                  </p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex items-start gap-2 sm:gap-3">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] sm:text-xs md:text-sm font-kodchasan text-primary/60 uppercase tracking-wide">
                    Date & Time
                  </p>
                  <p className="text-xs sm:text-sm md:text-base font-kodchasan font-semibold text-primary">
                    Oct 15, 2025 | 10:00 AM
                  </p>
                </div>
              </div>

              {/* Room Number */}
              <div className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-accent1 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] sm:text-xs md:text-sm font-kodchasan text-primary/60 uppercase tracking-wide">
                    Room Number
                  </p>
                  <p className="text-xs sm:text-sm md:text-base font-kodchasan font-bold text-primary">
                    Conference Room 301
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Avatars */}
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {rightAvatars.map(avatar => (
              <Avatar key={avatar.id} avatar={avatar} />
            ))}
          </div>
        </div>

        {/* Bottom Avatars */}
        <div className="flex justify-center gap-2 sm:gap-3 md:gap-6 lg:gap-8">
          {bottomAvatars.map(avatar => (
            <Avatar key={avatar.id} avatar={avatar} />
          ))}
        </div>
      </div>
    </div>
  );
};

 
import { Linkedin } from 'lucide-react';
import { useState } from 'react';

export const GDRightSection = () => {
  const [isRankingPending, setIsRankingPending] = useState(false);
  
  const rankings = [
    { rank: 1, name: 'Rahul Kumar', marks: 48, isCurrentUser: false },
    { rank: 2, name: 'Priya Sharma', marks: 46, isCurrentUser: false },
    { rank: 3, name: 'Amit Singh', marks: 44, isCurrentUser: false },
    { rank: 4, name: 'Sneha Patel', marks: 42, isCurrentUser: false },
    { rank: 5, name: 'You', marks: 40, isCurrentUser: true },
    { rank: 6, name: 'Vikram Gupta', marks: 38, isCurrentUser: false },
    { rank: 7, name: 'Anjali Verma', marks: 36, isCurrentUser: false },
    { rank: 8, name: 'Ravi Kumar', marks: 34, isCurrentUser: false },
    { rank: 9, name: 'Pooja Reddy', marks: 32, isCurrentUser: false },
    { rank: 10, name: 'Sandeep Joshi', marks: 30, isCurrentUser: false },
    { rank: 11, name: 'Neha Kapoor', marks: 28, isCurrentUser: false },
    { rank: 12, name: 'Karan Mehta', marks: 26, isCurrentUser: false },
  ];

  return (
    <div className="w-full  p-3 sm:p-4 md:p-6 overflow-auto">
      <h2 className="text-xxl sm:text-xl md:text-2xl font-kodchasan font-bold text-accent1 mb-2 sm:mb-3">
        GD-2 Rankings
      </h2>
      
      {/* Rankings List or Skeleton */}
      {isRankingPending ? (
        // Skeleton Loading State
        <div className="bg-background rounded-lg p-4 sm:p-6 md:p-8 mb-3 sm:mb-4 min-h-[280px] sm:min-h-[320px] md:min-h-[400px] flex flex-col items-center justify-center">
          <Clock className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-accent1 mb-3 sm:mb-4 animate-pulse" />
          <h3 className="text-sm sm:text-base md:text-lg font-kodchasan font-bold text-primary mb-1 sm:mb-2 text-center">
            Rank List Not Prepared Yet
          </h3>
          <p className="text-xs sm:text-sm md:text-base font-kodchasan text-primary/60 text-center">
            Results are being compiled...
          </p>
          
          {/* Toggle button for demo */}
          <button
            onClick={() => setIsRankingPending(false)}
            className="mt-4 sm:mt-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-accent1 text-white text-xs sm:text-sm font-kodchasan rounded-lg hover:bg-accent1/80 transition-all"
          >
            View Rankings
          </button>
        </div>
      ) : (
        // Actual Rankings List
        <div className="bg-background rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 max-h-[280px] sm:max-h-[320px] md:max-h-[400px] overflow-y-auto">
          {/* Toggle button for demo */}
          <button
            onClick={() => setIsRankingPending(true)}
            className="w-full mb-2 px-2 py-1 bg-accent1/20 text-accent1 text-[10px] sm:text-xs font-kodchasan rounded hover:bg-accent1/30 transition-all"
          >
            Show Pending State
          </button>
          
          <div className="space-y-1 sm:space-y-1.5">
          {rankings.map((participant) => (
            <div
              key={participant.rank}
              className={`flex items-center justify-between p-1.5 sm:p-2 md:p-2.5 rounded-lg transition-all ${
                participant.isCurrentUser
                  ? 'bg-secondary/20 border-2 border-secondary shadow-md'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-1 min-w-0">
                {/* Rank */}
                <span
                  className={`text-xs sm:text-sm md:text-base font-kodchasan flex-shrink-0 w-5 sm:w-6 md:w-7 ${
                    participant.isCurrentUser
                      ? 'font-bold text-secondary'
                      : 'font-semibold text-primary/60'
                  }`}
                >
                  {participant.rank}
                </span>

                {/* Name */}
                <span
                  className={`text-xs sm:text-sm md:text-base font-kodchasan truncate flex-1 ${
                    participant.isCurrentUser
                      ? 'font-bold text-primary'
                      : 'text-primary'
                  }`}
                >
                  {participant.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
                {/* Marks */}
                <span
                  className={`text-xs sm:text-sm md:text-base font-kodchasan ${
                    participant.isCurrentUser
                      ? 'font-bold text-secondary'
                      : 'font-semibold text-accent1'
                  }`}
                >
                  {participant.marks}/50
                </span>

                {/* LinkedIn Icon */}
                <a
                  href="#"
                  className={`hover:scale-110 transition-transform ${
                    participant.isCurrentUser ? 'text-secondary' : 'text-accent1'
                  }`}
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

   {/* Judges' Feedback Section */}
 
   {isRankingPending ? (
<div className="bg-gradient-to-br from-accent2/10 to-accent1/10 rounded-lg p-2.5 sm:p-3 md:p-4 border border-primary/10">
  <h3 className="font-kodchasan font-bold text-primary mb-1.5 sm:mb-2 text-sm sm:text-base md:text-lg flex items-center gap-1.5 sm:gap-2">
    <span className="text-accent1">📝</span>
    Judges’ Feedback
  </h3>

  {/* Feedback Display Card (auto height) */}
  <div
    className="bg-white border border-gray-300 rounded-lg p-2 sm:p-2.5 md:p-3 text-primary font-kodchasan text-xs sm:text-sm md:text-base leading-relaxed"
  >
    Not Prepared yet !!
  </div>

  <p className="text-[10px] sm:text-xs text-primary/50 mt-1 sm:mt-1.5 font-kodchasan">
    Feedback provided by judges
  </p>
</div>
      ) : (
<div className="bg-gradient-to-br from-accent2/10 to-accent1/10 rounded-lg p-2.5 sm:p-3 md:p-4 border border-primary/10">
  <h3 className="font-kodchasan font-bold text-primary mb-1.5 sm:mb-2 text-sm sm:text-base md:text-lg flex items-center gap-1.5 sm:gap-2">
    <span className="text-accent1">📝</span>
    Judges’ Feedback
  </h3>

  {/* Feedback Display Card (auto height) */}
  <div
    className="bg-white border border-gray-300 rounded-lg p-2 sm:p-2.5 md:p-3 text-primary font-kodchasan text-xs sm:text-sm md:text-base leading-relaxed"
  >
    You displayed strong communication skills and confidence throughout the
    discussion. Try to organize your thoughts more clearly and provide concise
    supporting points to strengthen your arguments.
  </div>

  <p className="text-[10px] sm:text-xs text-primary/50 mt-1 sm:mt-1.5 font-kodchasan">
    Feedback provided by judges
  </p>
</div>
      )}

    </div>
  );
};
