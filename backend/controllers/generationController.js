import axios from 'axios';

const HUGGINGFACE_API_URL =
  'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';

const generateImage = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    const response = await axios.post(
      HUGGINGFACE_API_URL,
      { inputs: prompt },
      {
        headers: {
          'Accept': 'image/jpeg', // <-- ADD THIS LINE
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
        responseType: 'arraybuffer',
      }
    );

    res.set('Content-Type', 'image/jpeg');
    res.send(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data.toString() : error);
    if (error.response && error.response.data.toString().includes('is currently loading')) {
      return res.status(503).json({ message: 'Model is currently loading, please try again in a moment.' });
    }
    res.status(500).json({ message: 'Failed to generate image' });
  }
};

export { generateImage };