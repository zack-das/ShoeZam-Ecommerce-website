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

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});