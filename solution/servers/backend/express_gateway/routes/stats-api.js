const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const BACKEND_MONGO_URL  = 'http://localhost:3002/api';
const BACKEND_SPRING_URL = 'http://localhost:8080/api';

/**
 * @swagger
 * /api/stats/global:
 *   get:
 *     summary: Get global site statistics
 *     description: Combines profile/rating data from MongoDB with total counts from Spring Boot.
 *     tags: [Statistics]
 *   responses:
 *     200:
 *       description: Successfully retrieved merged global statistics
 *     500:
 *       description: Internal server error while fetching data
 */
router.get('/global', async (req, res) => {
  try {
    const mongoStats         = await axios.get(`${BACKEND_MONGO_URL}/stats/global`);
    const animeCountResponse = await axios.get(`${BACKEND_SPRING_URL}/anime/count`);
    
    const globalStats = {
      ...mongoStats.data,
      totalAnime: animeCountResponse.data
    };
    
    res.json(globalStats);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching global stats', 
      error  : error.message 
    });
  }
});

/**
 * @swagger
 * /api/stats/user/{username}:
 *   get:
 *     summary: Get specific user statistics
 *     description: Retrieves user-specific engagement data from the MongoDB backend.
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *           description: The username to retrieve stats for
 *           example: "CKK2"
 *     responses:
 *       200:
 *         description: User statistics retrieved
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/user/:username', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_MONGO_URL}/stats/user/${req.params.username}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: 'Error fetching user stats',
      error  : error.message
    });
  }
});

/**
 * @swagger
 * /api/stats/anime/{animeId}:
 *   get:
 *     summary: Get detailed anime statistics and metadata
 *     description: Fetches engagement stats from MongoDB and attempts to join details from Spring Boot/PostgreSQL.
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: animeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the anime
 *         example: 21
 *     responses:
 *       200:
 *         description: Anime stats and details (details may be null if Spring Boot is unreachable)
 *       500:
 *         description: Error fetching statistics
 */
router.get('/anime/:animeId', async (req, res) => {
  try {
    const statsResponse = await axios.get(`${BACKEND_MONGO_URL}/stats/anime/${req.params.animeId}`);
    let animeDetails = null;

    try {
      const animeResponse = await axios.get(`${BACKEND_SPRING_URL}/anime/${req.params.animeId}`);
      animeDetails = animeResponse.data;
    } catch (animeError) {
      console.log(`Could not fetch anime details for ${req.params.animeId}:`, animeError.message);
    }

    res.json({
      stats       : statsResponse.data,
      animeDetails: animeDetails
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching anime stats', 
      error  : error.message 
    });
  }
});

module.exports = router;
