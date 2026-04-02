// Server/lib/prisma.js
// import { PrismaClient } from '@prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';
require('dotenv').config(); 
// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL,
// });

// const prisma = new PrismaClient({ adapter });

// export default prisma;

// Server/lib/prisma.js
const { PrismaNeon } = require('@prisma/adapter-neon');
const { PrismaClient } = require('@prisma/client');
const { neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not defined in .env file');
    process.exit(1);
}


// Create the adapter with your database connection
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

// Create the Prisma Client instance with the adapter
const prisma = new PrismaClient({ adapter });

// Test the connection
async function testConnection() {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
}

testConnection();


// Export the configured instance
module.exports = prisma;