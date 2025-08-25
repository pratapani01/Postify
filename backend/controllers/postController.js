import Post from '../models/postModel.js';
import Comment from '../models/commentModel.js';
// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    const post = await Post.create({
      author: req.user._id, // req.user comes from the 'protect' middleware
      content: content,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('author', 'username profilePicture') // Replace author ID with username and profile picture
      .sort({ createdAt: -1 }); // Show newest posts first

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user attempting to delete the post is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await post.deleteOne();

    res.status(200).json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updatePost = async (req, res) => {
  const { content } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user attempting to update the post is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    post.content = content || post.content;
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the post has already been liked by this user
    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      // If already liked, remove the like
      post.likes.pull(req.user._id);
    } else {
      // If not liked, add the like
      post.likes.push(req.user._id);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createComment = async (req, res) => {
  const { text } = req.body;
  const postId = req.params.id;

  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      text,
      author: req.user._id,
      post: postId,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


const getCommentsForPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// Add the new function to the export at the bottom
export {
  createPost,
  getAllPosts,
  deletePost,
  updatePost,
  likeUnlikePost,
  createComment,
  getCommentsForPost, // <-- ADD THIS
};
