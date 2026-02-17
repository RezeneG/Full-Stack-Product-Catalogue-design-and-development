// routes/payments.js - Complete Stripe Payment Integration
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { auth } = require('../middleware/auth');

// @route   POST /api/payments/create-payment-intent
// @desc    Create a payment intent for Stripe
// @access  Private (or Public for guest checkout)
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { 
            amount, 
            currency = 'usd',
            metadata = {},
            guestId,
            guestEmail
        } = req.body;

        // Validate amount
        if (!amount || amount < 50) { // Minimum 50 cents = $0.50
            return res.status(400).json({
                error: 'Amount must be at least $0.50'
            });
        }

        // Create PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount), // Amount in cents
            currency,
            metadata: {
                ...metadata,
                guestId: guestId || null,
                guestEmail: guestEmail || null,
                userId: req.userId || null,
                timestamp: new Date().toISOString()
            },
            // Optional: automatic payment methods
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency
        });

    } catch (error) {
        console.error('Payment intent error:', error);
        res.status(500).json({
            error: error.message || 'Failed to create payment intent'
        });
    }
});

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhook events
// @access  Public (called by Stripe)
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('✅ Payment succeeded:', paymentIntent.id);
            
            // Update your order status in database here
            // await updateOrderStatus(paymentIntent.id, 'completed');
            break;

        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('❌ Payment failed:', failedPayment.id);
            
            // Update order status to failed
            // await updateOrderStatus(failedPayment.id, 'failed');
            break;

        case 'payment_intent.created':
            console.log('🔄 Payment intent created:', event.data.object.id);
            break;

        case 'checkout.session.completed':
            console.log('✅ Checkout completed');
            break;

        default:
            console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({received: true});
});

// @route   GET /api/payments/config
// @desc    Get Stripe publishable key for frontend
// @access  Public
router.get('/config', (req, res) => {
    res.json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        currency: 'usd',
        allowedCountries: ['US', 'CA', 'GB', 'AU']
    });
});

// @route   GET /api/payments/test
// @desc    Test endpoint
// @access  Public
router.get('/test', (req, res) => {
    res.json({
        message: 'Payments API is working',
        status: 'active',
        timestamp: new Date().toISOString(),
        features: [
            'Stripe PaymentIntents',
            'Webhook handling',
            'Guest checkout support',
            'Multi-currency'
        ]
    });
});

// @route   GET /api/payments/success/:paymentIntentId
// @desc    Get payment success details
// @access  Private or via session
router.get('/success/:paymentIntentId', async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
            req.params.paymentIntentId
        );

        res.json({
            success: true,
            paymentIntent: {
                id: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                status: paymentIntent.status,
                created: new Date(paymentIntent.created * 1000),
                metadata: paymentIntent.metadata
            }
        });
    } catch (error) {
        res.status(400).json({
            error: 'Invalid payment intent ID'
        });
    }
});

// @route   POST /api/payments/refund
// @desc    Create a refund
// @access  Private (Admin only)
router.post('/refund', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.userRole !== 'admin') {
            return res.status(403).json({
                error: 'Admin access required'
            });
        }

        const { paymentIntentId, amount, reason = 'requested_by_customer' } = req.body;

        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? Math.round(amount) : undefined,
            reason
        });

        res.json({
            success: true,
            refund: {
                id: refund.id,
                amount: refund.amount,
                currency: refund.currency,
                status: refund.status,
                reason: refund.reason
            }
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

module.exports = router;