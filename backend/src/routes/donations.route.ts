import express from 'express';
import { optionalVerifyToken, verifyToken } from '../middleware/verifyToken';
import { getDonations, getUserDonations, getDonationStats, createCheckoutSession, getCheckoutSession } from '../controllers/donations.controller';
import { checkoutLimiter } from '../middleware/rateLimits';

const router = express.Router();

router.get('/', getDonations);
router.get('/my', verifyToken, getUserDonations);
router.get('/stats', getDonationStats);
router.get('/checkout-session/:sessionId', checkoutLimiter, getCheckoutSession);
router.post('/create-checkout-session', checkoutLimiter, optionalVerifyToken, createCheckoutSession);

export default router;
