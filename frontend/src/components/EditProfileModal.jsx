import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { updateUserProfile } from '../services/apiService';

const EditProfileModal = ({ isOpen, onClose, user, onProfileUpdate }) => {
  const [bio, setBio] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setPreview(user.profilePicture || null);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('bio', bio);
    if (profilePictureFile) {
      formData.append('profilePicture', profilePictureFile);
    }

    try {
      const updatedProfile = await updateUserProfile(formData);
      onProfileUpdate(updatedProfile);
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Could not update profile.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div /* ... modal wrapper ... */ >
          <motion.div /* ... modal content ... */ >
            <h2 className="text-xl font-bold text-white mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-x-4">
                <div className="w-24 h-24 rounded-full bg-gray-600 flex-shrink-0">
                  {preview && <img src={preview} alt="Profile Preview" className="w-full h-full rounded-full object-cover" />}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full h-24 p-3 bg-gray-700 text-white rounded-md"
                ></textarea>
              </div>
              <div className="flex justify-end mt-6">
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full">
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
