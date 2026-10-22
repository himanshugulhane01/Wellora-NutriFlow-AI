"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// GET /api/health-profile
router.get('/', async (req, res, next) => {
    try {
        const profile = await prisma_1.prisma.healthProfile.findUnique({
            where: { userId: req.user.id },
        });
        res.json({ success: true, data: profile });
    }
    catch (err) {
        next(err);
    }
});
// PUT /api/health-profile
router.put('/', async (req, res, next) => {
    try {
        const schema = zod_1.z.object({
            age: zod_1.z.number().int().min(1).max(120).optional(),
            heightCm: zod_1.z.number().positive().optional(),
            weightKg: zod_1.z.number().positive().optional(),
            targetWeightKg: zod_1.z.number().positive().optional(),
            fitnessGoal: zod_1.z.string().optional(),
            dailyCalorieTarget: zod_1.z.number().int().positive().optional(),
            diseases: zod_1.z.array(zod_1.z.string()).optional(),
            activityLevel: zod_1.z.string().optional(),
            dietaryPreference: zod_1.z.string().optional(),
            // Vitals
            bloodPressureSystolic: zod_1.z.number().int().min(60).max(250).optional().nullable(),
            bloodPressureDiastolic: zod_1.z.number().int().min(40).max(150).optional().nullable(),
            bloodSugarFasting: zod_1.z.number().min(30).max(600).optional().nullable(),
            cholesterolTotal: zod_1.z.number().min(50).max(600).optional().nullable(),
            heartRateBpm: zod_1.z.number().int().min(30).max(220).optional().nullable(),
            oxygenSaturation: zod_1.z.number().min(50).max(100).optional().nullable(),
            lastVitalScanAt: zod_1.z.string().datetime().optional().nullable(),
        });
        const body = schema.parse(req.body);
        // Calculate BMI if height/weight given
        let bmi;
        if (body.heightCm && body.weightKg) {
            const h = body.heightCm / 100;
            bmi = Math.round((body.weightKg / (h * h)) * 10) / 10;
        }
        const profile = await prisma_1.prisma.healthProfile.upsert({
            where: { userId: req.user.id },
            update: {
                ...(body.age !== undefined && { age: body.age }),
                ...(body.heightCm !== undefined && { heightCm: body.heightCm }),
                ...(body.weightKg !== undefined && { weightKg: body.weightKg }),
                ...(body.targetWeightKg !== undefined && { targetWeightKg: body.targetWeightKg }),
                ...(body.fitnessGoal !== undefined && { fitnessGoal: body.fitnessGoal }),
                ...(body.dailyCalorieTarget !== undefined && { dailyCalorieTarget: body.dailyCalorieTarget }),
                ...(body.diseases !== undefined && { diseases: JSON.stringify(body.diseases) }),
                ...(body.activityLevel !== undefined && { activityLevel: body.activityLevel }),
                ...(body.dietaryPreference !== undefined && { dietaryPreference: body.dietaryPreference }),
                ...(bmi !== undefined && { bmi }),
                // Vitals
                ...(body.bloodPressureSystolic !== undefined && { bloodPressureSystolic: body.bloodPressureSystolic }),
                ...(body.bloodPressureDiastolic !== undefined && { bloodPressureDiastolic: body.bloodPressureDiastolic }),
                ...(body.bloodSugarFasting !== undefined && { bloodSugarFasting: body.bloodSugarFasting }),
                ...(body.cholesterolTotal !== undefined && { cholesterolTotal: body.cholesterolTotal }),
                ...(body.heartRateBpm !== undefined && { heartRateBpm: body.heartRateBpm }),
                ...(body.oxygenSaturation !== undefined && { oxygenSaturation: body.oxygenSaturation }),
                ...(body.lastVitalScanAt !== undefined && { lastVitalScanAt: body.lastVitalScanAt ? new Date(body.lastVitalScanAt) : null }),
            },
            create: {
                userId: req.user.id,
                age: body.age || 25,
                heightCm: body.heightCm || 165,
                weightKg: body.weightKg || 65,
                targetWeightKg: body.targetWeightKg || 60,
                fitnessGoal: body.fitnessGoal || 'General Wellness',
                dailyCalorieTarget: body.dailyCalorieTarget || 1800,
                diseases: JSON.stringify(body.diseases || []),
                bmi,
                bloodPressureSystolic: body.bloodPressureSystolic || null,
                bloodPressureDiastolic: body.bloodPressureDiastolic || null,
                bloodSugarFasting: body.bloodSugarFasting || null,
                cholesterolTotal: body.cholesterolTotal || null,
                heartRateBpm: body.heartRateBpm || null,
                oxygenSaturation: body.oxygenSaturation || null,
                lastVitalScanAt: body.lastVitalScanAt ? new Date(body.lastVitalScanAt) : null,
            },
        });
        res.json({ success: true, data: profile });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=health-profile.routes.js.map