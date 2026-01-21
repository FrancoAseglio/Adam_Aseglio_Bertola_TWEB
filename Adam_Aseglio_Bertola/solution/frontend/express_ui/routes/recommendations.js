const express = require('express');
const router = express.Router();
const axios = require('axios');

// Gateway URL
const GATEWAY_URL = 'http://localhost:3001/api';

// Route to get recommendations for a specific anime
router.get('/:malId', async (req, res) => {
  try {
    const malId = req.params.malId;

    // Fetch recommendations from MongoDB
    const recommendationsResponse = await axios.get(`${GATEWAY_URL}/recommendations/${malId}`);
    const recommendations = recommendationsResponse.data;

    res.render('recommendations', {
      layout: false,
      title: `Recommendations for Anime ID ${malId}`,
      recommendations: recommendations
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error.message);
    res.status(500).render('error', {
      message: 'Error fetching recommendations',
      error: { status: 500, stack: error.message }
    });
  }
});

module.exports = router;
