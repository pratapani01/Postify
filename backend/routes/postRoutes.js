import express from 'express';
const router = express.Router();
import {
  createPost,
  getAllPosts,
  deletePost,
  updatePost,
  likeUnlikePost,
  createComment,
  getCommentsForPost,
} from '../controllers/postController.js'; // <-- Only import from postController
import { protect } from '../middleware/authMiddleware.js';

// Post routes
router.post('/', protect, createPost);
router.get('/', getAllPosts);
router.delete('/:id', protect, deletePost);
router.put('/:id', protect, updatePost);

// Like route
router.put('/:id/like', protect, likeUnlikePost);

// Comment routes
router.post('/:id/comments', protect, createComment);
router.get('/:id/comments', getCommentsForPost);

export default router;