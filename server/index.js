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

    // Allow base localhost and subdomains like xxx.localhost:5173
    const allowedBase = ['localhost:5173', 'localhost:5174'];
    const allowedRegex = /^http:\/\/([a-z0-9-]+\.)*localhost:(5173|5174)$/;

    if (allowedBase.some(base => origin.includes(base)) || allowedRegex.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
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
