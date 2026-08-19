import express from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { createDonation, getDonations, getUserDonations, getDonationStats } from '../controllers/donations.controller';

const router = express.Router();

router.post('/', verifyToken, createDonation);
router.get('/', getDonations);
router.get('/my', verifyToken, getUserDonations);
router.get('/stats', getDonationStats);

export default router;
