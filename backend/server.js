// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for larger images

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// Proxy endpoint for Gemini API (text generation)
app.post('/api/gemini', async (req, res) => {
  try {
    const { model, body } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Original Gemini text model handling
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      body
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('API error:', error.response?.data || error.message);
    if (error.response?.data?.error?.message) {
      console.error('Detailed error message:', error.response.data.error.message);
    }
    res.status(500).json({
      error: 'API call failed',
      details: error.response?.data || error.message
    });
  }
});

// Modified endpoint for Imagen using same format as Gemini
app.post('/api/imagen', async (req, res) => {
  try {
    // Extract the model and construct the request body
    const { model, instances, parameters } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${apiKey}`,
      { instances, parameters }  // Create the proper request body structure
    );
    
    res.json(response.data);
    
  } catch (error) {
    console.error('Imagen API error:', error.response?.data || error.message);
    if (error.response?.data?.error?.message) {
      console.error('Detailed error message:', error.response.data.error.message);
    }
    res.status(500).json({
      error: 'Imagen API call failed',
      details: error.response?.data || error.message
    });
  }
});

// Proxy endpoint for Stable Horde
app.post('/api/horde', async (req, res) => {
  try {
    const { endpoint, body, method = 'POST' } = req.body;
    const apiKey = process.env.STABLE_HORDE_API_KEY;
    
    const response = await axios({
      method,
      url: `https://stablehorde.net/api/${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      data: body
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Stable Horde API error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'API call failed',
      details: error.response?.data || error.message
    });
  }
});

// Add a catch-all route to serve index.html for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});