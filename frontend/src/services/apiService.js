import axios from 'axios';

// This creates a central configuration for all our API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// This is an "interceptor" - a guard that automatically adds the login token to every request.
// This is a professional way to handle authentication.
api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

// --- Auth ---
export const loginUser = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

// --- Posts ---
export const getAllPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/posts', postData);
  return response.data;
};

export const likeUnlikePost = async (postId) => {
  const response = await api.put(`/posts/${postId}/like`);
  return response.data;
};

// --- Comments ---
export const getCommentsForPost = async (postId) => {
  const response = await api.get(`/posts/${postId}/comments`);
  return response.data;
};

export const createComment = async (postId, text) => {
  const response = await api.post(`/posts/${postId}/comments`, { text });
  return response.data;
};

// --- Users & Profiles ---
export const getUserProfile = async (username) => {
  const response = await api.get(`/users/profile/${username}`);
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const followUnfollowUser = async (userId) => {
  const response = await api.post(`/users/${userId}/follow`);
  return response.data;
};

export const updateUserProfile = async (formData) => {
  const response = await api.put('/users/profile', formData, {
    headers: { 'Content-Type': 'multipart/-data' },
  });
  return response.data;
};

// --- Messaging ---
export const getConversations = async () => {
  // THE FIX IS HERE: The correct URL is just '/messages', not '/messages/conversations'
  const response = await api.get('/messages');
  return response.data;
};

export const getMessages = async (userId) => {
  const response = await api.get(`/messages/${userId}`);
  return response.data;
};

export const sendMessage = async (receiverId, message) => {
  const response = await api.post(`/messages/send/${receiverId}`, { message });
  return response.data;
};

// --- AI Generation ---
export const generateImage = async (prompt) => {
  const response = await api.post(
    '/generate',
    { prompt },
    { responseType: 'blob' }
  );
  return response.data;
};

