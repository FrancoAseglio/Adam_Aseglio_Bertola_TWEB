const express = require('express');
const router = express.Router();
const {
  getRecommendations
} = require('../controllers/recommendationController');

/**
 * @swagger
 * tags:
 *   - name: Recommendations
 *     description: Anime recommendations
 */

/**
 * @swagger
 * /api/recommendations/{malId}:
 *   get:
 *     summary: Get recommendations for an anime by MAL ID
 *     description: Retrieves all recommended anime for a specific anime with full details
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recommendation'
 *       500:
 *         description: Server error
 */
router.get('/:malId', async (req, res) => {
  try {
    const malId = parseInt(req.params.malId);
    if (isNaN(malId)) return res.status(400).json({ message: 'Invalid MAL ID' });

    const recommendations = await getRecommendations(malId);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching recommendations', 
      error  : error.message 
    });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Recommendation:
 *       type: object
 *       required:
 *         - recommendation_mal_id
 *       properties:
 *         recommendation_mal_id:
 *           type: integer
 *           description: MAL ID of the recommended anime
 *           example: 1735
 *       example:
 *         recommendation_mal_id: 1735
 */

module.exports = router;
