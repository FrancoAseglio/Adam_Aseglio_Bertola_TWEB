const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

/**
 * @swagger
 * /recommendations/{malId}:
 *   get:
 *     tags:
 *       - Recommendations
 *     summary: Get anime recommendations by MAL ID
 *     description: |
 *       Retrieves anime details from PostgreSQL database and recommendations from MongoDB,
 *       then renders them with pagination support. Shows 20 recommendations per page.
 *       
 *       Data Sources:
 *       - Anime details: PostgreSQL via /api/anime/{malId}
 *       - Recommendations: MongoDB via /api/recommendations/{malId}
 *     operationId: getAnimeRecommendations
 *     parameters:
 *       - name: malId
 *         in: path
 *         required: true
 *         description: MyAnimeList ID of the anime to get recommendations for
 *         schema:
 *           type: string
 *           pattern: '^\d+$'
 *         examples:
 *           fullmetal:
 *             value: "5114"
 *             summary: Fullmetal Alchemist Brotherhood
 *           steins:
 *             value: "9253"
 *             summary: Steins Gate
 *           attack:
 *             value: "16498"
 *             summary: Attack on Titan
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination (defaults to 1)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved anime recommendations with pagination
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered HTML page with anime details and paginated recommendations
 *       404:
 *         description: Anime not found in database
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered error page indicating anime was not found
 *       500:
 *         description: Internal server error (gateway connection failure, database error, etc.)
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered error page with error details
 */
router.get('/:malId', async (req, res) => {
  try {
    const malId = req.params.malId;
    const page  = parseInt(req.query.page) || 1;
    const itemsPerPage = 20;

    const animeResponse = await axios.get(`${GATEWAY_URL}/anime/${malId}`);
    const anime = animeResponse.data;

    const recommendationsResponse = await axios.get(`${GATEWAY_URL}/recommendations/${malId}`);
    const allRecommendations = recommendationsResponse.data;

    const totalItems = allRecommendations.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex   = startIndex + itemsPerPage;
    const paginatedRecommendations = allRecommendations.slice(startIndex, endIndex);

    res.render('recommendations', {
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
