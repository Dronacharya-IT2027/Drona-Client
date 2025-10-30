import express from 'express';
import {
  submitTest,
  getStudentDetails,
  loginStudent,
  getTestWithScore,
  getAllTestScores
} from '../controllers/studentController.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Login route - no token needed
router.post('/login', loginStudent);

// Get logged-in student's details
router.get('/me', verifyToken, verifyRole(['student']), getStudentDetails);

// Submit a test
router.post('/submit-test', verifyToken, verifyRole(['student']), submitTest);

// Get a specific test along with student's score
router.get('/test/:testId', verifyToken, verifyRole(['student']), getTestWithScore);

// Get all test scores of the logged-in student
router.get('/test-scores', verifyToken, verifyRole(['student']), getAllTestScores);

export default router;
