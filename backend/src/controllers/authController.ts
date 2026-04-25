import { Request, Response } from 'express';
import { comparePassword, generateToken } from '../utils/auth.ts';
import { prisma } from '../lib/prisma.ts';

// POST /auth/login - user login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
 try {
    const user = await prisma.user.findUnique({ where: { email: email.trim() } });
    const balanceData = await prisma.pointLedger.aggregate({
      where: { userId: user?.id },
      _sum: { delta: true }
    });

    const availablePoints = balanceData?._sum?.delta || 0;

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    return res.status(200).json({
      token: generateToken(user.id),
      // user: { name: user.name },
       user: {email: user.email, name: user.name, availablePoints },
    });

  }
  catch (error) {
    console.error("login error", error);
    res.status(500).json({ message: 'Server error' });
  }
};