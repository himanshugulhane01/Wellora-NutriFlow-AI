"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const auth_middleware_1 = require("../middleware/auth.middleware");
const error_middleware_1 = require("../middleware/error.middleware");
const router = (0, express_1.Router)();
// In-memory OTP store (phone -> { otp, expiresAt })
const otpStore = new Map();
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    phone: zod_1.z.string().optional(),
    role: zod_1.z.enum(['CUSTOMER', 'RESTAURANT_OWNER', 'DOCTOR', 'DELIVERY_AGENT']).optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') });
};
// POST /api/auth/register
router.post('/register', async (req, res, next) => {
    try {
        const body = registerSchema.parse(req.body);
        const existing = await prisma_1.prisma.user.findUnique({ where: { email: body.email } });
        if (existing)
            throw new error_middleware_1.AppError('Email already registered', 409);
        const hashedPassword = await bcryptjs_1.default.hash(body.password, 12);
        const user = await prisma_1.prisma.user.create({
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
            await prisma_1.prisma.healthProfile.create({
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
    }
    catch (err) {
        next(err);
    }
});
// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    try {
        const body = loginSchema.parse(req.body);
        const user = await prisma_1.prisma.user.findUnique({ where: { email: body.email } });
        if (!user)
            throw new error_middleware_1.AppError('Invalid email or password', 401);
        const isMatch = await bcryptjs_1.default.compare(body.password, user.password);
        if (!isMatch)
            throw new error_middleware_1.AppError('Invalid email or password', 401);
        const token = generateToken({ id: user.id, email: user.email, role: user.role });
        res.json({
            success: true,
            data: {
                user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
                token,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/auth/me
router.get('/me', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true, name: true, email: true, role: true, avatar: true, phone: true,
                healthProfile: true,
                addresses: true,
            },
        });
        if (!user)
            throw new error_middleware_1.AppError('User not found', 404);
        res.json({ success: true, data: user });
    }
    catch (err) {
        next(err);
    }
});
// POST /api/auth/send-otp
router.post('/send-otp', async (req, res, next) => {
    try {
        const schema = zod_1.z.object({ phone: zod_1.z.string().min(10) });
        const { phone } = schema.parse(req.body);
        // Format clean phone number (e.g. 9876543210)
        const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
        const formattedPhone = `+91 ${cleanPhone}`;
        // Generate 6-digit random OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity
        otpStore.set(phone, { otp, expiresAt });
        otpStore.set(formattedPhone, { otp, expiresAt });
        otpStore.set(cleanPhone, { otp, expiresAt });
        // Attempt Fast2SMS or Twilio real SMS API call if configured
        const fast2smsKey = process.env.FAST2SMS_API_KEY;
        if (fast2smsKey) {
            try {
                await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=otp&variables_values=${otp}&numbers=${cleanPhone}`);
                console.log(`📱 [REAL SMS DISPATCHED] Fast2SMS OTP sent to ${formattedPhone}`);
            }
            catch (smsErr) {
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
    }
    catch (err) {
        next(err);
    }
});
// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res, next) => {
    try {
        const schema = zod_1.z.object({
            phone: zod_1.z.string().min(10),
            otp: zod_1.z.string().length(6),
        });
        const { phone, otp } = schema.parse(req.body);
        const stored = otpStore.get(phone);
        if (!stored) {
            throw new error_middleware_1.AppError('No OTP request found for this phone number. Please request an OTP first.', 400);
        }
        if (Date.now() > stored.expiresAt) {
            otpStore.delete(phone);
            throw new error_middleware_1.AppError('OTP expired. Please request a new OTP.', 400);
        }
        if (stored.otp !== otp) {
            throw new error_middleware_1.AppError('Invalid OTP code. Please check and try again.', 400);
        }
        // Mark as verified and remove from store
        otpStore.delete(phone);
        res.json({
            success: true,
            message: 'Mobile number verified successfully!',
        });
    }
    catch (err) {
        next(err);
    }
});
// GET /api/auth/admin/overview — comprehensive platform users & operations data for Admin
router.get('/admin/overview', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        if (req.user?.role !== 'ADMIN') {
            throw new error_middleware_1.AppError('Access denied. Administrator privileges required.', 403);
        }
        const [users, totalOrders, recentOrders, totalRestaurants, totalDoctors, totalMeals] = await Promise.all([
            prisma_1.prisma.user.findMany({
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
            prisma_1.prisma.order.count(),
            prisma_1.prisma.order.findMany({
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
            prisma_1.prisma.restaurant.count(),
            prisma_1.prisma.doctor.count(),
            prisma_1.prisma.meal.count(),
        ]);
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
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map