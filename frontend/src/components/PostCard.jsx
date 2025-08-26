import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { likeUnlikePost, getCommentsForPost, createComment } from '../services/apiService';
import { FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Comment = ({ comment }) => {
  const { currentUser } = useAuth();
  const commentAuthorPic = (currentUser && comment.author._id === currentUser._id)
    ? currentUser.profilePicture
    : comment.author.profilePicture;

  return (
    <div className="flex items-start gap-x-3 mt-4">
      <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0">
        {commentAuthorPic && <img src={commentAuthorPic} alt={comment.author.username} className="w-full h-full rounded-full object-cover" />}
      </div>
      <div className="flex-1">
        <p className="font-bold text-sm text-white">{comment.author.username}</p>
        <p className="text-gray-300">{comment.text}</p>
      </div>
    </div>
  );
};

const PostCard = ({ post, onPostUpdate }) => {
  const { currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0); // 1. Comment count ke liye naya state
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (currentUser && post.likes.includes(currentUser._id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [currentUser, post.likes]);

  const handleLike = async () => {
    if (!currentUser) {
      alert('You must be logged in to like a post.');
      return;
    }
    try {
      const updatedPost = await likeUnlikePost(post._id);
      onPostUpdate(updatedPost);
      setLikeCount(updatedPost.likes.length);
      setIsLiked(updatedPost.likes.includes(currentUser._id));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleToggleComments = async () => {
    const newShowComments = !showComments;
    setShowComments(newShowComments);
    if (newShowComments && comments.length === 0) {
      try {
        const fetchedComments = await getCommentsForPost(post._id);
        setComments(fetchedComments);
        setCommentCount(fetchedComments.length); // 2. Fetch karne par count set karein
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    try {
      const createdComment = await createComment(post._id, newComment);
      const commentWithAuthor = { ...createdComment, author: { username: currentUser.username, profilePicture: currentUser.profilePicture } };
      setComments([commentWithAuthor, ...comments]);
      setCommentCount(prevCount => prevCount + 1); // 3. Naya comment add hone par count badhayein
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment', error);
    }
  };
  
  const authorProfilePic = (currentUser && post.author._id === currentUser._id)
    ? currentUser.profilePicture
    : post.author.profilePicture;


  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg m-4">
      <Link to={`/profile/${post.author.username}`} className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-600 mr-3 flex-shrink-0">
           {authorProfilePic && <img src={authorProfilePic} alt={post.author.username} className="w-full h-full rounded-full object-cover" />}
        </div>
        <div>
          <p className="font-bold text-white hover:underline">{post.author.username}</p>
          <p className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </Link>
      <p className="text-gray-300 whitespace-pre-wrap mb-4">{post.content}</p>

      <div className="flex items-center gap-x-4 text-gray-400 border-t border-gray-700 pt-2">
        <div className="flex items-center gap-x-2">
          <button onClick={handleLike}>
            {isLiked ? (
              <FaHeart className="text-red-500" size={20} />
            ) : (
              <FaRegHeart className="hover:text-red-500" size={20} />
            )}
          </button>
          <span>{likeCount}</span>
        </div>
        <button onClick={handleToggleComments} className="flex items-center gap-x-2">
          <FaRegComment className="hover:text-blue-400" size={20} />
          {/* 4. Naye state ko yahan display karein */}
          <span>{commentCount > 0 ? commentCount : ''}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <form onSubmit={handleCommentSubmit} className="flex gap-x-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700">
              Post
            </button>
          </form>
          {comments.map(comment => <Comment key={comment._id} comment={comment} />)}
        </div>
      )}
    </div>
  );
};

export default PostCard;
