import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile, followUnfollowUser } from '../services/apiService';
import PostCard from '../components/PostCard';
import EditProfileModal from '../components/EditProfileModal';
import Toast from '../components/Toast';
import { IoMailOutline } from 'react-icons/io5';

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setCurrentUser(userInfo);

    if (username === 'me') {
      if (userInfo) {
        navigate(`/profile/${userInfo.username}`, { replace: true });
      } else {
        navigate('/login');
      }
      return;
    }
    
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      setProfile(null);
      setIsFollowing(false);
      try {
        const data = await getUserProfile(username); 
        setProfile(data);
        if (userInfo && data.user.followers.includes(userInfo._id)) {
          setIsFollowing(true);
        }
      } catch (err) {
        setError('Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username, navigate]);

  const handleFollow = async () => {
    if (!currentUser) {
      alert('You need to be logged in to follow users.');
      return;
    }
    try {
      await followUnfollowUser(profile.user._id);
      setIsFollowing(!isFollowing);
      setProfile(prevProfile => ({
        ...prevProfile,
        user: {
          ...prevProfile.user,
          followers: isFollowing
            ? prevProfile.user.followers.filter(id => id !== currentUser._id)
            : [...prevProfile.user.followers, currentUser._id],
        },
      }));
    } catch (error) {
      console.error('Failed to follow/unfollow user:', error);
    }
  };

  const handleUpdatePost = (updatedPost) => {
    if (profile && profile.posts) {
      setProfile(prevProfile => ({
        ...prevProfile,
        posts: prevProfile.posts.map(p => p._id === updatedPost._id ? { ...updatedPost, author: p.author } : p)
      }));
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      user: {
        ...prevProfile.user,
        bio: updatedProfile.bio,
        profilePicture: updatedProfile.profilePicture,
      }
    }));
    if (currentUser && currentUser._id === updatedProfile._id) {
        const updatedUserInfo = { ...currentUser, bio: updatedProfile.bio, profilePicture: updatedProfile.profilePicture };
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        setCurrentUser(updatedUserInfo);
    }
    setToastMessage('Profile updated successfully!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  // This function now navigates directly to the chat page
  const handleStartConversation = () => {
    if (!currentUser) {
      alert('You need to be logged in to send a message.');
      return;
    }
    // Navigate to the chat page with the other user's ID
    navigate(`/messages/${profile.user._id}`);
  };

  if (loading) {
    return <div className="text-center p-10 text-gray-400">Loading profile...</div>;
  }

  if (error || !profile) {
    return <div className="text-center p-10 text-red-500">{error || 'Profile not found.'}</div>;
  }

  const isOwnProfile = currentUser && currentUser._id === profile.user._id;

  return (
    <div>
      <Toast message={toastMessage} />
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={profile.user}
        onProfileUpdate={handleProfileUpdate}
      />
      {/* Profile Header */}
      <div className="p-4 border-b border-gray-700 relative">
        <div className="flex justify-between items-start">
            <div>
                <div className="w-24 h-24 rounded-full bg-gray-600 mb-4">
                    {profile.user.profilePicture && <img src={profile.user.profilePicture} alt={profile.user.username} className="w-full h-full rounded-full object-cover" />}
                </div>
                <h1 className="text-2xl font-bold text-white">{profile.user.username}</h1>
                <p className="text-gray-400">{profile.user.bio}</p>
                <div className="flex gap-x-4 mt-4 text-gray-400">
                  <span><span className="font-bold text-white">{profile.user.following.length}</span> Following</span>
                  <span><span className="font-bold text-white">{profile.user.followers.length}</span> Followers</span>
                </div>
            </div>
            
            <div className="flex items-center gap-x-2">
                {!isOwnProfile && (
                    <>
                        <button onClick={handleStartConversation} className="p-2 rounded-full bg-gray-700 text-white">
                            <IoMailOutline size={20} />
                        </button>
                        <button
                            onClick={handleFollow}
                            className={`px-4 py-2 rounded-full font-semibold ${
                            isFollowing ? 'bg-gray-700 text-white' : 'bg-white text-black'
                            }`}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    </>
                )}
                {isOwnProfile && (
                <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-4 py-2 rounded-full font-semibold bg-gray-700 text-white"
                >
                    Edit Profile
                </button>
                )}
            </div>
        </div>
      </div>

      {/* User's Posts */}
      <div className="space-y-4 p-4">
        {profile.posts.length > 0 ? (
          profile.posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={currentUser}
              onPostUpdate={handleUpdatePost}
            />
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
