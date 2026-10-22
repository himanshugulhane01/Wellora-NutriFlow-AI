"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const zod_1 = require("zod");
const auth_middleware_1 = require("../middleware/auth.middleware");
const error_middleware_1 = require("../middleware/error.middleware");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
// POST /api/payments/create-razorpay-order
router.post('/create-razorpay-order', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const schema = zod_1.z.object({
            amount: zod_1.z.number().positive(), // in INR
            currency: zod_1.z.string().default('INR'),
            orderId: zod_1.z.string().optional(),
        });
        const { amount, currency, orderId } = schema.parse(req.body);
        const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_Seq6pkI96ruWHa';
        const keySecret = process.env.RAZORPAY_KEY_SECRET || 'RqRI0b2XJbBbxiDR2gQgPGnY';
        // Amount in paise (1 INR = 100 paise)
        const amountInPaise = Math.round(amount * 100);
        // Call Razorpay REST API
        const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            body: JSON.stringify({
                amount: amountInPaise,
                currency,
                receipt: `receipt_${orderId || Date.now()}`,
                notes: {
                    userId: req.user.id,
                    app: 'Wellora',
                },
            }),
        });
        const razorpayData = await razorpayResponse.json();
        if (!razorpayResponse.ok) {
            console.error('Razorpay Order Creation Failed:', razorpayData);
            throw new error_middleware_1.AppError(razorpayData?.error?.description || 'Razorpay order creation failed', 500);
        }
        res.json({
            success: true,
            data: {
                id: razorpayData.id,
                amount: razorpayData.amount,
                currency: razorpayData.currency,
                keyId,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
// POST /api/payments/verify-razorpay-payment
router.post('/verify-razorpay-payment', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const schema = zod_1.z.object({
            razorpay_order_id: zod_1.z.string(),
            razorpay_payment_id: zod_1.z.string(),
            razorpay_signature: zod_1.z.string(),
            orderId: zod_1.z.string().optional(),
        });
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = schema.parse(req.body);
        const keySecret = process.env.RAZORPAY_KEY_SECRET || 'RqRI0b2XJbBbxiDR2gQgPGnY';
        // HMAC SHA256 signature verification
        const expectedSignature = crypto_1.default
            .createHmac('sha256', keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');
        const isValid = expectedSignature === razorpay_signature;
        if (!isValid) {
            throw new error_middleware_1.AppError('Payment signature verification failed. Invalid payment.', 400);
        }
        // Update order status in DB if orderId provided
        if (orderId) {
            await prisma_1.prisma.order.update({
                where: { id: orderId },
                data: { status: 'CONFIRMED' },
            }).catch(() => { });
        }
        res.json({
            success: true,
            message: 'Razorpay payment verified successfully!',
            data: {
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=payment.routes.js.map