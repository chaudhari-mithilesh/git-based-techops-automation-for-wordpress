const express = require('express');
const router = express.Router();
const axios = require('axios');

// WordPress API base URL
const wpApiUrl = `${process.env.WORDPRESS_URL}/wp-json/wp/v2`;

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const response = await axios.get(`${wpApiUrl}/posts`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch posts',
      message: error.message
    });
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const response = await axios.get(`${wpApiUrl}/products`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// Get site information
router.get('/info', async (req, res) => {
  try {
    const response = await axios.get(`${wpApiUrl}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch site information',
      message: error.message
    });
  }
});

module.exports = router; 