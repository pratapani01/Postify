import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile, // Make sure this is imported
  followUnfollowUser,
  getUserById,
  getUserByUsername,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/profile/:username', getUserByUsername);

// THIS IS THE UPDATED ROUTE
router.put('/profile', protect, upload.single('profilePicture'), updateUserProfile);

router.post('/:id/follow', protect, followUnfollowUser);
router.get('/:id', getUserById);

export default router;