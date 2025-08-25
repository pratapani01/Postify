import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllPosts } from '../services/apiService';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the route is '/create' to open the modal
    if (location.pathname === '/create') {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [location]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setCurrentUser(userInfo);

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
    // Add the author info manually to display it immediately
    const postWithAuthor = { ...newPost, author: { username: currentUser.username } };
    setPosts([postWithAuthor, ...posts]);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/'); // Go back to the homepage when closing the modal
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
