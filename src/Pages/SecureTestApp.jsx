import React, { useState, useEffect, useRef } from 'react';
import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const testData = {
  testId: "demo_test_01",
  title: "Demo Test",
  totalDuration: 600, // 10 minutes in seconds
  questionTime: 120, // 2 minutes per question
  questions: [
    { id: "Q1", question: "This is question 1?", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswer: "Option B" },
    { id: "Q2", question: "This is question 2?", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswer: "Option D" },
    { id: "Q3", question: "This is question 3?", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswer: "Option A" },
    { id: "Q4", question: "This is question 4?", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswer: "Option C" },
    { id: "Q5", question: "This is question 5?", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswer: "Option B" }
  ]
};

// Shuffle array utility
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const TestStartScreen = ({ onStart }) => {
  return (
    <div className="min-h-screen pt-16 bg-background flex items-center justify-center p-4 font-kodchasan">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-md w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4">{testData.title}</h1>
        <div className="space-y-3 mb-6 text-sm md:text-base">
          <p className="text-primary"><span className="font-semibold">Total Questions:</span> {testData.questions.length}</p>
          <p className="text-primary"><span className="font-semibold">Total Duration:</span> {Math.floor(testData.totalDuration / 60)} minutes</p>
          <p className="text-primary"><span className="font-semibold">Per Question:</span> {Math.floor(testData.questionTime / 60)} minutes</p>
        </div>
        <div className="bg-accent2 bg-opacity-20 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-primary mb-2 text-sm md:text-base">⚠️ Anti-Cheat Measures Active:</h3>
          <ul className="text-xs md:text-sm text-primary space-y-1">
            <li>• Fullscreen mode required</li>
            <li>• Tab switching monitored</li>
            <li>• Copy/paste disabled</li>
            <li>• Screenshot detection active</li>
            <li>• Timed questions</li>
          </ul>
        </div>
        <button
          onClick={onStart}
          className="w-full bg-secondary hover:bg-opacity-90 text-white font-semibold py-3 rounded-lg transition-all text-sm md:text-base"
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

const QuestionBlock = ({ qNum, status, onClick, isActive }) => {
  const bgColor = status === 'answered' ? 'bg-green-500' : status === 'skipped' ? 'bg-accent2' : 'bg-white';
  const borderColor = isActive ? 'ring-2 ring-secondary' : '';
  
  return (
    <button
      onClick={onClick}
      className={`${bgColor} ${borderColor} w-8 h-8 md:w-10 md:h-10 rounded flex items-center justify-center text-xs md:text-sm font-semibold shadow hover:scale-105 transition-transform ${status === 'unanswered' ? 'text-primary' : 'text-white'}`}
    >
      {qNum}
    </button>
  );
};

const TestInterface = ({ shuffledQuestions, onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(testData.totalDuration);
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(testData.questionTime);
  const [violations, setViolations] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const testContainerRef = useRef(null);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;

  // Disable right-click
  useEffect(() => {
    const preventContextMenu = (e) => {
      e.preventDefault();
      recordViolation('right_click');
    };
    document.addEventListener('contextmenu', preventContextMenu);
    return () => document.removeEventListener('contextmenu', preventContextMenu);
  }, []);

  // Disable copy/paste and keyboard shortcuts
  useEffect(() => {
    const preventActions = (e) => {
      if (
        (e.ctrlKey || e.metaKey) && 
        (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a' || e.key === 's')
      ) {
        e.preventDefault();
        recordViolation('keyboard_shortcut');
      }
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        recordViolation('devtools_attempt');
      }
      if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key))) {
        recordViolation('screenshot_attempt');
      }
    };

    const preventPaste = (e) => {
      e.preventDefault();
      recordViolation('paste_attempt');
    };

    const preventCopy = (e) => {
      e.preventDefault();
      recordViolation('copy_attempt');
    };

    document.addEventListener('keydown', preventActions);
    document.addEventListener('paste', preventPaste);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);

    return () => {
      document.removeEventListener('keydown', preventActions);
      document.removeEventListener('paste', preventPaste);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
    };
  }, []);

  // Detect tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation('tab_switch');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Detect window blur
  useEffect(() => {
    const handleBlur = () => {
      recordViolation('window_blur');
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
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
    const totalTimer = setInterval(() => {
      setTotalTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(totalTimer);
  }, []);

  useEffect(() => {
    setQuestionTimeRemaining(testData.questionTime);
  }, [currentQuestionIndex]);

  useEffect(() => {
    const questionTimer = setInterval(() => {
      setQuestionTimeRemaining(prev => {
        if (prev <= 1) {
          handleNextQuestion();
          return testData.questionTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(questionTimer);
  }, [currentQuestionIndex]);

  const recordViolation = (type) => {
    setViolations(prev => [...prev, { type, timestamp: Date.now(), question: currentQuestion.id }]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (option) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      if (!answers[currentQuestion.id]) {
        setAnswers(prev => ({
          ...prev,
          [currentQuestion.id]: 'skipped'
        }));
      }
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = () => {
    onSubmit(answers, violations);
  };

  const getQuestionStatus = (question) => {
    if (!answers[question.id]) return 'unanswered';
    if (answers[question.id] === 'skipped') return 'skipped';
    return 'answered';
  };

  if (violations.length>= 3) {
    handleSubmit();
  }

  return (
    <div ref={testContainerRef} className="min-h-screen mt-14 bg-background font-kodchasan">
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
          <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{testData.title}</h2>
          
          <div className="space-y-2 mb-3 md:mb-4 text-xs md:text-sm">
            <div className="flex justify-between">
              <span>Total Duration:</span>
              <span className="font-semibold text-accent2">{formatTime(totalTimeRemaining)}</span>
            </div>
            <div className="flex justify-between">
              <span>Answered:</span>
              <span className="font-semibold text-accent1">{answeredCount}/{shuffledQuestions.length}</span>
            </div>
          </div>

          <div className="mb-2 md:mb-3">
            <h3 className="text-xs md:text-sm font-semibold mb-2">Questions:</h3>
            <div className="grid grid-cols-5 gap-1 md:gap-2">
              {shuffledQuestions.map((q, idx) => (
                <QuestionBlock
                  key={q.id}
                  qNum={idx + 1}
                  status={getQuestionStatus(q)}
                  onClick={() => goToQuestion(idx)}
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
              <span className="font-bold text-primary text-sm md:text-base">{formatTime(questionTimeRemaining)}</span>
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
                      ? 'border-secondary bg-secondary bg-opacity-10'
                      : 'border-gray-300 hover:border-accent1'
                  }`}
                >
                  <span className="font-semibold text-primary">{String.fromCharCode(65 + idx)}.</span> {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between gap-2 md:gap-4">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 md:px-6 py-2 md:py-3 bg-gray-400 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-all text-sm md:text-base"
            >
              Previous
            </button>
            
            {currentQuestionIndex === shuffledQuestions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-4 md:px-6 py-2 md:py-3 bg-accent1 text-white rounded-lg hover:bg-opacity-90 transition-all font-semibold text-sm md:text-base"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
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

const ResultsScreen = ({ answers, violations, shuffledQuestions, onRestart }) => {
  const calculateScore = () => {
    let correct = 0;
    shuffledQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();
  const percentage = Math.round((score / shuffledQuestions.length) * 100);

  return (
    <div className="min-h-screen  pt-16 bg-background flex items-center justify-center p-4 font-kodchasan">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-2xl w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">Test Completed!</h1>
        
        <div className="bg-accent1 bg-opacity-20 p-6 rounded-lg mb-6 text-center">
          <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{percentage}%</p>
          <p className="text-lg md:text-xl text-primary">
            {score} out of {shuffledQuestions.length} correct
          </p>
        </div>

        {violations.length > 0 && (
          <div className="bg-secondary bg-opacity-20 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <AlertTriangle size={20} /> Security Violations Detected: {violations.length}
            </h3>
            <p className="text-sm text-primary">Your test session had suspicious activity which has been recorded.</p>
          </div>
        )}

        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
          {shuffledQuestions.map((q, idx) => {
            const isCorrect = answers[q.id] === q.correctAnswer;
            const isSkipped = !answers[q.id] || answers[q.id] === 'skipped';
            
            return (
              <div key={q.id} className="border rounded-lg p-3">
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle className="text-green-500 mt-1" size={20} />
                  ) : (
                    <XCircle className="text-secondary mt-1" size={20} />
                  )}
                  <div className="flex-1 text-sm">
                    <p className="font-semibold text-primary mb-1">Q{idx + 1}: {q.question}</p>
                    <p className="text-gray-600">
                      Your answer: <span className={isSkipped ? 'text-accent2' : isCorrect ? 'text-green-600' : 'text-secondary'}>
                        {isSkipped ? 'Not answered' : answers[q.id]}
                      </span>
                    </p>
                    {!isCorrect && !isSkipped && (
                      <p className="text-green-600">Correct answer: {q.correctAnswer}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-secondary hover:bg-opacity-90 text-white font-semibold py-3 rounded-lg transition-all"
        >
          Take Another Test
        </button>
      </div>
    </div>
  );
};

const SecureTestApp = () => {
  const [testState, setTestState] = useState('start'); // start, testing, results
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [finalAnswers, setFinalAnswers] = useState({});
  const [finalViolations, setFinalViolations] = useState([]);

  const handleStartTest = () => {
    const shuffled = shuffleArray(testData.questions).map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    setShuffledQuestions(shuffled);
    setTestState('testing');
  };

  const handleSubmitTest = (answers, violations) => {
    setFinalAnswers(answers);
    setFinalViolations(violations);
    setTestState('results');
  };

  const handleRestart = () => {
    setTestState('start');
    setFinalAnswers({});
    setFinalViolations([]);
  };

  return (
    <div className="font-kodchasan">
      {testState === 'start' && <TestStartScreen onStart={handleStartTest} />}
      {testState === 'testing' && (
        <TestInterface 
          shuffledQuestions={shuffledQuestions} 
          onSubmit={handleSubmitTest}
        />
      )}
      {testState === 'results' && (
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