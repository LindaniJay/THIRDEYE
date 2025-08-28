import express from 'express';
import { body } from 'express-validator';
import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logoutUser
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  registerUser
);

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
  ],
  loginUser
);

router.post(
  '/forgotpassword',
  [
    body('email', 'Please include a valid email').isEmail()
  ],
  forgotPassword
);

router.put(
  '/resetpassword/:resettoken',
  [
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  resetPassword
);

// Protected routes
router.use(protect);

router.get('/me', getMe);
router.put('/updatedetails', updateDetails);
router.put('/updatepassword', updatePassword);
router.get('/logout', logoutUser);

export default router;
