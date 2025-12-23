import express from 'express';
import {
  createContribution,
  getContributions,
  getDonorContributions,
} from '../controllers/contributionController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['Donor']), createContribution);
router.get('/', authMiddleware, getContributions);
router.get('/my-contributions', authMiddleware, roleMiddleware(['Donor']), getDonorContributions);

export default router;
