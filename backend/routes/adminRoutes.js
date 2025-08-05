import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
} from '../controllers/adminController.js';
import { verifyAdmin } from '../middleware/protect.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', verifyAdmin, logoutAdmin); 
router.get('/me', verifyAdmin, getAdminProfile);

export default router;