const express = require('express');
const router = express.Router();
const axios = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

router.get('/:username', async (req, res) => {
  try {
    const ratingsResponse = await axios.get(`${GATEWAY_URL}/ratings/${req.params.username}`);
    
    res.render('ratings', {
      layout: false,
      title: `Ratings for ${req.params.username}`,
      username: req.params.username,
      ratings: ratingsResponse.data
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Error fetching ratings',
      error: { status: 500, stack: error.message }
    });
  }
});

module.exports = router;
