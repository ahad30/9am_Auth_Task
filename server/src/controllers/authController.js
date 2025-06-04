const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Generate JWT token
const generateToken = (userId, rememberMe = false) => {
  const expiresIn = rememberMe ? process.env.JWT_REMEMBER_EXPIRES_IN : process.env.JWT_EXPIRES_IN;
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
};

// Set cookie with token
const setTokenCookie = (res, token, rememberMe = false) => {
  const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000;
  
res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'None',
  path: '/',
  maxAge: maxAge,
   domain: process.env.NODE_ENV === 'production'
        ? '.shop-management-server-five.vercel.app'
        : '.localhost',
});

};

const signup = async (req, res) => {
  try {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, password, shopNames } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Check if any shop names already exist
    const existingShops = await prisma.shop.findMany({
      where: {
        name: { in: shopNames }
      }
    });

    if (existingShops.length > 0) {
      const takenNames = existingShops.map(shop => shop.name);
      return res.status(400).json({
        success: false,
        message: `Shop names already taken: ${takenNames.join(', ')}`
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user and shops in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword
        }
      });

      // Create shops
      const shops = await Promise.all(
        shopNames.map(name =>
          prisma.shop.create({
            data: {
              name: name.toLowerCase().trim(),
              userId: user.id
            }
          })
        )
      );

      return { user, shops };
    });


    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: result.user.id,
        username: result.user.username,
        shops: result.shops.map(shop => ({ id: shop.id, name: shop.name }))
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const signin = async (req, res) => {
  try {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, password, rememberMe } = req.body;

    // Find user with shops
    const user = await prisma.user.findUnique({
      where: { username },
      include: { shops: true }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Generate token
    const token = generateToken(user.id, rememberMe);
    setTokenCookie(res, token, rememberMe);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        shops: user.shops.map(shop => ({ id: shop.id, name: shop.name })),
        token
      }
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      domain: process.env.NODE_ENV === 'production'
        ? '.shop-management-server-five.vercel.app'
        : '.localhost',
      path: '/'
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { shops: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        shops: user.shops.map(shop => ({ id: shop.id, name: shop.name }))
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  signup,
  signin,
  logout,
  verifyToken
};