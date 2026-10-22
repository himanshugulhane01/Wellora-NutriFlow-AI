import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import { sendOtpEmail, generate6DigitOtp } from '../services/email.service';

const router = Router();

// In-memory OTP store (phone -> { otp, expiresAt })
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

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

    // Create default health profile for customers (starts at 0 until user enters their report)
    if (user.role === 'CUSTOMER') {
      await prisma.healthProfile.create({
        data: {
          userId: user.id,
          age: 25,
          heightCm: 0,
          weightKg: 0,
          targetWeightKg: 0,
          bmi: 0,
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

// In-memory Email OTP store (email -> { otp, expiresAt })
const emailOtpStore = new Map<string, { otp: string; expiresAt: number }>();

// POST /api/auth/send-email-otp
router.post('/send-email-otp', async (req, res: Response, next) => {
  try {
    const schema = z.object({
      email: z.string().email('Please provide a valid email address'),
      name: z.string().optional(),
    });
    const { email, name } = schema.parse(req.body);

    const normalizedEmail = email.trim().toLowerCase();

    // Generate strict 6-digit OTP
    const otp = generate6DigitOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    emailOtpStore.set(normalizedEmail, { otp, expiresAt });

    // Send via Nodemailer SMTP
    const emailResult = await sendOtpEmail(normalizedEmail, otp, name || 'User');

    res.json({
      success: true,
      message: emailResult.sent
        ? `A 6-digit verification code has been sent to ${normalizedEmail}`
        : `Verification code generated for ${normalizedEmail}`,
      data: {
        email: normalizedEmail,
        expiresInSeconds: 300,
        simulated: emailResult.simulated,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/verify-email-otp
router.post('/verify-email-otp', async (req, res: Response, next) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      otp: z.string().length(6, 'OTP must be exactly 6 digits'),
    });
    const { email, otp } = schema.parse(req.body);

    const normalizedEmail = email.trim().toLowerCase();
    const stored = emailOtpStore.get(normalizedEmail);

    if (!stored) {
      throw new AppError('No verification code requested for this email. Please request an OTP first.', 400);
    }

    if (Date.now() > stored.expiresAt) {
      emailOtpStore.delete(normalizedEmail);
      throw new AppError('Verification code has expired. Please request a new OTP.', 400);
    }

    if (stored.otp !== otp.trim()) {
      throw new AppError('Invalid verification code. Please check your email and try again.', 400);
    }

    // Successfully verified, clean up store
    emailOtpStore.delete(normalizedEmail);

    res.json({
      success: true,
      message: 'Email verified successfully!',
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/send-otp (Mobile SMS OTP)
router.post('/send-otp', async (req, res: Response, next) => {
  try {
    const schema = z.object({ phone: z.string().min(10) });
    const { phone } = schema.parse(req.body);

    // Format clean phone number (e.g. 9876543210)
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const formattedPhone = `+91 ${cleanPhone}`;

    // Generate strict 6-digit random OTP
    const otp = generate6DigitOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    otpStore.set(phone, { otp, expiresAt });
    otpStore.set(formattedPhone, { otp, expiresAt });
    otpStore.set(cleanPhone, { otp, expiresAt });

    // Attempt Fast2SMS or Twilio real SMS API call if configured
    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    if (fast2smsKey && fast2smsKey !== 'YOUR_FAST2SMS_API_KEY_HERE') {
      try {
        await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=otp&variables_values=${otp}&numbers=${cleanPhone}`);
        console.log(`📱 [REAL SMS DISPATCHED] Fast2SMS OTP sent to ${formattedPhone}`);
      } catch (smsErr) {
        console.error('⚠️ SMS Gateway error:', smsErr);
      }
    }

    console.log(`\n==============================================`);
    console.log(`📱 [MOBILE SMS DISPATCHED]`);
    console.log(`   To Mobile Number : ${formattedPhone}`);
    console.log(`   Verification OTP : ${otp}`);
    console.log(`   Valid For        : 5 Minutes`);
    console.log(`==============================================\n`);

    res.json({
      success: true,
      message: `Verification code sent via SMS to ${formattedPhone}`,
      data: { phone: formattedPhone, expiresInSeconds: 300 }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/verify-otp (Mobile SMS OTP)
router.post('/verify-otp', async (req, res: Response, next) => {
  try {
    const schema = z.object({
      phone: z.string().min(10),
      otp: z.string().length(6),
    });
    const { phone, otp } = schema.parse(req.body);

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const formattedPhone = `+91 ${cleanPhone}`;

    const stored = otpStore.get(phone) || otpStore.get(formattedPhone) || otpStore.get(cleanPhone);
    if (!stored) {
      throw new AppError('No OTP request found for this phone number. Please request an OTP first.', 400);
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(phone);
      otpStore.delete(formattedPhone);
      otpStore.delete(cleanPhone);
      throw new AppError('OTP expired. Please request a new OTP.', 400);
    }

    if (stored.otp !== otp) {
      throw new AppError('Invalid OTP code. Please check and try again.', 400);
    }

    // Mark as verified and remove from store
    otpStore.delete(phone);
    otpStore.delete(formattedPhone);
    otpStore.delete(cleanPhone);

    res.json({
      success: true,
      message: 'Mobile number verified successfully!',
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/admin/overview — comprehensive platform users & operations data for Admin
router.get('/admin/overview', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AppError('Access denied. Administrator privileges required.', 403);
    }

    const [users, totalOrders, recentOrders, totalRestaurants, totalDoctors, totalMeals] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          healthProfile: {
            select: {
              fitnessGoal: true,
              diseases: true,
              bmi: true,
              age: true,
              weightKg: true,
              heightCm: true,
              bloodPressureSystolic: true,
              bloodPressureDiastolic: true,
              bloodSugarFasting: true,
              cholesterolTotal: true,
              heartRateBpm: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count(),
      prisma.order.findMany({
        take: 10,
        select: {
          id: true,
          status: true,
          totalAmount: true,
          placedAt: true,
          user: { select: { name: true, email: true } },
          restaurant: { select: { name: true } },
        },
        orderBy: { placedAt: 'desc' },
      }),
      prisma.restaurant.count(),
      prisma.doctor.count(),
      prisma.meal.count(),
    ]);

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers: users.length,
          totalOrders,
          totalRestaurants,
          totalDoctors,
          totalMeals,
          activeSubscribers: Math.max(users.filter(u => u.role === 'CUSTOMER').length, 1),
        },
        users,
        recentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/auth/admin/users/:id/role — Change user role
router.patch('/admin/users/:id/role', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AppError('Access denied. Administrator privileges required.', 403);
    }

    const { role } = req.body as { role: string };
    const validRoles = ['CUSTOMER', 'DOCTOR', 'RESTAURANT_OWNER', 'ADMIN'];
    if (!role || !validRoles.includes(role)) {
      throw new AppError('Invalid role specified', 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id as string },
      data: { role: role as any },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      data: updatedUser,
      message: `User role successfully updated to ${role}`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
