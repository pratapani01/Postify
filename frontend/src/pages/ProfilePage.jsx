import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, followUnfollowUser, sendMessage } from '../services/apiService';
import PostCard from '../components/PostCard';
import EditProfileModal from '../components/EditProfileModal';
import Toast from '../components/Toast';

const ProfilePage = () => {
  const { username } = useParams();
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    if (username === 'me' && currentUser) {
      navigate(`/profile/${currentUser.username}`, { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserProfile(username);
        setProfile(data);
        if (currentUser && data.user.followers.includes(currentUser._id)) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }
      } catch (err) {
        setError('Failed to fetch profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username, currentUser, navigate]);

  const handleFollow = async () => {
    if (!currentUser) return alert('You must be logged in.');
    try {
      await followUnfollowUser(profile.user._id);
      setIsFollowing(!isFollowing);
      // Optimistically update follower count
      const newFollowerCount = isFollowing ? profile.user.followers.length - 1 : profile.user.followers.length + 1;
      setProfile(prev => ({
        ...prev,
        user: { ...prev.user, followers: isFollowing ? prev.user.followers.filter(id => id !== currentUser._id) : [...prev.user.followers, currentUser._id] }
      }));
    } catch (error) {
      console.error('Failed to follow/unfollow user:', error);
    }
  };
  
  const handleStartConversation = async () => {
    if (!currentUser) return alert('You must be logged in.');
    navigate(`/messages/${profile.user._id}`);
  };

  const handleUpdatePost = (updatedPost) => {
    if (profile && profile.posts) {
      setProfile(prevProfile => ({
        ...prevProfile,
        posts: prevProfile.posts.map(p => p._id === updatedPost._id ? { ...updatedPost, author: p.author } : p)
      }));
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    setProfile(prev => ({ ...prev, user: { ...prev.user, ...updatedUser } }));
    updateUser(updatedUser); // Update global context
    setToast({ show: true, message: 'Profile updated successfully!' });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  if (loading) return <div className="p-4 text-center text-gray-400">Loading profile...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!profile) return null;

  const isOwnProfile = currentUser && currentUser._id === profile.user._id;

  return (
    // THE FIX IS HERE: Add padding to the bottom
    <div className="pb-20"> 
      {toast.show && <Toast message={toast.message} />}
      {isEditModalOpen && <EditProfileModal onClose={() => setIsEditModalOpen(false)} onProfileUpdate={handleProfileUpdate} />}

      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-start">
          <div className="w-24 h-24 rounded-full bg-gray-600 mb-4 flex-shrink-0">
            {profile.user.profilePicture && (
              <img src={profile.user.profilePicture} alt={profile.user.username} className="w-full h-full object-cover rounded-full" />
            )}
          </div>
          {isOwnProfile ? (
            <button onClick={() => setIsEditModalOpen(true)} className="px-4 py-2 bg-gray-700 rounded-full font-semibold">Edit Profile</button>
          ) : (
            <div className="flex gap-x-2">
              <button onClick={handleStartConversation} className="px-4 py-2 bg-gray-700 rounded-full font-semibold">Message</button>
              <button onClick={handleFollow} className={`px-4 py-2 rounded-full font-semibold ${isFollowing ? 'bg-white text-black' : 'bg-blue-500 text-white'}`}>
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-white">{profile.user.username}</h1>
        <p className="text-gray-400 mt-1">{profile.user.bio}</p>
        <div className="flex gap-x-6 mt-4 text-gray-400">
          <span><span className="font-bold text-white">{profile.user.following.length}</span> Following</span>
          <span><span className="font-bold text-white">{profile.user.followers.length}</span> Followers</span>
        </div>
      </div>

      <div className="space-y-4">
        {profile.posts.length > 0 ? (
          profile.posts.map((post) => (
            <PostCard key={post._id} post={post} onPostUpdate={handleUpdatePost} />
          ))
        ) : (
          <div className="text-center p-10 text-gray-400">
            <p>This user hasn't posted anything yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
