import express from 'express';
import {
  schedulePickup,
  getPickups,
  updatePickupStatus,
  getNGOPickups,
  getDonorPickups,
} from '../controllers/pickupController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['Donor']), schedulePickup);
router.get('/', authMiddleware, getPickups);
router.get('/ngo/schedule', authMiddleware, roleMiddleware(['NGO']), getNGOPickups);
router.get('/donor/schedule', authMiddleware, roleMiddleware(['Donor']), getDonorPickups);
router.put('/:id', authMiddleware, updatePickupStatus);

export default router;
