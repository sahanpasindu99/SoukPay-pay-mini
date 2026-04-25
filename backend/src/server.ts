import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import rewardRoutes from './routes/rewardRoutes.ts';
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/rewards', rewardRoutes);


app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running at Port : ${PORT}`);
});