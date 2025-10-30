import express from 'express';
import { createAdmin, getAdminLists } from '../controllers/superAdminController.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/admin', verifyToken, verifyRole(['superadmin']), createAdmin);
router.get('/admins', verifyToken, verifyRole(['superadmin']), getAdminLists);

export default router;
