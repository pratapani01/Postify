import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllPosts } from '../services/apiService';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import { useAuth } from '../context/AuthContext'; // 1. Import the useAuth hook

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth(); // 2. Use the global auth state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/create') {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [location]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (err) {
        setError('Failed to fetch posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleUpdatePost = (updatedPostFromApi) => {
    setPosts(posts.map(p => p._id === updatedPostFromApi._id ? { ...updatedPostFromApi, author: p.author } : p));
  };

  const handlePostCreated = (newPost) => {
    const postWithAuthor = { ...newPost, author: { username: currentUser.username, profilePicture: currentUser.profilePicture } };
    setPosts([postWithAuthor, ...posts]);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  if (loading) {
    return <div className="text-center p-10 text-gray-400">Loading posts...</div>;
  }
  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onPostCreated={handlePostCreated}
      />
      <div className="space-y-4 p-4">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            currentUser={currentUser}
            onPostUpdate={handleUpdatePost}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
