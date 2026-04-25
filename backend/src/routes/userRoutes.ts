import { Router } from 'express';
import { getLeaderboard, getMe, getTransactions } from '../controllers/userController.ts';
import { protect } from '../middlewares/auth.ts';

const router = Router();

router.get('/me', protect, getMe);
router.get('/me/transactions', protect, getTransactions);
router.get('/leaderboard', protect, getLeaderboard);

export default router;