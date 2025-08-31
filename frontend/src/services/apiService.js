import axios from 'axios';

// This will use the Vercel URL in production and the local URL in development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// This is a special function (interceptor) that automatically adds the login token
// to every request that is sent to the backend.
api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

// === Auth Functions ===
export const loginUser = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

// === Post Functions ===
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

// === Comment Functions ===
export const getCommentsForPost = async (postId) => {
  const response = await api.get(`/posts/${postId}/comments`);
  return response.data;
};

export const createComment = async (postId, text) => {
  const response = await api.post(`/posts/${postId}/comments`, { text });
  return response.data;
};

// === User/Profile Functions ===
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
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// === Messaging Functions ===
export const getConversations = async () => {
  const response = await api.get('/messages/conversations');
  return response.data;
};

export const getMessages = async (otherUserId) => {
  const response = await api.get(`/messages/${otherUserId}`);
  return response.data;
};

export const sendMessage = async (receiverId, text) => {
  const response = await api.post('/messages', { receiverId, text });
  return response.data;
};

// === AI Generation ===
export const generateImage = async (prompt) => {
    const response = await api.post('/generate', { prompt }, { responseType: 'blob' });
    return response.data;
};
