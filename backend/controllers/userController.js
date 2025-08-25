import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import Post from '../models/postModel.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Register a new user
const registerUser = async (req, res) => {
  // ... (existing registerUser function is here, no changes)
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      const token = generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Authenticate a user & get token
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user by email
    const user = await User.findOne({ email });

    // 2. If user exists, compare submitted password with stored hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
      // 3. If passwords match, generate token and send response
      const token = generateToken(res, user._id);
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token,
      });
    } else {
      // 4. If user not found or passwords don't match, send error
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getUserProfile = async (req, res) => {
  // req.user is available here because our 'protect' middleware created it
  if (req.user) {
    res.status(200).json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};


const followUnfollowUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent user from following themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      // Unfollow user
      currentUser.following.pull(req.params.id);
      userToFollow.followers.pull(req.user._id);
      await currentUser.save();
      await userToFollow.save();
      res.status(200).json({ message: 'User unfollowed' });
    } else {
      // Follow user
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
      await currentUser.save();
      await userToFollow.save();
      res.status(200).json({ message: 'User followed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });

    res.status(200).json({ user, posts });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.bio = req.body.bio || user.bio;

      // Check if a file was uploaded
      if (req.file) {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'postify_profiles',
          width: 150,
          crop: "scale"
        });
        user.profilePicture = result.secure_url;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ author: user._id })
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({ user, posts });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// Update the export at the bottom
export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  followUnfollowUser,
  getUserById,
  getUserByUsername, // <-- Add the new function here
};
