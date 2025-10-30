import express from 'express';
import { createStudent, createTest } from '../controllers/adminController.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only admin can create student and test
router.post('/student', verifyToken, verifyRole(['admin']), createStudent);
router.post('/test', verifyToken, verifyRole(['admin']), createTest);

export default router;
