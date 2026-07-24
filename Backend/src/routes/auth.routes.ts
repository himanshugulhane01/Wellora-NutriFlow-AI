import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  role: z.enum(['CUSTOMER', 'RESTAURANT_OWNER', 'DOCTOR', 'DELIVERY_AGENT']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const generateToken = (user: { id: string; email: string; role: string }) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
  );
};

// POST /api/auth/register
router.post('/register', async (req, res: Response, next) => {
  try {
    const body = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) throw new AppError('Email already registered', 409);

    const hashedPassword = await bcrypt.hash(body.password, 12);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        phone: body.phone,
        role: body.role || 'CUSTOMER',
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    // Create default health profile for customers
    if (user.role === 'CUSTOMER') {
      await prisma.healthProfile.create({
        data: {
          userId: user.id,
          age: 25,
          heightCm: 165,
          weightKg: 65,
          targetWeightKg: 60,
          fitnessGoal: 'General Wellness',
          dailyCalorieTarget: 1800,
          diseases: '[]',
        },
      });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res: Response, next) => {
  try {
    const body = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) throw new AppError('Invalid email or password', 401);

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) throw new AppError('Invalid email or password', 401);

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, name: true, email: true, role: true, avatar: true, phone: true,
        healthProfile: true,
        addresses: true,
      },
    });
    if (!user) throw new AppError('User not found', 404);

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
