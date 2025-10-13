import React, { useState } from 'react';
import { User, Calendar, Clock, MapPin, Briefcase, Users, Linkedin, ClipboardList } from 'lucide-react';

// Interview Left Section - 60% width (responsive)
export const InterviewLeftSection = () => {
  // Interviewers data (you can have 4-6 interviewers in a panel)
  const interviewers = [
    { id: 1, name: 'Unknown', position: 'top', isCandidate: false },
    { id: 2, name: 'Unknown', position: 'top', isCandidate: false },
    { id: 3, name: 'Unknown', position: 'top', isCandidate: false },
    { id: 4, name: 'Unknown', position: 'top', isCandidate: false },
    { id: 5, name: 'You', position: 'bottom', isCandidate: true },
  ];

  const topInterviewers = interviewers.filter(p => p.position === 'top');
  const candidate = interviewers.find(p => p.isCandidate);

  const Avatar = ({ person }) => {
    const size = person.isCandidate 
      ? 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16' 
      : 'w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12';
    
    const textSize = person.isCandidate 
      ? 'text-xs sm:text-sm md:text-base font-bold' 
      : 'text-[10px] sm:text-xs md:text-sm';

    return (
      <div className="flex flex-col items-center gap-0.5 sm:gap-1">
        <div 
          className={`${size} rounded-full flex items-center justify-center transition-all ${
            person.isCandidate 
              ? 'bg-secondary text-white border-2 border-accent2 shadow-lg' 
              : 'bg-gray-300 text-gray-600 border border-gray-400'
          }`}
        >
          {person.isCandidate ? (
            <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          ) : (
            <Users className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          )}
        </div>
        <span className={`${textSize} font-kodchasan text-primary text-center`}>
          {person.name}
        </span>
        {!person.isCandidate && (
          <span className="text-[8px] sm:text-[10px] text-primary/60 font-kodchasan">
            Interviewer
          </span>
        )}
        {person.isCandidate && (
          <span className="text-[10px] sm:text-xs text-secondary font-kodchasan font-semibold">
            Candidate
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full   p-2 sm:p-3 md:p-4   border-gray-300 overflow-auto">
      <h2 className="text-base text-center sm:text-lg md:text-xl font-kodchasan font-bold text-secondary mb-2 sm:mb-3 md:mb-4">
        Interview Panel
      </h2>
      
      <div className="relative flex flex-col items-center">
        {/* Top Interviewers */}
        <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-3 sm:mb-4 md:mb-6">
          {topInterviewers.map(person => (
            <Avatar key={person.id} person={person} />
          ))}
        </div>

        {/* Center Information Card */}
        <div className="bg-gradient-to-br from-accent1/20 to-accent2/20 border border-primary/20 rounded-lg shadow-lg p-2 sm:p-3 md:p-4 max-w-[240px] sm:max-w-xs md:max-w-sm mb-3 sm:mb-4 md:mb-6">
          <div className="space-y-1.5 sm:space-y-2 md:space-y-2.5">
            {/* Position */}
            <div className="flex items-start gap-1.5 sm:gap-2">
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] sm:text-[10px] md:text-xs font-kodchasan text-primary/60 uppercase tracking-wide">
                  Position
                </p>
                <p className="text-[10px] sm:text-xs md:text-sm lg:text-base font-kodchasan font-bold text-primary">
                  Software Engineer
                </p>
              </div>
            </div>

            {/* Interview Type */}
            <div className="flex items-start gap-1.5 sm:gap-2">
              <ClipboardList className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-accent1 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] sm:text-[10px] md:text-xs font-kodchasan text-primary/60 uppercase tracking-wide">
                  Interview Type
                </p>
                <p className="text-[10px] sm:text-xs md:text-sm font-kodchasan text-primary">
                  Technical + HR Round
                </p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-start gap-1.5 sm:gap-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-accent2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] sm:text-[10px] md:text-xs font-kodchasan text-primary/60 uppercase tracking-wide">
                  Duration
                </p>
                <p className="text-[10px] sm:text-xs md:text-sm font-kodchasan font-semibold text-primary">
                  60 Minutes
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-1.5 sm:gap-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] sm:text-[10px] md:text-xs font-kodchasan text-primary/60 uppercase tracking-wide">
                  Date & Time
                </p>
                <p className="text-[10px] sm:text-xs md:text-sm font-kodchasan font-semibold text-primary">
                  Oct 16, 2025 | 2:00 PM
                </p>
              </div>
            </div>

            {/* Room Number */}
            <div className="flex items-start gap-1.5 sm:gap-2">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-accent1 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] sm:text-[10px] md:text-xs font-kodchasan text-primary/60 uppercase tracking-wide">
                  Room Number
                </p>
                <p className="text-[10px] sm:text-xs md:text-sm font-kodchasan font-bold text-primary">
                  Interview Room 205
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Candidate */}
        {candidate && <Avatar person={candidate} />}
      </div>
    </div>
  );
};

