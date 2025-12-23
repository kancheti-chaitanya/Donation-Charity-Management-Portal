import express from 'express';
import { getLeaderboard, getDonorStats } from '../controllers/leaderboardController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', getLeaderboard);
router.get('/stats', authMiddleware, getDonorStats);

export default router;
