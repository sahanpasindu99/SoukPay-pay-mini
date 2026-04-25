import { Router } from 'express';
import { getMyRedemptions, getRewards, redeemReward } from '../controllers/rewardController.ts';
import { protect } from '../middlewares/auth.ts';

const router = Router();

router.get('/', protect, getRewards);
router.post('/:id/redeem', protect, redeemReward);
router.get('/me/redemptions', protect, getMyRedemptions);

export default router;