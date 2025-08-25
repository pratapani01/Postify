import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId, // This will be the ID of the user who creates the post
      required: true,
      ref: 'User', // This creates a relationship with the User model
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280, // Similar to Twitter's character limit
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // We will add comments later
    // comments: [{...}]
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;