import React, { useState } from 'react';
import { generateImage } from '../services/apiService';
import { FaDownload, FaSpinner } from 'react-icons/fa';

const ImaginePage = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setLoading(true);
    setImageUrl(null);
    setError('');
    try {
      const imageBlob = await generateImage(prompt);
      const url = URL.createObjectURL(imageBlob);
      setImageUrl(url);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'postify-imagine.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Imagine</h1>
      </div>
      <div className="p-4">
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt to generate an image..."
            className="flex-1 px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </form>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="flex justify-center items-center bg-gray-800 rounded-lg min-h-[512px]">
          {loading && <FaSpinner className="text-white text-4xl animate-spin" />}
          {imageUrl && (
            <div className="relative group">
              <img src={imageUrl} alt="Generated" className="rounded-lg max-w-full h-auto" />
              <button
                onClick={handleDownload}
                className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaDownload />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImaginePage;