// Interview Right Section - 40% width (responsive)
export const InterviewRightSection = () => {
  const [isResultPending, setIsResultPending] = useState(false);

  const evaluationData = {
    technicalSkills: 42,
    communication: 38,
    problemSolving: 40,
    confidence: 35,
    totalMarks: 155,
    maxMarks: 200,
    status: 'Selected'
  };

  return (
    <div className="w-full  p-2 sm:p-3 md:p-4 overflow-auto">
      <h2 className="text-base text-center sm:text-lg md:text-xl font-kodchasan font-bold text-accent1 mb-1.5 sm:mb-2">
        Interview Result
      </h2>
      
      {/* Result or Skeleton */}
      {isResultPending ? (
        // Skeleton Loading State
        <div className="bg-background rounded-lg p-3 sm:p-4 md:p-6 mb-2 sm:mb-3 min-h-[200px] sm:min-h-[240px] md:min-h-[280px] flex flex-col items-center justify-center">
          <Clock className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-accent1 mb-2 sm:mb-3 animate-pulse" />
          <h3 className="text-xs sm:text-sm md:text-base font-kodchasan font-bold text-primary mb-1 text-center">
            Result Not Declared Yet
          </h3>
          <p className="text-[10px] sm:text-xs md:text-sm font-kodchasan text-primary/60 text-center">
            Evaluation in progress...
          </p>
          
          {/* Toggle button for demo */}
          <button
            onClick={() => setIsResultPending(false)}
            className="mt-3 sm:mt-4 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-accent1 text-white text-[10px] sm:text-xs font-kodchasan rounded-lg hover:bg-accent1/80 transition-all"
          >
            View Result
          </button>
        </div>
      ) : (
        // Actual Result
        <div className="bg-background rounded-lg p-1.5 sm:p-2 mb-2 sm:mb-3">
          {/* Toggle button for demo */}
          <button
            onClick={() => setIsResultPending(true)}
            className="w-full mb-1.5 px-1.5 py-0.5 bg-accent1/20 text-accent1 text-[9px] sm:text-[10px] font-kodchasan rounded hover:bg-accent1/30 transition-all"
          >
            Show Pending State
          </button>

          {/* Status Badge */}
          <div className="mb-2 sm:mb-2.5">
            <div className={`inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-kodchasan font-bold ${
              evaluationData.status === 'Selected' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {evaluationData.status}
            </div>
          </div>

          {/* Evaluation Breakdown */}
          <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-2.5">
            <div className="flex items-center justify-between p-1.5 sm:p-2 bg-white rounded">
              <span className="text-[10px] sm:text-xs md:text-sm font-kodchasan text-primary">
                Technical Skills
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-kodchasan font-bold text-accent1">
                {evaluationData.technicalSkills}/50
              </span>
            </div>

            <div className="flex items-center justify-between p-1.5 sm:p-2 bg-white rounded">
              <span className="text-[10px] sm:text-xs md:text-sm font-kodchasan text-primary">
                Communication
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-kodchasan font-bold text-accent1">
                {evaluationData.communication}/50
              </span>
            </div>

            <div className="flex items-center justify-between p-1.5 sm:p-2 bg-white rounded">
              <span className="text-[10px] sm:text-xs md:text-sm font-kodchasan text-primary">
                Problem Solving
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-kodchasan font-bold text-accent1">
                {evaluationData.problemSolving}/50
              </span>
            </div>

            <div className="flex items-center justify-between p-1.5 sm:p-2 bg-white rounded">
              <span className="text-[10px] sm:text-xs md:text-sm font-kodchasan text-primary">
                Confidence
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-kodchasan font-bold text-accent1">
                {evaluationData.confidence}/50
              </span>
            </div>

            {/* Total Score */}
            <div className="flex items-center justify-between p-2 sm:p-2.5 bg-gradient-to-r from-secondary/20 to-accent1/20 rounded border border-secondary/30">
              <span className="text-xs sm:text-sm md:text-base font-kodchasan font-bold text-primary">
                Total Score
              </span>
              <span className="text-xs sm:text-sm md:text-base font-kodchasan font-bold text-secondary">
                {evaluationData.totalMarks}/{evaluationData.maxMarks}
              </span>
            </div>
          </div>

          {/* Interviewer Contact */}
          <div className="bg-white rounded p-1.5 sm:p-2">
            <h4 className="text-[10px] sm:text-xs md:text-sm font-kodchasan font-semibold text-primary mb-1 sm:mb-1.5">
              Connect with Interviewers
            </h4>
            <div className="flex gap-1 flex-wrap">
              {[1, 2, 3, 4].map((i) => (
                <a
                  key={i}
                  href="#"
                  className="flex items-center gap-0.5 px-1.5 py-0.5 bg-accent1/10 hover:bg-accent1/20 rounded text-accent1 transition-all"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="text-[9px] sm:text-[10px] font-kodchasan">Panel {i}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interviewer Feedback Section */}
      <div className="bg-gradient-to-br from-accent2/10 to-accent1/10 rounded-lg p-2 sm:p-2.5 md:p-3 border border-primary/10">
        <h3 className="font-kodchasan font-bold text-primary mb-1 sm:mb-1.5 text-xs sm:text-sm md:text-base flex items-center gap-1 sm:gap-1.5">
          <span className="text-accent1">💬</span>
          Interviewer Feedback
        </h3>
        <div className="bg-white rounded p-1.5 sm:p-2 md:p-2.5">
          <p className="text-[10px] sm:text-xs md:text-sm font-kodchasan text-primary leading-relaxed">
            {isResultPending 
              ? "Feedback will be available once the evaluation is complete."
              : "Great problem-solving approach and clear communication. Keep up the excellent work on technical concepts."}
          </p>
        </div>
      </div>
    </div>
  );
};