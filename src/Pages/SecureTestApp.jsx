import React, { useState, useEffect, useRef } from "react";
import { Clock, AlertTriangle, CheckCircle, XCircle,Award } from "lucide-react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "";

// Shuffle array utility
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


const TestStartScreen = ({ test, loading, error, onStart }) => {

  
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 font-kodchasan">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-primary text-lg">Loading Test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 font-kodchasan">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Test Unavailable</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!test) {
    return null;
  }

  return (
    <div 
      className="min-h-screen w-full bg-background font-kodchasan flex flex-col"
    >
  
      {/* Main Content - Centered */}
      <div className="flex-1 mt-16 flex items-center justify-center p-6">
        <div className="max-w-6xl w-full grid lg:grid-cols-3 gap-8">
          {/* Left Column - Test Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              {/* Test Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    {test.title}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Read all instructions carefully before starting the test
                  </p>
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Ready to Start
                </div>
              </div>

              {/* Test Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-3" />
                  <p className="text-sm opacity-90">Total Duration</p>
                  <p className="text-2xl font-bold">
                    {Math.floor(test.totalDuration / 60)} minutes
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 text-center">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold">?</span>
                  </div>
                  <p className="text-sm opacity-90">Total Questions</p>
                  <p className="text-2xl font-bold">{test.questions.length}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 text-center">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold">⏱️</span>
                  </div>
                  <p className="text-sm opacity-90">Per Question</p>
                  <p className="text-2xl font-bold">
                    {Math.floor(test.questionTime)}s
                  </p>
                </div>
              </div>

              {/* Important Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="font-bold text-yellow-800 mb-4 flex items-center text-lg">
                  <AlertTriangle className="w-6 h-6 mr-2" />
                  Important Instructions
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-yellow-700">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <p>Ensure stable internet connection throughout</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <p>Do not refresh or navigate away</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <p>All questions are mandatory and timed</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <p>Test cannot be paused once started</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Start Button */}
          <div className="space-y-6">
            {/* Start Test Card */}
            <div className="bg-gradient-to-br from-secondary to-accent2 rounded-2xl shadow-2xl p-6 text-white">
              <h3 className="font-bold text-2xl mb-4">Ready to Begin?</h3>
              <p className="text-white text-opacity-90 mb-6">
                Once started, the timer will begin and cannot be paused. Ensure you're in a quiet environment.
              </p>
              
              {/* Quick Stats */}
              <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Estimated Time</span>
                    <span className="font-bold">{Math.floor(test.totalDuration / 60)} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Questions</span>
                    <span className="font-bold">{test.questions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Time Per Question</span>
                    <span className="font-bold">{Math.floor(test.questionTime)}s</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onStart}
                className="w-full bg-white text-secondary font-bold py-4 rounded-lg transition-all text-lg shadow-lg transform hover:scale-105 hover:shadow-xl"
              >
                Start Test Now
              </button>

              <p className="text-xs text-white text-opacity-80 text-center mt-4">
                By starting, you agree to our proctoring policies
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t py-4">
        <div className="w-full text-center">
          <p className="text-gray-500 text-sm">
            Need technical assistance? Contact support at dronacharya.it2027@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};



const QuestionBlock = ({ qNum, status, onClick, isActive }) => {
  const bgColor =
    status === "answered"
      ? "bg-green-500"
      : status === "skipped"
      ? "bg-accent2"
      : "bg-white";
  const borderColor = isActive ? "ring-2 ring-secondary" : "";

  return (
    <button
      onClick={onClick}
      className={`${bgColor} ${borderColor} w-8 h-8 md:w-10 md:h-10 rounded flex items-center justify-center text-xs md:text-sm font-semibold shadow hover:scale-105 transition-transform ${
        status === "unanswered" ? "text-primary" : "text-white"
      }`}
    >
      {qNum}
    </button>
  );
};

