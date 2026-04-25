import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.ts';
import { prisma } from '../lib/prisma.ts';

// GET /users/me - get my profile
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, createdAt: true }
    });

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    const balanceAggregate = await prisma.pointLedger.aggregate({ 
      where: { userId: req.userId },
      _sum: { delta: true }
    });

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      ...user,
      balance: balanceAggregate._sum.delta || 0
    });
  } catch (error) {
    console.error("Fetching profile error", error);
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
};

// GET /users/me/transactions - get my transactions
export const getTransactions = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  try {
    const transactions = await prisma.pointLedger.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    res.status(200).json({
        success: true,
        page,
        limit,
        data: transactions
    });
  } catch (error) {
    console.error("Fetching transactions error", error);
    res.status(500).json({ success: false, message: 'Error fetching transactions' });
  }
};

// GET /users/leaderboard - top 10 users by lifetime points
export const getLeaderboard = async (req: AuthRequest, res: Response) => { 
  try {
    const leaderboard = await prisma.pointLedger.groupBy({
      by: ['userId'],
      where: {
        delta: { gt: 0 }
      },
      _sum: {
        delta: true
      },
      orderBy: {
        _sum: {
          delta: 'desc'
        }
      },
      take: 10
    });

    const users = await prisma.user.findMany({
      where: {
        id: { in: leaderboard.map((leader:any) => leader.userId) }
      },
      select: {
        id: true,
        name: true
      }
    });

    const result = leaderboard.map((leader:any) => {
      const user = users.find((user:any) => user.id === leader.userId);
      return {
        id: leader.userId,
        name: user?.name,
        lifetimePoints: leader._sum.delta || 0
      };
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Fetching leaderboard error", error);
    res.status(500).json({ success: false, message: 'Error fetching leaderboard' });
  }
};