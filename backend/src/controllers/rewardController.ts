import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.ts';
import { prisma } from '../lib/prisma.ts';

// GET /rewards -  active rewards with stock > 0
export const getRewards = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    const [rewards, total] = await prisma.$transaction([
      prisma.reward.findMany({
        where: {
          isActive: true,
          stockRemaining: { gt: 0 }
        },
        skip: skip,
        take: limit,
      }),
      prisma.reward.count({
        where: {
          isActive: true,
          stockRemaining: { gt: 0 }
        }
      })
    ]);
    res.status(200).json({ success: true, data: rewards });
  } catch (error) {
    console.error("Fetching rewards error", error);
    res.status(500).json({ success: false, message: 'Error fetching rewards' });
  }
};

// POST /rewards/:id/redeem - claim redemption
export const redeemReward = async (req: AuthRequest, res: Response) => {
  const { id: rewardId } = req.params;
  const userId = req.userId!;
  const idempotencyKey = req.headers['x-idempotency-key'] as string;

  if (!idempotencyKey) {
    return res.status(400).json({ 
      success: false,
      message: 'X-Idempotency-Key header is required for atomic redemption' 
    });
  }

  try {
    const result = await prisma.$transaction(async (tns: any) => { 
      const existing = await tns.redemption.findUnique({ 
        where: { idempotencyKey },
        include: { reward: true } 
      });
      
      if (existing) {
        return { data: existing, alreadyProcessed: true };
      }

      const reward = await tns.reward.findUnique({ where: { id: rewardId } });
      if (!reward || !reward.isActive || reward.stockRemaining <= 0) {
        throw new Error('REWARD_UNAVAILABLE');
      }


      // Check Balance 
      const balanceAgg = await tns.pointLedger.aggregate({
        where: { userId },
        _sum: { delta: true }
      });
      const currentBalance = balanceAgg._sum.delta || 0;

     console.log("BALANCE:", currentBalance);
     console.log("REWARD:", reward.pointsCost);

      if (currentBalance < reward.pointsCost) {
        throw new Error('INSUFFICIENT_POINTS');
      }

      const redemption = await tns.redemption.create({
        data: {
          userId,
          rewardId,
          pointsCost: reward.pointsCost,
          idempotencyKey
        }
      });

      await tns.pointLedger.create({
        data: {
          userId,
          delta: -reward?.pointsCost || 0,
          reason: `${reward?.name || 'Redeemed reward'}`
        }
      });

      await tns.reward.update({
        where: { id: rewardId },
        data: { stockRemaining: { decrement: 1 } }
      });

      return { data: redemption, alreadyProcessed: false };
    });
    

    const status = result.alreadyProcessed ? 200 : 201;
    res.status(status).json({ success: true, message: 'Reward redeemed successfully', data: result.data });

  } catch (error: any) {
    console.error(error);
    if (error.message === 'REWARD_UNAVAILABLE') {
      return res.status(400).json({ success: false, message: 'Reward is out of stock or inactive' });
    }
    if (error.message === 'INSUFFICIENT_POINTS') {
      return res.status(400).json({ success: false, message: 'Insufficient point balance' });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /rewards/me/redemptions - bonus history
export const getMyRedemptions = async (req: AuthRequest, res: Response) => {
  try {
    const redemptions = await prisma.redemption.findMany({
      where: { userId: req.userId },
      include: { reward: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: redemptions });
  } catch (error) {
    console.error("Fetching my redemptions error", error);
    res.status(500).json({ success: false, message: 'Error fetching redemption history' });
  }
};