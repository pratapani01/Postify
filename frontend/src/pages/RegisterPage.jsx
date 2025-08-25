import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/apiService';

const animatedTexts = ['Connect.', 'Share.', 'Create.'];

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // State for the typing animation
  const [textIndex, setTextIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  // Typing animation effect
  useEffect(() => {
    if (subIndex === animatedTexts[textIndex].length + 1 && !isDeleting) {
      setTimeout(() => setIsDeleting(true), 1000);
    } else if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
      setDisplayedText(animatedTexts[textIndex].substring(0, subIndex));
    }, isDeleting ? 100 : 150);
    return () => clearTimeout(timeout);
  }, [subIndex, textIndex, isDeleting]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userData = await registerUser({ username, email, password });
      localStorage.setItem('userInfo', JSON.stringify(userData));
      navigate('/'); // Navigate to homepage on successful registration
    } catch (error) {
      console.error('Failed to register:', error);
      alert('Registration failed. The email or username may already be taken.');
    }
  };

  return (
    <div className="min-h-screen md:grid md:grid-cols-2">
      {/* Left Side: Registration Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an Account</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join Postify today.
          </p>
          <form onSubmit={handleRegister} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 mt-1 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 mt-1 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 mt-1 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-8 text-sm text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Log In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: Animated Welcome Message (Same as Login) */}
      <div className="hidden md:flex flex-col items-center justify-center p-12 relative">
        <div className="text-center">
            <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white">
              Welcome to <span className="text-blue-600 dark:text-blue-400">Postify</span>
            </h2>
            <div className="mt-4 h-16 text-3xl font-semibold text-gray-700 dark:text-gray-300">
              <span>{displayedText}</span>
              <span className="animate-ping">|</span>
            </div>
        </div>
        <div className="absolute bottom-8 text-center text-gray-500 dark:text-gray-400">
            <p>Developed with ❤️ in India</p>
            <p>
              by{' '}
              <a
                href="https://www.linkedin.com/in/pratapani01/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-500 dark:hover:text-blue-400"
              >
                Animesh
              </a>
            </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;