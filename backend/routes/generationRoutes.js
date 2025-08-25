import express from 'express';
const router = express.Router();
import { generateImage } from '../controllers/generationController.js';
import { protect } from '../middleware/authMiddleware.js';

// @desc    Generate an image from a prompt
// @route   POST /api/generate
// @access  Private
router.post('/', protect, generateImage);

export default router;