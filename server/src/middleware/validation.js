const { body } = require('express-validator');

const signupValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .withMessage('Password must contain at least one number and one special character'),

  body('shopNames')
    .isArray({ min: 3, max: 10 })
    .withMessage('You must provide between 3 and 10 shop names')
    .custom((shopNames) => {
      // Check if all shop names are unique
      const uniqueNames = new Set(shopNames.map(name => name.toLowerCase().trim()));
      if (uniqueNames.size !== shopNames.length) {
        throw new Error('Shop names must be unique');
      }
      
      // Validate each shop name
      for (const name of shopNames) {
        if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 50) {
          throw new Error('Each shop name must be between 2 and 50 characters');
        }
        
        if (!/^[a-zA-Z0-9\s\-_]+$/.test(name.trim())) {
          throw new Error('Shop names can only contain letters, numbers, spaces, hyphens, and underscores');
        }
      }
      
      return true;
    })
];

const signinValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  body('rememberMe')
    .optional()
    .isBoolean()
    .withMessage('Remember me must be a boolean')
];

module.exports = {
  signupValidation,
  signinValidation
};