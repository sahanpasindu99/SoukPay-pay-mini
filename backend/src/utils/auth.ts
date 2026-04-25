import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

interface JwtIdPayload {
  userId: string;
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET missing');
}

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId } as JwtIdPayload, JWT_SECRET, { expiresIn: '1d' }); //5m
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};