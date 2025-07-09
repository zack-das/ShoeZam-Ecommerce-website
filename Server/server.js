const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

const PORT = 5500;

const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient();


// Enable CORS
app.use(cors());

app.post("/signup", async(req, res) =>{
    const {username, email, password} = req.body;
    

    try{
        const user = await prisma.user.create({
            data:{
                username,
                email,
                password
            }
        })
        res.status(201).json({message: "User created successfuly", user})
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
});

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})


// User Login
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

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Compare passwords
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Successful login
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});