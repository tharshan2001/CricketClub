import express from 'express';
import {
  createTournament,
  getTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
} from '../controllers/tournamentController.js';
import { protect, verifyAdmin } from "../middleware/protect.js";

const router = express.Router();

// CRUD routes
router.post('/',verifyAdmin, createTournament);
router.get('/', getTournaments);
router.get('/:id',verifyAdmin, getTournamentById);
router.put('/:id',verifyAdmin, updateTournament);
router.delete('/:id',verifyAdmin, deleteTournament);

export default router;
