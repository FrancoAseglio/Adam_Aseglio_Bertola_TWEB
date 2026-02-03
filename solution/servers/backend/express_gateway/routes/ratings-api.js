const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const BACKEND_MONGO_URL  = 'http://localhost:3002/api';
const BACKEND_SPRING_URL = 'http://localhost:8080/api';

/**
 * @swagger
 * /api/ratings/{username}:
 *   get:
 *     summary: Get user's ratings with anime details
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username
 *         example: CKK2
 *     responses:
 *       200:
 *         description: List of ratings with anime details
 *       500:
 *         description: Server error
 */
router.get('/:username', async (req, res) => {
  try {
    const ratingsResponse = await axios.get(`${BACKEND_MONGO_URL}/ratings/${req.params.username}`);
    const ratings         = ratingsResponse.data;

    const ratingsWithDetails = await Promise.all(
      ratings.map(async (rating) => {
        try {
          const animeResponse = await axios.get(`${BACKEND_SPRING_URL}/anime/${rating.anime_id}`);

          return {
            ...rating,
            animeDetails: animeResponse.data
          };
        } catch (error) {
          console.error(`Error fetching anime details for ${rating.anime_id}:`, error.message);

          return {
            ...rating,
            animeDetails: null
          };
        }
      })
    );

    res.json(ratingsWithDetails);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching ratings', 
      error  : error.message
    });
  }
});

module.exports = router;
