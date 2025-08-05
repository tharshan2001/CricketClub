import express from "express";
import {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
  uploadPlayerImage,
  removePlayerImage,
  loginPlayer,
  logoutPlayer,
  getPlayerProfile,
  updatePerformanceController,
  getFeaturedPlayers
} from "../controllers/playerController.js";

import uploadImage from "../middleware/uploadImage.js";
import { protect, verifyAdmin } from "../middleware/protect.js";

const router = express.Router();

// PUBLIC
router.post("/register", createPlayer);
router.post("/login", loginPlayer);
router.get("/", getAllPlayers);
router.get("/players/featured", getFeaturedPlayers);

router.patch("/:id/performance",verifyAdmin, updatePerformanceController);
router.delete("/:id",verifyAdmin, deletePlayer);


router.get("/profile",protect, getPlayerProfile);

router.get("/:id",protect, getPlayerById);
router.put("/:id",protect, updatePlayer);
router.post("/logout", logoutPlayer);

router.post("/image", protect, uploadImage.single("image"), uploadPlayerImage);
router.delete("/image", protect, removePlayerImage);

export default router;
