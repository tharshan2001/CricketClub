import express from 'express';
import {
  createMatch,
  getAllMatches,
  getMatchById,
  getFutureMatches,
  getCompletedMatches,
  updateMatch,
  deleteMatch
} from '../controllers/matchesController.js';
import { verifyAdmin, protect } from '../middleware/protect.js';

const router = express.Router();

// ✅ Specific routes first
router.post('/',verifyAdmin, createMatch);

router.get('/getAdmin', getAllMatches);
router.get('/future', getFutureMatches);
router.get('/completed', getCompletedMatches);
router.get('/', getAllMatches); 

// ✅ Dynamic routes last
router.get('/:id', verifyAdmin, getMatchById);
router.put('/:id',verifyAdmin, updateMatch);
router.delete('/:id',verifyAdmin, deleteMatch);

export default router;
