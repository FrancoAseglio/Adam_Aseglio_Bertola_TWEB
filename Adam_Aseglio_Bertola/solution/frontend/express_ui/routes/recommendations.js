const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

/**
 * GET /recommendations/:malId
 * Render recommendations page for a specific anime
 */
router.get('/:malId', async (req, res) => {
  try {
    const malId = req.params.malId;
    const page  = parseInt(req.query.page) || 1;
    const itemsPerPage = 20;

    // anime details from PostgreSQL
    const animeResponse = await axios.get(`${GATEWAY_URL}/anime/${malId}`);
    const anime = animeResponse.data;

    // recommendations from MongoDB
    const recommendationsResponse = await axios.get(`${GATEWAY_URL}/recommendations/${malId}`);
    const allRecommendations = recommendationsResponse.data;

    const totalItems = allRecommendations.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex   = startIndex + itemsPerPage;
    const paginatedRecommendations = allRecommendations.slice(startIndex, endIndex);

    res.render('recommendations', {
      layout         : false,
      title          : `Recommendations for ${anime.title}`,
      anime          : anime,
      recommendations: paginatedRecommendations,
      baseUrl        : `/recommendations/${malId}`,
      urlSeparator   : '?',
      pagination: {
        currentPage : page,
        totalPages  : totalPages,
        totalItems  : totalItems,
        itemsPerPage: itemsPerPage,
        hasNextPage : page < totalPages,
        hasPrevPage : page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error.message);
    res.status(500).render('error', {
      message: 'Error fetching recommendations',
      error  : { 
        status: 500, 
        stack : error.message 
      }
    });
  }
});

module.exports = router;
