// Load environment variables
require('dotenv').config();

// Core dependencies
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');

// App configuration
const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Custom imports
const router = require('./src/routes');


// CORS Configuration

const corsOptions = {
  origin: function (origin, callback) {
   
    if (!origin) return callback(null, true);

    // Regex patterns
    const localhostRegex = /^https?:\/\/([a-z0-9-]+\.)*localhost(:\d{1,5})?$/;
    const vercelRegex = /^https:\/\/([a-z0-9-]+\.)*multipleshopmanagement(-[\w-]+)?\.vercel\.app$/;
    const vercelPreviewRegex = /^https:\/\/([a-z0-9-]+\.)*vercel\.app$/;
    const productionRegex = /^https:\/\/(www\.)?multipleshopmanagement\.(com|app|dev)$/;
    const netlifyRegex = /^https:\/\/([a-z0-9-]+\.)*multipleshopmanagement(-[\w-]+)?\.netlify\.app$/;


    
    if (
     
      origin === 'http://localhost:5173' ||
      origin === 'http://localhost:5174' || 
      localhostRegex.test(origin) ||
      vercelRegex.test(origin) ||
      vercelPreviewRegex.test(origin) ||
      productionRegex.test(origin) ||
      netlifyRegex.test(origin)
    ) {
      return callback(null, true);
    }

    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};



// Middleware

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Welcome to the Shop Auth Api!');
});

// Routes
app.use('/api/v1', router);


// Global Error Handler

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);

  if (!res.headersSent) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  }
});


// Start Server after DB Connect

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    app.listen(port, () => {
      console.log(`🚀 Server is running on port: ${port}`);
    });

  } catch (error) {
    console.error('❌ Failed to connect to the database:', error.message);
    process.exit(1);
  }
};

startServer();
