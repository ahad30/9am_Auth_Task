const express = require('express');
const router = express.Router();
const { signup, signin, logout, verifyToken } = require('../controllers/authController');
const { getProfile } = require('../controllers/userController');
const { getShopByName, getUserShops } = require('../controllers/shopController');
const { signupValidation, signinValidation } = require('../middleware/validation');
const authMiddleware = require('../middleware/authMiddleware');

//  Auth
router.post('/signup', signupValidation, signup);
router.post('/signin', signinValidation, signin);
router.post('/logout', logout);
router.get('/verify', authMiddleware, verifyToken);



// User Profile
router.get('/profile', authMiddleware, getProfile);




// Shops
router.get('/my', authMiddleware, getUserShops);
router.get('/:shopName', getShopByName);

module.exports = router;
