import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo ? `Bearer ${userInfo.token}` : '';
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/users/login`, credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users/register`, userData);
  return response.data;
};

export const getAllPosts = async () => {
  const response = await axios.get(`${API_URL}/posts`);
  return response.data;
};

export const likeUnlikePost = async (postId) => {
  const response = await axios.put(
    `${API_URL}/posts/${postId}/like`,
    {},
    {
      headers: {
        Authorization: getAuthToken(),
      },
    }
  );
  return response.data;
};

export const getCommentsForPost = async (postId) => {
  const response = await axios.get(`${API_URL}/posts/${postId}/comments`);
  return response.data;
};

export const createComment = async (postId, text) => {
  const response = await axios.post(
    `${API_URL}/posts/${postId}/comments`,
    { text },
    {
      headers: {
        Authorization: getAuthToken(),
      },
    }
  );
  return response.data;
};

export const createPost = async (postData) => {
  const response = await axios.post(
    `${API_URL}/posts`,
    postData,
    {
      headers: {
        Authorization: getAuthToken(),
      },
    }
  );
  return response.data;
};

export const getUserProfile = async (username) => {
  const response = await axios.get(`${API_URL}/users/profile/${username}`);
  return response.data;
};

export const followUnfollowUser = async (userId) => {
  const response = await axios.post(
    `${API_URL}/users/${userId}/follow`,
    {},
    {
      headers: {
        Authorization: getAuthToken(),
      },
    }
  );
  return response.data;
};

// This function is updated to handle FormData for file uploads
export const updateUserProfile = async (formData) => {
  const response = await axios.put(
    `${API_URL}/users/profile`,
    formData, // Send formData instead of JSON
    {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
        Authorization: getAuthToken(),
      },
    }
  );
  return response.data;
};
// Get all conversations for the logged-in user
export const getConversations = async () => {
  const response = await axios.get(`${API_URL}/messages`, {
    headers: { Authorization: getAuthToken() },
  });
  return response.data;
};

// Get messages for a specific conversation
export const getMessages = async (userId) => {
  const response = await axios.get(`${API_URL}/messages/${userId}`, {
    headers: { Authorization: getAuthToken() },
  });
  return response.data;
};

// Send a new message
export const sendMessage = async (receiverId, message) => {
  const response = await axios.post(
    `${API_URL}/messages/send/${receiverId}`,
    { message },
    {
      headers: { Authorization: getAuthToken() },
    }
  );
  return response.data;
};
