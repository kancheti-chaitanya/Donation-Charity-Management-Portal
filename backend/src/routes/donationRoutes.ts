import express from 'express';
import {
  createDonation,
  getDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
  getNGODonations,
} from '../controllers/donationController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['NGO']), createDonation);
router.get('/', getDonations);
router.get('/my-donations', authMiddleware, roleMiddleware(['NGO']), getNGODonations);
router.get('/:id', getDonationById);
router.put('/:id', authMiddleware, roleMiddleware(['NGO']), updateDonation);
router.delete('/:id', authMiddleware, roleMiddleware(['NGO']), deleteDonation);

export default router;
