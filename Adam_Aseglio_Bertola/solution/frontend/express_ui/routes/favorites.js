const express = require('express');
const router = express.Router();
const axios = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

router.get('/:username', async (req, res) => {
  try {
    const favoritesResponse = await axios.get(`${GATEWAY_URL}/favorites/${req.params.username}`);
    
    res.render('favorites', {
      layout: false,
      title: `Favorites for ${req.params.username}`,
      username: req.params.username,
      favorites: favoritesResponse.data
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Error fetching favorites',
      error: { status: 500, stack: error.message }
    });
  }
});

module.exports = router;
