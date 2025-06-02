const express = require('express');
const router = express.Router();
const { signup, signin, logout, verifyToken } = require('../controllers/AuthController');
const { getShopBySubdomain, getUserShops } = require('../controllers/shopController');
const { signupValidation, signinValidation } = require('../middleware/validation');
const authMiddleware = require('../middleware/authMiddleware');

//  Auth
router.post('/signup', signupValidation, signup);
router.post('/signin', signinValidation, signin);
router.post('/logout', logout);
router.get('/verify', authMiddleware, verifyToken);



// Shops
router.get('/my', authMiddleware, getUserShops);
router.get('/shop/:shopName', getShopBySubdomain);

module.exports = router;
