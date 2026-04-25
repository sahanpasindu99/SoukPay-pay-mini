import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma'; 

export interface AuthRequest extends Request {
  userId?: string;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    //  Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const userExists = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true }
    });

    if (!userExists) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    console.error("JWT Verification Error:", error.name);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired', 
        isExpired: true 
      });
    }

    res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
  }
};
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// export interface AuthRequest extends Request {
//   userId?: string;
// }

// export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized, Access Denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Not authorized, Access Denied' });
//   }
// };