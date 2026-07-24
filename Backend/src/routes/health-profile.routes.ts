import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

// GET /api/health-profile
router.get('/', async (req: AuthRequest, res: Response, next) => {
  try {
    const profile = await prisma.healthProfile.findUnique({
      where: { userId: req.user!.id },
    });

    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
});

// PUT /api/health-profile
router.put('/', async (req: AuthRequest, res: Response, next) => {
  try {
    const schema = z.object({
      age: z.number().int().min(1).max(120).optional(),
      heightCm: z.number().positive().optional(),
      weightKg: z.number().positive().optional(),
      targetWeightKg: z.number().positive().optional(),
      fitnessGoal: z.string().optional(),
      dailyCalorieTarget: z.number().int().positive().optional(),
      diseases: z.array(z.string()).optional(),
      activityLevel: z.string().optional(),
      dietaryPreference: z.string().optional(),
    });

    const body = schema.parse(req.body);

    // Calculate BMI if height/weight given
    let bmi: number | undefined;
    if (body.heightCm && body.weightKg) {
      const h = body.heightCm / 100;
      bmi = Math.round((body.weightKg / (h * h)) * 10) / 10;
    }

    const profile = await prisma.healthProfile.upsert({
      where: { userId: req.user!.id },
      update: {
        ...body,
        diseases: body.diseases ? JSON.stringify(body.diseases) : undefined,
        bmi,
      },
      create: {
        userId: req.user!.id,
        age: body.age || 25,
        heightCm: body.heightCm || 165,
        weightKg: body.weightKg || 65,
        targetWeightKg: body.targetWeightKg || 60,
        fitnessGoal: body.fitnessGoal || 'General Wellness',
        dailyCalorieTarget: body.dailyCalorieTarget || 1800,
        diseases: JSON.stringify(body.diseases || []),
        bmi,
      },
    });

    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
});

export default router;
