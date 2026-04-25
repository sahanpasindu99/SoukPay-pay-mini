import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.redemption.deleteMany();
  await prisma.pointLedger.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  console.log('Seeding users =>');
  const users = await Promise.all([
    prisma.user.create({ data: { email: 'sahan@example.com', name: 'Sahan', password: hashedPassword } }),
    prisma.user.create({ data: { email: 'souk@soukpay.com', name: 'Souk', password: hashedPassword } }),
    prisma.user.create({ data: { email: 'test@user.com', name: 'Test User', password: hashedPassword } }),
  ]);

console.log('Seeding rewards =>');
  const rewards = await Promise.all([
    prisma.reward.create({
      data: {
        name: 'Starbucks Coffee',
        description: 'Grande Latte or Cappuccino',
        pointsCost: 50,
        stockRemaining: 10,
        isActive: true,
        imageUrl: 'https://unsplash.com/photos/white-and-brown-starbucks-cup-7Gm1Jwt1uYA',
      }
    }),
    prisma.reward.create({
      data: {
        name: 'Amazon Voucher',
        description: '$10 Digital Gift Card',
        pointsCost: 5000,
        stockRemaining: 5,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=500&auto=format&fit=crop',
      }
    }),
    prisma.reward.create({
      data: {
        name: 'Netflix 1 Month',
        description: 'Standard HD Plan Subscription',
        pointsCost: 990,
        stockRemaining: 2,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=500&auto=format&fit=crop',
      }
    }),
    prisma.reward.create({
      data: {
        name: 'SoukPay Cap',
        description: 'Limited Edition Premium Embroidered Cap',
        pointsCost: 1500,
        stockRemaining: 20,
        isActive: true,
        imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=500&auto=format&fit=crop',
      }
    }),
  ]);

  console.log('Seeding ledger entries =>');
  for (const user of users) {
    const entries = Array.from({ length: 16 }).map((_, i) => ({
      userId: user.id,
      delta: Math.floor(Math.random() * 100) + 20,
      reason: i === 0 ? 'Welcome Bonus' : `Daily Reward #${i}`,
    }));
    
    await prisma.pointLedger.createMany({ data: entries });
  }

  console.log('Seed successful!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });