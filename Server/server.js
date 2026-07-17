require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// const PORT = 5000;  // Changed from 5500 to 5000 to match frontend

const PORT = process.env.PORT || 5000;

//Health check
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "ok", 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});


// Signup Route
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword  // Store hashed password
            }
        });

        // Don't send password back to client
        const { password: _, ...userWithoutPassword } = user;
        
        res.status(201).json({ 
            message: "User created successfully", 
            user: userWithoutPassword 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Check if user exists
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Login successful
        res.json({ 
            success: true, 
            message: "Login successful" 
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
});

// Start server only once
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const axios = require('axios');
const crypto = require('crypto');

// M-Pesa Configuration (Add to your .env file)
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || '174379';
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || 'https://your-domain.com/api/mpesa/callback';

// Get M-Pesa Access Token
async function getMpesaAccessToken() {
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    
    try {
        const response = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${auth}`
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting M-Pesa token:', error.response?.data || error.message);
        throw error;
    }
}

// STK Push Endpoint
app.post('/api/mpesa/stkpush', async (req, res) => {
    const { phone, amount } = req.body;
    
    if (!phone || !amount) {
        return res.status(400).json({ error: 'Phone number and amount are required' });
    }
    
    try {
        const accessToken = await getMpesaAccessToken();
        
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
        const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
        
        const payload = {
            BusinessShortCode: MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.round(amount),
            PartyA: phone,
            PartyB: MPESA_SHORTCODE,
            PhoneNumber: phone,
            CallBackURL: MPESA_CALLBACK_URL,
            AccountReference: `ORDER${Date.now()}`,
            TransactionDesc: 'ShoeZam Payment'
        };
        
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        
        console.log('STK Push Response:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('STK Push Error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Payment initiation failed',
            details: error.response?.data || error.message 
        });
    }
});

// M-Pesa Callback Endpoint
app.post('/api/mpesa/callback', async (req, res) => {
    console.log('M-Pesa Callback Received:', JSON.stringify(req.body, null, 2));
    
    const callbackData = req.body.Body?.stkCallback;
    
    if (callbackData) {
        const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = callbackData;
        
        if (ResultCode === '0') {
            // Payment successful
            const items = CallbackMetadata?.Item || [];
            const transactionData = {};
            items.forEach(item => {
                transactionData[item.Name] = item.Value;
            });
            
            console.log('Payment Successful:', {
                CheckoutRequestID,
                Amount: transactionData.Amount,
                MpesaReceiptNumber: transactionData.MpesaReceiptNumber,
                PhoneNumber: transactionData.PhoneNumber
            });
            
            // TODO: Update order status in your database
            // await updateOrderPaymentStatus(CheckoutRequestID, 'completed', transactionData);
        } else {
            console.log('Payment Failed:', { ResultCode, ResultDesc });
            // TODO: Update order status as failed
        }
    }
    
    res.json({ ResultCode: '0', ResultDesc: 'Success' });
});

// Payment Status Check Endpoint
app.post('/api/mpesa/status', async (req, res) => {
    const { checkoutRequestID } = req.body;
    
    if (!checkoutRequestID) {
        return res.status(400).json({ error: 'CheckoutRequestID is required' });
    }
    
    try {
        const accessToken = await getMpesaAccessToken();
        
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
        const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
        
        const payload = {
            BusinessShortCode: MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: checkoutRequestID
        };
        
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        
        res.json(response.data);
    } catch (error) {
        console.error('Status Query Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Status check failed' });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});
