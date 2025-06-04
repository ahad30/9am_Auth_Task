const express = require('express');
const router = express.Router();
const { signup, signin, logout, verifyToken } = require('../controllers/authController');
const { signupValidation, signinValidation } = require('../middleware/validation');
const authMiddleware = require('../middleware/authMiddleware');

//  Auth
router.post('/signup', signupValidation, signup);
router.post('/signin', signinValidation, signin);
router.post('/logout', logout);
router.get('/verify', authMiddleware, verifyToken);


module.exports = router;
