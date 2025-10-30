import express from 'express';
import {
  getCurrentActiveTest,
  getTestForStudent,
  getTestResult,
  getLeaderboard,
  getStudentsNotSubmittedTest
} from '../controllers/testController.js';

import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get active/current tests within next 4 hours - student only
router.get('/current', verifyToken, verifyRole(['student']), getCurrentActiveTest);

// Route to fetch specific test for student if test started and not submitted yet
router.get('/:testId', verifyToken, verifyRole(['student']), getTestForStudent);

// Route to get student's result for a test
router.get('/:testId/result', verifyToken, verifyRole(['student']), getTestResult);

// Route to get leaderboard for a test (visible to admin and student)
router.get('/:testId/leaderboard', verifyToken, verifyRole(['admin', 'student']), getLeaderboard);

// Route to get list of students who have not submitted test (admin only)
router.get('/:testId/not-submitted', verifyToken, verifyRole(['admin']), getStudentsNotSubmittedTest);

export default router;
