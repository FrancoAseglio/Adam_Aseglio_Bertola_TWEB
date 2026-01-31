const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const BACKEND_MONGO_URL  = 'http://localhost:3002/api';
const BACKEND_SPRING_URL = 'http://localhost:8080/api';

/**
 * @swagger
 * /api/recommendations/{malId}:
 *   get:
 *     summary: Get recommendations for an anime
 *     description: Retrieves all recommended anime for a specific anime with full details (MongoDB backend)
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: malId
 *         required: true
 *         schema:
 *           type: integer
 *         description: MyAnimeList ID of the anime
 *         example: 3269
 *     responses:
 *       200:
 *         description: List of recommendations with details
 *       500:
 *         description: Server error
 */
router.get('/:malId', async (req, res) => {
  try {
    const malId           = req.params.malId;
    const response        = await axios.get(`${BACKEND_MONGO_URL}/recommendations/${malId}`);
    const recommendations = response.data;

    const enrichedRecommendations = await Promise.all(
      recommendations.map(async (rec) => {
        try {
          const detailsResponse = await axios.get(`${BACKEND_SPRING_URL}/anime/${rec.recommendation_mal_id}`);

          return {
            ...rec,
            details: detailsResponse.data
          };
        } catch (error) {

          return {
            ...rec,
            details: null
          };
        }
      })
    );

    res.json(enrichedRecommendations);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching recommendations', 
      error  : error.message 
    });
  }
});

module.exports = router;