const TestInterface = ({
  testID, 
  title,
  shuffledQuestions,
  onSubmit,
  questionTime,
  totalDuration,
  submitting,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(questionTime);
  const [violations, setViolations] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const testContainerRef = useRef(null);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(totalDuration);
  // submit guard so multiple sources don't submit twice
  const submittedRef = useRef(false);
  const submitOnce = (fn) => {
    if (submittedRef.current) return false;
    submittedRef.current = true;
    fn();
    return true;
  };
  // ✅ latest answers without triggering effect reruns
const answersRef = useRef(answers);
useEffect(() => {
  answersRef.current = answers;
}, [answers]);

// ✅ corrected per-question timer (NO 'answers' in dependency)
useEffect(() => {
  // reset timer at start of each question
  setQuestionTimeRemaining(questionTime ?? 0);

  // UI countdown (every 1 sec)
  const tick = setInterval(() => {
    setQuestionTimeRemaining((prev) => Math.max(prev - 1, 0));
  }, 1000);

  // auto-next / auto-submit (fires ONCE)
  const expiry = setTimeout(() => {
    const isLast = currentQuestionIndex === shuffledQuestions.length - 1;
    const qid = shuffledQuestions[currentQuestionIndex]?.id;

    // mark skipped ONLY if not answered
    if (qid && !answersRef.current[qid]) {
      setAnswers((prev) => ({ ...prev, [qid]: "skipped" }));
    }

    if (isLast) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex((idx) => idx + 1);
    }
  }, (questionTime ?? 0) * 1000);

  return () => {
    clearInterval(tick);
    clearTimeout(expiry);
  };
}, [currentQuestionIndex, questionTime, shuffledQuestions.length]);



  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;

  // Disable right-click
  useEffect(() => {
    const preventContextMenu = (e) => {
      e.preventDefault();
      recordViolation("right_click");
    };
    document.addEventListener("contextmenu", preventContextMenu);
    return () =>
      document.removeEventListener("contextmenu", preventContextMenu);
  }, []);

  // Disable copy/paste and keyboard shortcuts
  useEffect(() => {
    const preventActions = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "c" ||
          e.key === "v" ||
          e.key === "x" ||
          e.key === "a" ||
          e.key === "s")
      ) {
        e.preventDefault();
        recordViolation("keyboard_shortcut");
      }
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
        e.preventDefault();
        recordViolation("devtools_attempt");
      }
      if (
        e.key === "PrintScreen" ||
        (e.metaKey && e.shiftKey && ["3", "4", "5"].includes(e.key))
      ) {
        recordViolation("screenshot_attempt");
      }
    };

    const preventPaste = (e) => {
      e.preventDefault();
      recordViolation("paste_attempt");
    };

    const preventCopy = (e) => {
      e.preventDefault();
      recordViolation("copy_attempt");
    };

    document.addEventListener("keydown", preventActions);
    document.addEventListener("paste", preventPaste);
    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);

    return () => {
      document.removeEventListener("keydown", preventActions);
      document.removeEventListener("paste", preventPaste);
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
    };
  }, []);

  // Detect tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation("tab_switch");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Detect window blur
  useEffect(() => {
    const handleBlur = () => {
      recordViolation("window_blur");
    };
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, []);

  // ✅ Move this function outside useEffect
  const enterFullscreen = async () => {
    try {
      if (testContainerRef.current && !document.fullscreenElement) {
        await testContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        recordViolation("fullscreen_exit");
      } else {
        setIsFullscreen(true);
      }
    };

    // Try entering fullscreen initially
    enterFullscreen();

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  // Timers
  useEffect(() => {
    const id = setInterval(() => {
      setTotalTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  
  const recordViolation = (type) => {
    setViolations((prev) => [
      ...prev,
      { type, timestamp: Date.now(), question: currentQuestion.id },
    ]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      if (!answers[currentQuestion.id]) {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: "skipped",
        }));
      }
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    submitOnce(() => onSubmit(answers, violations));
  };

  const getQuestionStatus = (question) => {
    if (!answers[question.id]) return "unanswered";
    if (answers[question.id] === "skipped") return "skipped";
    return "answered";
  };

    // guard to ensure we mark defaulter only once
  const defaulterMarkedRef = useRef(false);

  // call mark-defaulter API once when violations reach threshold (3)
  useEffect(() => {
    let mounted = true;
    const markAndSubmit = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('No auth token — cannot mark defaulter');
        } else if (!testID) {
          console.warn('No testID available to mark defaulter');
        } else {
          // call API — use API_BASE (defined in outer module)
          const resp = await fetch(`${API_BASE}/api/defaulters/mark`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ testId: testID }), // <--- important: testId exactly
          });

          const data = await resp.json();
          if (data && data.success) {
            console.log('Marked defaulter successfully', data);
          } else {
            console.warn('Mark defaulter failed', data?.message || data);
          }
        }
      } catch (err) {
        console.error('Error marking defaulter:', err);
      } finally {
        // call submit only once (if component still mounted)
        if (mounted) {
          try {
            // ensure we don't call handleSubmit twice if some other code triggers it,
            // but we want to submit immediately after attempting to mark
            handleSubmit();
          } catch (e) {
            console.error('Error calling handleSubmit after defaulter mark', e);
          }
        }
      }
    };

    if (violations.length >= 3 && !defaulterMarkedRef.current) {
      defaulterMarkedRef.current = true; // guard further calls
      markAndSubmit();
    }

    return () => {
      mounted = false;
    };
  }, [violations, testID]); // run when violations or testID changes


  return (
    <div
      ref={testContainerRef}
      className="min-h-screen mt-14 bg-background font-kodchasan"
    >
      {!isFullscreen && (
        <div className="fixed top-0 left-0 right-0 bg-secondary text-white text-center py-2 text-xs md:text-sm z-50">
          ⚠️ Please return to fullscreen mode
          <button
            onClick={enterFullscreen}
            className="ml-2 bg-white text-secondary px-2 py-1 rounded-md text-xs font-semibold hover:bg-opacity-90 transition-all"
          >
            Re-enter Fullscreen
          </button>
        </div>
      )}

      <div className="flex flex-col p-4  md:flex-row h-screen">
        {/* Left Panel - 25% */}
        <div className="w-full md:w-1/4 bg-primary border-4 border-secondary rounded-lg text-white p-3 md:p-4 overflow-y-auto">
          <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3">
            {title}
          </h2>

          <div className="space-y-2 mb-3 md:mb-4 text-xs md:text-sm">
            <div className="flex justify-between">
              <span>Total Duration:</span>
              <span className="font-semibold text-accent2">
                {formatTime(totalTimeRemaining)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Answered:</span>
              <span className="font-semibold text-accent1">
                {answeredCount}/{shuffledQuestions.length}
              </span>
            </div>
          </div>

          <div className="mb-2 md:mb-3">
            <h3 className="text-xs md:text-sm font-semibold mb-2">
              Questions:
            </h3>
            <div className="grid grid-cols-5 gap-1 md:gap-2">
              {shuffledQuestions.map((q, idx) => (
                <QuestionBlock
                  key={q.id}
                  qNum={idx + 1}
                  status={getQuestionStatus(q)}
                  // onClick={() => !submitting && goToQuestion(idx)}
                  isActive={idx === currentQuestionIndex}
                />
              ))}
            </div>
          </div>

          {violations.length > 0 && (
            <div className="mt-3 md:mt-4 bg-secondary bg-opacity-20 p-2 rounded text-xs">
              <h3 className="font-semibold mb-1 flex items-center gap-1">
                <AlertTriangle size={12} /> Violations: {violations.length}
              </h3>
            </div>
          )}
        </div>

        {/* Right Panel - 75% */}
        <div className="w-full md:w-3/4 p-3 md:p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-semibold text-primary">
              Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
            </h3>
            <div className="flex items-center gap-2 bg-accent2 px-3 py-1 md:px-4 md:py-2 rounded-lg">
              <Clock size={16} className="md:w-5 md:h-5" />
              <span className="font-bold text-primary text-sm md:text-base">
                {formatTime(questionTimeRemaining)}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            <p className="text-base md:text-xl text-primary mb-4 md:mb-6 font-medium select-none">
              {currentQuestion.question}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-3 md:p-4 rounded-lg border-2 transition-all text-left text-sm md:text-base select-none ${
                    answers[currentQuestion.id] === option
                      ? "border-secondary bg-secondary bg-opacity-10"
                      : "border-gray-300 hover:border-accent1"
                  }`}
                >
                  <span className="font-semibold text-primary">
                    {String.fromCharCode(65 + idx)}.
                  </span>{" "}
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between gap-2 md:gap-4">
            {/* <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0 || submitting}
              className="px-4 md:px-6 py-2 md:py-3 bg-gray-400 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-all text-sm md:text-base"
            >
              Previous
            </button> */}

            {currentQuestionIndex === shuffledQuestions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all ${
                  submitting
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-accent1 text-white hover:bg-opacity-90"
                }`}
              >
                {submitting ? "Submitting..." : "Submit Test"}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={submitting}
                className="px-4 md:px-6 py-2 md:py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-all text-sm md:text-base"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultsScreen = ({
  answers,
  violations = [],
  shuffledQuestions = [],
  onRestart,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // small accessibility focus when screen mounts
    const el = document.getElementById("thank-you-hero");
    if (el) el.focus();
  }, []);

  const handleClose = () => {
    // optional cleanup callback
    try {
      if (typeof onRestart === "function") onRestart();
    } catch (e) {
      // ignore
    }
    navigate("/aptitude-test");
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-white via-background to-bg-200 font-kodchasan flex items-center justify-center p-4">
      <motion.div
        id="thank-you-hero"
        tabIndex={-1}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl max-w-3xl w-full p-6 md:p-10 border border-gray-100"
        aria-live="polite"
      >
        <div className="flex items-start gap-4">
          {/* Left decorative panel */}
          <div className="flex-none">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-secondary to-accent2 rounded-full flex items-center justify-center shadow-lg ring-1 ring-accent2/20">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              Thank you — submission received!
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-4">
              Your responses have been submitted successfully. We've securely
              recorded your answers and anti-cheat logs (if any).
            </p>

            <div className="flex gap-3 flex-wrap items-center">
              <button
                onClick={handleClose}
                className="px-5 py-3 bg-secondary hover:bg-opacity-95 text-white rounded-lg font-semibold shadow-md transition-transform transform hover:-translate-y-0.5"
              >
                Close Test
              </button>
            </div>
          </div>

          {/* Close icon */}
          <div className="flex-none ml-2">
            <button
              onClick={handleClose}
              aria-label="Close"
              className="p-1 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Violations summary (if any) */}
        {violations && violations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 p-4 border-l-4 border-secondary bg-secondary/5 rounded-md flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-primary">
                Security flags recorded
              </p>
              <p className="text-xs text-gray-600">
                We detected <strong>{violations.length}</strong> suspicious
                activity item(s) during the session. These have been logged and
                will be reviewed by the administrators.
              </p>
            </div>
          </motion.div>
        )}

        {/* Friendly footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Need help? Contact support or your instructor.</p>
        </div>
      </motion.div>
    </div>
  );
};

const SecureTestApp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const testId = location.state?.testId;
  const [testState, setTestState] = useState("start"); // start, testing, results
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [finalAnswers, setFinalAnswers] = useState({});
  const [finalViolations, setFinalViolations] = useState([]);
  const [apiTest, setApiTest] = useState(null); // returned test object (no correctAnswer)
  const [loadingTest, setLoadingTest] = useState(true);
  const [testError, setTestError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleStartTest = () => {
    if (!apiTest) {
      alert("Test not loaded yet.");
      return;
    }
    if (!Array.isArray(apiTest.questions) || apiTest.questions.length === 0) {
      alert("No questions available for this test.");
      return;
    }

    const shuffled = shuffleArray(apiTest.questions).map((q) => ({
      ...q,
      options: shuffleArray(q.options || []),
    }));
    setShuffledQuestions(shuffled);

    // IMPORTANT: pass runtime durations to TestInterface via props (see next)
    setTestState("testing");
  };

  const handleSubmitTest = async (answers, violations) => {
    setSubmitting(true);
    try {
      // Build answers array expected by server:
      // transform { questionId: "Option A", ... } -> [{ questionId, answer }, ...]
      const answersArr = Object.keys(answers || {}).map((qid) => {
        const item = {
          questionId: qid,
          answer: answers[qid],
        };
        // optional: include question text if you want: find in shuffledQuestions
        const qObj = shuffledQuestions.find(
          (q) => String(q.id) === String(qid)
        );
        if (qObj && qObj.question && !item.question)
          item.question = qObj.question;
        return item;
      });

      // auth token
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing. Please login again.");
      }

      // API call - adjust endpoint if your server uses a different path
      const res = await axios.post(
        `${API_BASE}/api/tests/${testId}/submit`,
        { answers: answersArr, violations }, // include violations if backend accepts it
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // On success -> show results (thank-you) screen
      if (res && res.data && res.data.success) {
        setFinalAnswers(answers);
        setFinalViolations(violations || []);
        setTestState("results");
      } else {
        throw new Error(
          res?.data?.message ||
            "Unexpected server response when submitting test."
        );
      }
    } catch (err) {
      console.error("Submit test error:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to submit test";
      // If already submitted, backend usually sends message; handle it gracefully
      if (/already submitted/i.test(String(msg))) {
        alert(msg);
        // optionally redirect user to aptitude-test
        navigate("/aptitude-test");
      } else {
        alert(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setTestState("start");
    setFinalAnswers({});
    setFinalViolations([]);
  };

  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) {
        setTestError("No testId provided");
        setLoadingTest(false);
        return;
      }

      setLoadingTest(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await axios.post(
          `${API_BASE}/api/tests/attempt`,
          { testId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data && res.data.success && res.data.test) {
          // server returns { success: true, test: { testId, title, totalDuration, questionTime, questions: [...] } }
          setApiTest(res.data.test);
          console.log("Fetched test data:", res.data.test);
        } else {
          throw new Error(res.data?.message || "Invalid response from server");
        }
      } catch (err) {
        console.error("Failed to fetch test:", err);
        setTestError(
          err.response?.data?.message || err.message || "Failed to fetch test"
        );
      } finally {
        setLoadingTest(false);
      }
    };

    fetchTest();
  }, [testId]);

  return (
    <div className="font-kodchasan">
      {testState === "start" && (
        <TestStartScreen
          test={apiTest}
          loading={loadingTest}
          error={testError}
          onStart={handleStartTest}
        />
      )}

      {testState === "testing" && (
        <TestInterface
          testID={testId}
          title={apiTest.title}
          shuffledQuestions={shuffledQuestions}
          onSubmit={handleSubmitTest}
          questionTime={apiTest?.questionTime}
          totalDuration={apiTest?.totalDuration}
          submitting={submitting} // <-- new prop
        />
      )}

      {testState === "results" && (
        <ResultsScreen
          answers={finalAnswers}
          violations={finalViolations}
          shuffledQuestions={shuffledQuestions}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default SecureTestApp;
